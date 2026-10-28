'use strict';

var fs = require('fs');
var path = require('path');
var { JSDOM } = require('jsdom');

var rawDir = path.join(__dirname, '..', 'tmp-live-extract', 'raw');
var files = [
  'careers.html',
  'careers-front-end-engineer.html',
  'careers-python-engineer.html',
  'multi-step-contact-form.html',
  'terms-of-service.html',
  'privacy-policy.html',
  'toptal-hire-inspect.html'
];

files.forEach(function (file) {
  var html = fs.readFileSync(path.join(rawDir, file), 'utf8');
  var dom = new JSDOM(html);
  var doc = dom.window.document;
  console.log('\n======== ' + file + ' ========');
  console.log('title:', (doc.querySelector('title') || {}).textContent);
  console.log('h1-h6 count:', doc.querySelectorAll('h1,h2,h3,h4,h5,h6').length);
  doc.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(function (h) {
    console.log(' ', h.tagName, JSON.stringify(h.textContent.trim().slice(0, 120)));
  });

  // script tags with form / job data
  var scripts = Array.from(doc.querySelectorAll('script'));
  console.log('scripts:', scripts.length);
  scripts.forEach(function (s, i) {
    var t = s.textContent || '';
    if (t.length < 40) return;
    var interesting =
      /form|field|job|career|step|hsForm|hs-form|widget|pageId|module_/i.test(t) &&
      !/gtm|analytics|facebook|linkedin|hotjar/i.test(s.src || '');
    if (interesting || /hsforms|hs-script|hs-form/i.test(s.src || '') || /hsforms|hs-script|hs-form/i.test(t.slice(0, 200))) {
      console.log(' script[' + i + '] src=' + (s.src || '(inline)') + ' len=' + t.length);
      if (!s.src && interesting) {
        // print snippets around form field definitions
        var idx = t.search(/formId|fields|label|name\":\"|step/i);
        if (idx >= 0) console.log('  snippet:', t.slice(Math.max(0, idx - 80), idx + 400).replace(/\s+/g, ' '));
      }
    }
  });

  // iframes
  doc.querySelectorAll('iframe').forEach(function (f) {
    console.log(' iframe', f.getAttribute('src') || f.getAttribute('data-src'));
  });

  // data attributes on form embeds
  doc.querySelectorAll('[data-form-id], [class*="hs-form"], [id*="hs_form"]').forEach(function (el) {
    console.log(
      ' formish',
      el.tagName,
      'id=' + el.id,
      'form-id=' + el.getAttribute('data-form-id'),
      'portal=' + el.getAttribute('data-portal-id'),
      'class=' + (el.getAttribute('class') || '').slice(0, 80)
    );
    console.log('  html slice:', el.outerHTML.slice(0, 300).replace(/\s+/g, ' '));
  });

  // body text sample without nav - look for main content wrappers
  ['main', '.body-container-wrapper', '#main-content', '.dnd_area-main', '.row-fluid-wrapper'].forEach(function (sel) {
    var el = doc.querySelector(sel);
    if (el) console.log(' found', sel, 'textLen=', el.textContent.trim().length);
  });

  // unique text blocks longer than 80 chars
  var paras = Array.from(doc.querySelectorAll('p,div,span,li'))
    .map(function (el) {
      return el.textContent.trim().replace(/\s+/g, ' ');
    })
    .filter(function (t) {
      return t.length > 80 && t.length < 500;
    });
  var seen = Object.create(null);
  var uniq = [];
  paras.forEach(function (t) {
    if (seen[t]) return;
    seen[t] = true;
    uniq.push(t);
  });
  console.log('unique mid-length text blocks:', uniq.length);
  uniq.slice(0, 15).forEach(function (t, i) {
    console.log('  T' + i + ':', t.slice(0, 160));
  });
});
