// CloudFront Function for www.betterengineer.com (viewer request, runtime cloudfront-js-2.0).
// Paste into CloudFront > Functions, publish, then attach to the www distribution's
// default behavior as "Viewer request". See go-live-simple.md.
//
// Order: apex to www, then fixed 301s, then /roles and /technologies to discover,
// then lowercase page paths, then serve /path and /path/ from /path/index.html
// (200, no redirect hop).
// Query strings (UTMs) are kept on every redirect.

var DISCOVER = 'https://discover.betterengineer.com';

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

function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var host = request.headers.host ? request.headers.host.value.toLowerCase() : '';
  var qs = queryString(request.querystring);

  if (host === 'betterengineer.com') {
    return redirect('https://www.betterengineer.com' + uri + qs);
  }

  var key = uri.length > 1 && uri.charAt(uri.length - 1) === '/' ? uri.slice(0, -1) : uri;
  var lower = key.toLowerCase();

  if (REDIRECTS[lower]) {
    return redirect(REDIRECTS[lower] + qs);
  }

  if (lower === '/roles' || lower === '/technologies' ||
      lower.indexOf('/roles/') === 0 || lower.indexOf('/technologies/') === 0) {
    var last = key.slice(key.lastIndexOf('/') + 1);
    return redirect(DISCOVER + key + (last.indexOf('.') === -1 ? '/' : '') + qs);
  }

  // HubSpot matched paths case-insensitively; S3 does not. Pages are all lowercase.
  if (key !== lower && key.slice(key.lastIndexOf('/') + 1).indexOf('.') === -1) {
    return redirect('https://www.betterengineer.com' + lower + qs);
  }

  if (uri.charAt(uri.length - 1) === '/') {
    request.uri = uri + 'index.html';
  } else if (uri.slice(uri.lastIndexOf('/') + 1).indexOf('.') === -1) {
    request.uri = uri + '/index.html';
  }
  return request;
}
