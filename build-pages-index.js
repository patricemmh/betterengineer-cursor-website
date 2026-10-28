#!/usr/bin/env node
/**
 * Generate a read-only marketing page index from website source data.
 *
 * Source of truth: data/pages.js, data/technologies.js, and roles/{slug}/index.html.
 * This file does not invent keywords, titles, or relationships that are not
 * already in those sources. Analytics should copy the JSON; it should not
 * maintain a second page list.
 *
 * Output: data/pages-index.json
 * That file is an artifact for Marketing Intelligence. It is not a public
 * website page and is not added to the www/discover HTML output.
 *
 * Usage: node build-pages-index.js
 */
'use strict';

var fs = require('fs');
var path = require('path');

var root = __dirname;
var pagesManifest = require('./data/pages.js');
var techModule = require('./data/technologies.js');
var technologies = techModule.technologies || [];

var ROLE_META = {
  'front-end-engineers': { name: 'Front-end engineers' },
  'back-end-engineers': { name: 'Back-end engineers' },
  'full-stack-engineers': { name: 'Full-stack engineers' },
  'mobile-engineers': { name: 'Mobile engineers' },
  'devops-engineers': { name: 'DevOps engineers' },
  'data-engineers': { name: 'Data engineers' },
  'data-science-engineers': { name: 'Data science engineers' },
  'ai-engineers': { name: 'AI engineers' },
  'qa-engineers': { name: 'QA engineers' },
  'blockchain-engineers': { name: 'Blockchain engineers' },
};

var PAGE_TYPE_BY_SLUG = {
  home: 'landing-page',
  'engineer-playlist': 'resource',
  'ai-systems-readiness-for-manufacturing': 'solution',
  'hire-ai-ready-engineers': 'solution',
  'staff-augmentation': 'solution',
  'ai-readiness': 'solution',
  'hiring-dashboard': 'solution',
  about: 'company',
  latamengineer: 'solution',
  contact: 'company',
  join: 'company',
  faqs: 'resource',
  podcast: 'resource',
  ebooks: 'resource',
  'technical-glossary': 'resource',
};

function urlFromOutput(output) {
  var rel = String(output || '').replace(/\\/g, '/').replace(/index\.html$/, '').replace(/\.html$/, '');
  if (!rel || rel === 'index.html') return '/';
  if (rel.charAt(0) !== '/') rel = '/' + rel;
  if (rel !== '/' && !rel.endsWith('/')) rel += '/';
  return rel;
}

function pathFromCanonical(canonical) {
  if (typeof canonical !== 'string') return null;
  try {
    var u = new URL(canonical);
    var p = u.pathname || '/';
    if (p !== '/' && !p.endsWith('/')) p += '/';
    return p;
  } catch (e) {
    return null;
  }
}

function unique(list) {
  var seen = Object.create(null);
  var out = [];
  list.forEach(function (item) {
    if (!item || seen[item]) return;
    seen[item] = true;
    out.push(item);
  });
  return out;
}

function record(partial) {
  return {
    url: partial.url,
    aliases: partial.aliases && partial.aliases.length ? unique(partial.aliases.filter(function (a) { return a !== partial.url; })) : [],
    hosts: partial.hosts || [],
    title: partial.title,
    pageType: partial.pageType,
    category: Object.prototype.hasOwnProperty.call(partial, 'category') ? partial.category : null,
    status: partial.status,
    primaryKeyword: Object.prototype.hasOwnProperty.call(partial, 'primaryKeyword') ? partial.primaryKeyword : null,
    secondaryKeywords: partial.secondaryKeywords || [],
    relatedPages: partial.relatedPages || [],
  };
}

var records = [];

pagesManifest.pages.forEach(function (page) {
  var outputs = page.outputs || [];
  var urls = outputs.map(urlFromOutput);
  var canonicalPath = pathFromCanonical(page.canonical);
  if (canonicalPath) urls.unshift(canonicalPath);
  if (page.slug === 'hire-ai-ready-engineers') urls.push('/ai-fluent-engineers/');
  urls = unique(urls);
  var url = urls[0] || '/';
  var category = null;
  if (page.navActive === 'services') category = 'Services';
  else if (page.navActive === 'about') category = 'Company';
  else if (page.navActive === 'join') category = 'Careers';
  records.push(record({
    url: url,
    aliases: urls.slice(1),
    hosts: ['www.betterengineer.com'],
    title: page.title,
    pageType: PAGE_TYPE_BY_SLUG[page.slug] || 'other',
    category: category,
    status: 'live',
  }));
});

records.push(record({
  url: '/roles/',
  hosts: ['discover.betterengineer.com'],
  title: 'Software Engineering Roles | BetterEngineer',
  pageType: 'role',
  category: null,
  status: 'live',
}));

records.push(record({
  url: '/technologies/',
  hosts: ['discover.betterengineer.com'],
  title: 'Technologies | BetterEngineer',
  pageType: 'technology',
  category: null,
  status: 'live',
}));

var rolesDir = path.join(root, 'roles');
fs.readdirSync(rolesDir).forEach(function (name) {
  if (name === 'roles-template' || name === 'index.html') return;
  var rolePath = path.join(rolesDir, name, 'index.html');
  if (!fs.existsSync(rolePath)) return;
  var meta = ROLE_META[name] || { name: name };
  var related = [];
  technologies.forEach(function (t) {
    if (t.status !== 'published') return;
    if ((t.relatedRoles || []).indexOf(name) !== -1) {
      related.push('/technologies/' + t.slug + '/');
    }
  });
  records.push(record({
    url: '/roles/' + name + '/',
    hosts: ['discover.betterengineer.com'],
    title: meta.name,
    pageType: 'role',
    category: null,
    status: 'live',
    relatedPages: unique(related),
  }));
});

technologies.forEach(function (t) {
  var related = [];
  (t.relatedTechnologies || []).forEach(function (slug) {
    related.push('/technologies/' + slug + '/');
  });
  (t.relatedRoles || []).forEach(function (slug) {
    related.push('/roles/' + slug + '/');
  });
  var live = t.status === 'published';
  records.push(record({
    url: '/technologies/' + t.slug + '/',
    hosts: ['discover.betterengineer.com'],
    title: t.name,
    pageType: 'technology',
    category: t.category || null,
    status: live ? 'live' : (t.status || 'planned'),
    primaryKeyword: t.keyword && t.keyword.primary ? t.keyword.primary : null,
    secondaryKeywords: (t.keyword && t.keyword.secondary) || [],
    relatedPages: live ? unique(related) : unique(related),
  }));
});

var payload = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString().slice(0, 10),
  sourceOfTruth: {
    repository: 'betterengineer-cursor-website',
    files: ['data/pages.js', 'data/technologies.js', 'roles/{slug}/index.html'],
    note: 'Marketing Intelligence should copy this file. Do not hand-edit a second page list in analytics.',
  },
  pageTypes: ['role', 'technology', 'industry', 'solution', 'resource', 'company', 'landing-page', 'other'],
  pages: records,
};

var outPath = path.join(root, 'data', 'pages-index.json');
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n');
process.stdout.write('Wrote ' + path.relative(root, outPath) + ' (' + payload.pages.length + ' pages)\n');
