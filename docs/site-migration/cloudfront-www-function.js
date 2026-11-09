// One CloudFront Function for distribution E2014GBUWTTSVJ (discover + www + apex).
// Viewer request, runtime cloudfront-js-2.0.
// Paste into CloudFront and Publish after editing. CloudFront does not read git.
// Career redirects added 2026-11-09 are not live until the next paste. HTML stubs cover them until then.
// See cloudfront-function.md.
//
// Bucket layout (betterengineer-marketing-site):
//   /            discover files (kept; the hostname 301s to www)
//   /www/        www files (dist-www/), including /roles/ and /technologies/
//
// betterengineer.com          301 to www, same path and query
// www.betterengineer.com      fixed 301s, then serve pages from /www/...
// discover.betterengineer.com /www guard first, then 301 to the same www path
// Query strings (UTMs, gclid) are kept on every redirect.

var WWW = 'https://www.betterengineer.com';
var WWW_PREFIX = '/www';

var REDIRECTS = {
  '/hire-senior-python-engineers-nearshore-latam-talent': WWW + '/technologies/python-developers/',
  '/hire-senior-full-stack-engineers-nearshore-latam-talent': WWW + '/roles/full-stack-engineers/',
  '/hire-senior-ai-data-engineers-nearshore-latam-talent': WWW + '/roles/ai-engineers/',
  '/ai-readiness-manufacturing': WWW + '/services/ai-systems-readiness-for-manufacturing/',
  '/aimanufacturing': WWW + '/services/ai-systems-readiness-for-manufacturing/',
  '/careers/cordova-c-engineer': '/careers/react-native-engineer/',
  '/careers/groovy-on-grails-engineer': '/careers/java-engineer/',
  '/careers/openstack-engineer': '/careers/devops-engineer/',
  '/careers/peoplesoft-consultant': '/careers/',
  '/careers/drupal-engineer': '/careers/wordpress-engineer/',
  '/careers/ms-dynamics-crm-engineer': '/careers/',
  '/careers/cloudops-engineer': '/careers/devops-engineer/',
  '/careers/e-commerce-engineer': '/careers/shopify-engineer/',
  '/careers/project-manager': '/careers/',
  '/careers/elixir-engineer': '/careers/',
  '/careers/scala-engineer': '/careers/',
  '/careers/embedded-software-engineer': '/careers/',
  '/careers/magneto-engineer': '/careers/magento-engineer/',
  '/webinar': '/contact/',
  '/aiwebinar': '/contact/',
  '/roi': '/staff-augmentation/',
  '/hiring-dashboard-old': '/hiring-dashboard/',
  '/careers-test': '/careers/',
  '/blog': 'https://blog.betterengineer.com/resource-center',
  '/services/hire-ai-ready-engineers': '/ai-fluent-engineers/'
};

/* One hop from the discover host. Webinar, roi, blog, and the test slugs stay
   on the www map so this host forwards those paths unchanged first. */
var DISCOVER_REDIRECTS = {
  '/hire-senior-python-engineers-nearshore-latam-talent': '/technologies/python-developers/',
  '/hire-senior-full-stack-engineers-nearshore-latam-talent': '/roles/full-stack-engineers/',
  '/hire-senior-ai-data-engineers-nearshore-latam-talent': '/roles/ai-engineers/',
  '/ai-readiness-manufacturing': '/services/ai-systems-readiness-for-manufacturing/',
  '/aimanufacturing': '/services/ai-systems-readiness-for-manufacturing/',
  '/services/hire-ai-ready-engineers': '/ai-fluent-engineers/'
};

function queryString(qs) {
  var parts = [];
  for (var key in qs) {
    var item = qs[key];
    var values = item.multiValue ? item.multiValue : [item];
    for (var i = 0; i < values.length; i++) {
      parts.push(values[i].value === '' ? key : key + '=' + values[i].value);
    }
  }
  return parts.length ? '?' + parts.join('&') : '';
}

function redirect(location) {
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: { location: { value: location } }
  };
}

function hasExtension(path) {
  return path.slice(path.lastIndexOf('/') + 1).indexOf('.') !== -1;
}

function indexFile(uri) {
  if (uri.charAt(uri.length - 1) === '/') return uri + 'index.html';
  if (!hasExtension(uri)) return uri + '/index.html';
  return uri;
}

function fluencyAlias(key, lower, qs) {
  if (lower === '/ai-fluent-engineers' && key !== lower) {
    return redirect(WWW + '/ai-fluent-engineers/' + qs);
  }
  return null;
}

function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var host = request.headers.host ? request.headers.host.value.toLowerCase() : '';
  var qs = queryString(request.querystring);
  var key = uri.length > 1 && uri.charAt(uri.length - 1) === '/' ? uri.slice(0, -1) : uri;
  var lower = key.toLowerCase();

  if (host === 'betterengineer.com') {
    return redirect(WWW + uri + qs);
  }

  if (host !== 'www.betterengineer.com') {
    if (uri === WWW_PREFIX || uri.indexOf(WWW_PREFIX + '/') === 0) {
      return redirect(WWW + (uri.slice(WWW_PREFIX.length) || '/') + qs);
    }
    var alias = fluencyAlias(key, lower, qs);
    if (alias) return alias;
    if (DISCOVER_REDIRECTS[lower]) {
      return redirect(WWW + DISCOVER_REDIRECTS[lower] + qs);
    }
    return redirect(WWW + (hasExtension(uri) ? uri : uri.toLowerCase()) + qs);
  }

  var wwwAlias = fluencyAlias(key, lower, qs);
  if (wwwAlias) return wwwAlias;

  if (REDIRECTS[lower]) {
    return redirect(REDIRECTS[lower] + qs);
  }

  if (key !== lower && !hasExtension(key)) {
    return redirect(WWW + lower + qs);
  }

  request.uri = WWW_PREFIX + indexFile(uri);
  return request;
}
