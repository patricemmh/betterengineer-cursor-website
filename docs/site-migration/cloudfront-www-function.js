// One CloudFront Function for distribution E2014GBUWTTSVJ (discover + www + apex).
// Viewer request, runtime cloudfront-js-2.0. It replaces the discover function on
// the default behavior. See go-live-simple.md.
//
// Bucket layout (betterengineer-marketing-site):
//   /            discover files (unchanged, deployed by the marketing-site workflow)
//   /www/        www files (dist-www/)
//
// betterengineer.com          301 to www, same path and query
// www.betterengineer.com      fixed 301s, /roles and /technologies to discover,
//                             lowercase page paths, then serve from /www/...
// any other host (discover)   same as before: /path and /path/ serve /path/index.html
// Query strings (UTMs, gclid) are kept on every redirect.

var WWW = 'https://www.betterengineer.com';
var DISCOVER = 'https://discover.betterengineer.com';
var WWW_PREFIX = '/www';

var REDIRECTS = {
  '/hire-senior-python-engineers-nearshore-latam-talent': DISCOVER + '/technologies/python-developers/',
  '/hire-senior-full-stack-engineers-nearshore-latam-talent': DISCOVER + '/roles/full-stack-engineers/',
  '/hire-senior-ai-data-engineers-nearshore-latam-talent': DISCOVER + '/roles/ai-engineers/',
  '/ai-readiness-manufacturing': DISCOVER + '/aimanufacturing/',
  '/webinar': '/contact/',
  '/aiwebinar': '/contact/',
  '/roi': '/staff-augmentation/',
  '/hiring-dashboard-old': '/hiring-dashboard/',
  '/careers-test': '/careers/',
  '/blog': 'https://blog.betterengineer.com/resource-center'
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

function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var host = request.headers.host ? request.headers.host.value.toLowerCase() : '';

  if (host === 'betterengineer.com') {
    return redirect(WWW + uri + queryString(request.querystring));
  }

  if (host !== 'www.betterengineer.com') {
    if (uri === WWW_PREFIX || uri.indexOf(WWW_PREFIX + '/') === 0) {
      return redirect(WWW + (uri.slice(WWW_PREFIX.length) || '/') + queryString(request.querystring));
    }
    request.uri = indexFile(uri);
    return request;
  }

  var qs = queryString(request.querystring);
  var key = uri.length > 1 && uri.charAt(uri.length - 1) === '/' ? uri.slice(0, -1) : uri;
  var lower = key.toLowerCase();

  if (REDIRECTS[lower]) {
    return redirect(REDIRECTS[lower] + qs);
  }

  if (lower === '/roles' || lower === '/technologies' ||
      lower.indexOf('/roles/') === 0 || lower.indexOf('/technologies/') === 0) {
    return redirect(DISCOVER + lower + (hasExtension(lower) ? '' : '/') + qs);
  }

  // HubSpot matched paths case-insensitively; S3 does not. Pages are all lowercase.
  if (key !== lower && !hasExtension(key)) {
    return redirect(WWW + lower + qs);
  }

  request.uri = WWW_PREFIX + indexFile(uri);
  return request;
}
