'use strict';

/**
 * Fetch HubSpot Resource Center RSS at build time and cache it.
 *
 * The blog stays on blog.betterengineer.com. This script only pulls title, URL,
 * tags, excerpt, and featured-image URL so migrated pages can render a static
 * preview. A failed fetch reuses data/blog-feed.json so offline builds still work.
 *
 * Usage: node build-blog-feed.js
 */

var fs = require('fs');
var path = require('path');
var https = require('https');
var http = require('http');

var root = __dirname;
var cachePath = path.join(root, 'data', 'blog-feed.json');
var LIMIT = 3;
var FETCH_MS = 12000;

var FEEDS = {
  latest: 'https://blog.betterengineer.com/resource-center/rss.xml',
  ai: 'https://blog.betterengineer.com/resource-center/tag/artificial-intelligence/rss.xml',
  join: 'https://blog.betterengineer.com/resource-center/tag/for-candidates/rss.xml',
};

function decodeXml(text) {
  return String(text || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function stripHtml(html) {
  return decodeXml(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function withoutEmDash(text) {
  return String(text || '').replace(/\u2014/g, ', ').replace(/\s+,/g, ',').replace(/\s{2,}/g, ' ').trim();
}

function tagField(chunk, tag) {
  var m = chunk.match(new RegExp('<' + tag + '>([\\s\\S]*?)</' + tag + '>', 'i'));
  return m ? decodeXml(m[1].trim()) : '';
}

function tagSlug(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function featuredImage(descriptionHtml) {
  var html = decodeXml(descriptionHtml);
  var featured = html.match(/class="hs-featured-image"[^>]*src="([^"]+)"/i) ||
    html.match(/src="([^"]+)"[^>]*class="hs-featured-image"/i);
  if (featured) return featured[1];
  var hubfs = html.match(/src="(https?:\/\/[^"]*\/hubfs\/[^"]+)"/i);
  return hubfs ? hubfs[1] : '';
}

function excerptFrom(descriptionHtml) {
  var text = stripHtml(descriptionHtml);
  if (text.length <= 160) return withoutEmDash(text);
  var sliced = text.slice(0, 157).replace(/\s+\S*$/, '');
  return withoutEmDash(sliced) + '...';
}

function parseItems(xml) {
  return xml.split(/<item>/i).slice(1).map(function (chunk) {
    var cats = [];
    var re = /<category>([\s\S]*?)<\/category>/gi;
    var m;
    while ((m = re.exec(chunk))) cats.push(decodeXml(m[1].trim()));
    var description = tagField(chunk, 'description');
    var title = withoutEmDash(tagField(chunk, 'title'));
    var url = tagField(chunk, 'link');
    return {
      title: title,
      url: url,
      date: tagField(chunk, 'pubDate') || tagField(chunk, 'dc:date'),
      tags: cats.filter(Boolean),
      image: featuredImage(description),
      excerpt: excerptFrom(description),
    };
  }).filter(function (post) {
    return post.title && post.url;
  });
}

function fetchText(url) {
  return new Promise(function (resolve, reject) {
    var timedOut = false;
    var timer = setTimeout(function () {
      timedOut = true;
      reject(new Error('timeout fetching ' + url));
    }, FETCH_MS);

    var client = url.indexOf('https:') === 0 ? https : http;
    var req = client.get(url, {
      headers: {
        'User-Agent': 'BetterEngineerSiteBuild/1.0',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
    }, function (res) {
      if (timedOut) return;
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        clearTimeout(timer);
        fetchText(res.headers.location).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        clearTimeout(timer);
        reject(new Error('HTTP ' + res.statusCode + ' for ' + url));
        return;
      }
      var chunks = [];
      res.on('data', function (c) { chunks.push(c); });
      res.on('end', function () {
        clearTimeout(timer);
        resolve(Buffer.concat(chunks).toString('utf8'));
      });
    });
    req.on('error', function (err) {
      clearTimeout(timer);
      reject(err);
    });
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderPostCard(post) {
  var title = escapeHtml(post.title);
  var url = escapeHtml(post.url);
  var lines = ['          <article class="post-card reveal">'];
  if (post.image) {
    lines.push(
      '            <a class="post-card__cover" href="' + url + '" rel="noopener noreferrer">',
      '              <img src="' + escapeHtml(post.image) + '" alt="" width="800" height="500" loading="lazy">',
      '            </a>',
    );
  }
  if (post.tags && post.tags.length) {
    lines.push('            <ul class="post-card__tags">');
    post.tags.forEach(function (tag) {
      var slug = tagSlug(tag);
      var href = 'https://blog.betterengineer.com/resource-center/tag/' + escapeHtml(slug);
      lines.push(
        '              <li><a class="post-card__tag" href="' + href + '" rel="noopener noreferrer">' + escapeHtml(tag) + '</a></li>',
      );
    });
    lines.push('            </ul>');
  }
  lines.push(
    '            <h3 class="post-card__title"><a href="' + url + '" rel="noopener noreferrer">' + title + '</a></h3>',
    '            <p class="post-card__excerpt">' + escapeHtml(post.excerpt) + '</p>',
    '            <a class="post-card__more" href="' + url + '" rel="noopener noreferrer" aria-label="Read more: ' + title + '">Read more</a>',
    '          </article>',
  );
  return lines.join('\n');
}

function renderPostGrid(posts) {
  if (!posts || !posts.length) {
    return '          <!-- blog feed empty: using cache or fetch returned no posts -->';
  }
  return posts.map(renderPostCard).join('\n');
}

function readCache() {
  try {
    return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  } catch (err) {
    return { fetchedAt: null, feeds: {} };
  }
}

function writeCache(data) {
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.writeFileSync(cachePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

async function fetchFeeds() {
  var cache = readCache();
  var next = {
    fetchedAt: new Date().toISOString(),
    source: FEEDS,
    feeds: Object.assign({}, cache.feeds),
  };
  var keys = Object.keys(FEEDS);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    try {
      var xml = await fetchText(FEEDS[key]);
      var posts = parseItems(xml).slice(0, LIMIT);
      if (!posts.length) throw new Error('no posts parsed');
      next.feeds[key] = posts;
      console.log('Blog feed "' + key + '": ' + posts.length + ' posts');
    } catch (err) {
      console.warn('warn: blog feed "' + key + '" fetch failed (' + err.message + '); using cache');
    }
  }
  writeCache(next);
  return next;
}

module.exports = {
  cachePath: cachePath,
  renderPostGrid: renderPostGrid,
  readCache: readCache,
};

if (require.main === module) {
  fetchFeeds().catch(function (err) {
    console.warn('warn: blog feed build failed (' + err.message + '); using cache if present');
    if (!fs.existsSync(cachePath)) {
      writeCache({ fetchedAt: null, feeds: {} });
    }
  });
}
