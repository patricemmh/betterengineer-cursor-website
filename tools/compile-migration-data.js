'use strict';

/**
 * Compile structured data for remaining HubSpot conversion pages from live
 * extracts in tmp-live-extract/. Run when re-extracting. The committed
 * data/*.js files are the source of truth for the generators.
 *
 *   node tools/compile-migration-data.js
 */

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var extractDir = path.join(root, 'tmp-live-extract');

function read(rel) {
  return fs.readFileSync(path.join(extractDir, rel), 'utf8');
}

function writeJs(rel, body) {
  fs.writeFileSync(path.join(root, rel), body.charAt(body.length - 1) === '\n' ? body : body + '\n');
  console.log('wrote', rel);
}

function stripEm(s) {
  return String(s || '')
    .replace(/—/g, ', ')
    .replace(/–/g, '-')
    .replace(/\s+,/g, ',')
    .replace(/,\s+,/g, ',')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function htmlToText(html) {
  return stripEm(
    String(html || '')
      .replace(/<\s*br\s*\/?>/gi, '\n')
      .replace(/<\/(p|li|h[1-6]|div)>/gi, '\n')
      .replace(/<li[^>]*>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#0?39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/[ \t]+/g, ' ')
      .replace(/\s*\n\s*/g, '\n')
      .replace(/\n{2,}/g, '\n')
      .trim(),
  );
}

function cleanAnswerHtml(html) {
  return String(html || '')
    .replace(/\sstyle="[^"]*"/g, '')
    .replace(/\sdata-[a-z-]+="[^"]*"/g, '')
    .replace(/—/g, ', ')
    .replace(/<p>\s*&nbsp;\s*<\/p>/gi, '')
    .trim();
}

function parseMdTokens(md) {
  var part = md.split('## 2. Content')[1] || '';
  part = part.split(/\n## [0-9]+\./)[0];
  var lines = part.split(/\r?\n/);
  var tokens = [];
  var i = 0;

  function collectQuote() {
    var bits = [];
    while (i < lines.length && !lines[i].trim()) i++;
    while (i < lines.length && /^> /.test(lines[i])) {
      bits.push(lines[i].replace(/^> /, ''));
      i++;
    }
    return bits.join(' ').replace(/\s+/g, ' ').trim();
  }

  function collectList() {
    var items = [];
    while (i < lines.length && !lines[i].trim()) i++;
    while (i < lines.length && /^> - /.test(lines[i])) {
      items.push(lines[i].replace(/^> - /, '').trim());
      i++;
    }
    return items;
  }

  while (i < lines.length) {
    var line = lines[i];
    var h = line.match(/^### (H[1-6])$/);
    if (h) {
      i++;
      tokens.push({ type: 'h', level: Number(h[1].slice(1)), text: collectQuote() });
      continue;
    }
    if (line === '**p:**') {
      i++;
      tokens.push({ type: 'p', text: collectQuote() });
      continue;
    }
    if (/^\*\*list/.test(line)) {
      i++;
      tokens.push({ type: 'list', ordered: /ol/.test(line), items: collectList() });
      continue;
    }
    i++;
  }
  return tokens;
}

function extractFaqs(html) {
  var faqs = [];
  var chunks = String(html || '').split(/<details\b/i);
  chunks.slice(1).forEach(function (chunk) {
    var qMatch = chunk.match(/<a class="summary_wrapper"[^>]*>([\s\S]*?)<\/a>/i);
    var aMatch = chunk.match(/data-hs-cos-field="details">([\s\S]*?)<\/div>/i);
    if (!qMatch || !aMatch) return;
    var q = htmlToText(qMatch[1]);
    var aHtml = cleanAnswerHtml(aMatch[1]);
    var a = htmlToText(aHtml);
    if (q && a) faqs.push({ q: q, a: a, aHtml: aHtml });
  });
  return faqs;
}

function buildIndustry(slug, mdFile, htmlFile, extras) {
  var md = read(mdFile);
  var html = read(htmlFile);
  var tokens = parseMdTokens(md);
  var titleMatch = md.match(/\| title tag \| `([^`]+)`/);
  var descMatch = md.match(/\| meta description \| `([^`]+)`/);
  var h1 = '';
  var leads = [];
  var solutionsHeading = '';
  var clusters = [];
  var reasonsHeading = '';
  var reasons = [];
  var i = 0;

  while (i < tokens.length) {
    var t = tokens[i];
    if (t.type === 'h' && t.level === 1 && !h1) {
      h1 = t.text;
      i++;
      while (i < tokens.length && tokens[i].type === 'p') {
        if (!/^Trusted by Leaders/.test(tokens[i].text)) leads.push(tokens[i].text);
        i++;
      }
      continue;
    }
    if (t.type === 'h' && t.level === 1 && /Solutions/.test(t.text)) {
      solutionsHeading = t.text;
      i++;
      continue;
    }
    if (t.type === 'h' && t.level === 2 && /^Why /.test(t.text) && /Choose Us/.test(t.text)) {
      reasonsHeading = t.text;
      i++;
      while (i < tokens.length) {
        var r = tokens[i];
        if (r.type === 'h' && r.level === 3) {
          var reason = { title: r.text, body: '' };
          i++;
          if (i < tokens.length && tokens[i].type === 'p') {
            reason.body = tokens[i].text;
            i++;
          }
          reasons.push(reason);
          continue;
        }
        break;
      }
      continue;
    }
    if (t.type === 'h' && t.level === 2 && /^Yes, we do work/.test(t.text)) break;
    if (t.type === 'h' && t.level === 2 && /^Our Process/.test(t.text)) break;
    if (t.type === 'h' && t.level === 2) {
      var cluster = { title: t.text, lead: '', items: [] };
      i++;
      if (i < tokens.length && tokens[i].type === 'p') {
        cluster.lead = tokens[i].text;
        i++;
      }
      while (i < tokens.length && tokens[i].type === 'h' && tokens[i].level === 4) {
        var item = { title: tokens[i].text, body: '' };
        i++;
        if (i < tokens.length && tokens[i].type === 'p') {
          item.body = tokens[i].text;
          i++;
        }
        cluster.items.push(item);
      }
      clusters.push(cluster);
      continue;
    }
    i++;
  }

  var faqs = extractFaqs(html);
  var heroDirectAnswer = stripEm(leads[0] || '');

  return {
    name: extras.name,
    slug: slug,
    status: 'published',
    category: extras.category,
    title: titleMatch ? titleMatch[1] : extras.name,
    metaDescription: descMatch ? descMatch[1] : '',
    h1: stripEm(h1),
    heroLead: stripEm(leads.join(' ')),
    heroDirectAnswer: heroDirectAnswer,
    solutionsHeading: stripEm(solutionsHeading),
    clusters: clusters.map(function (c) {
      return {
        title: stripEm(c.title),
        lead: stripEm(c.lead),
        items: c.items.map(function (it) {
          return { title: stripEm(it.title), body: stripEm(it.body) };
        }),
      };
    }),
    reasonsHeading: stripEm(reasonsHeading),
    reasons: reasons.map(function (r) {
      return { title: stripEm(r.title), body: stripEm(r.body) };
    }),
    faqs: faqs,
    relatedIndustries: extras.relatedIndustries,
    relatedRoles: extras.relatedRoles,
    relatedTechnologies: extras.relatedTechnologies,
    atAGlance: (reasons.slice(0, 6) || []).map(function (r) {
      return [r.title, stripEm(r.body)];
    }),
    keyword: extras.keyword,
    ctaLead: extras.ctaLead,
    lastUpdated: '2026-09',
    heroImage: '/images/pages/' + slug + '/hero.png',
    solutionsImage: extras.solutionsImage || '/images/pages/' + slug + '/solutions.png',
  };
}

function compileCareers() {
  var jobsJson = JSON.parse(read('careers-jobs.json'));
  var SHARED_DUTIES = [
    'Adhere to agile development best practice',
    'Demonstrate a passion for learning and building cutting-edge applications',
    'Implement unit tests using test driven development (TDD)',
    'Implement and refactor using relevant design patterns',
    'Mentor other engineers',
    'Proactively learn and implement new best practices',
    'Manage expectations by communicating regularly',
    'Code review pull requests in a CI / CD environment',
    'Review requirements and provide input',
    'Collaborate with the engineering team to suggest, design and launch new features',
    'Maintain code integrity and organization',
  ];
  var jobs = jobsJson
    .filter(function (j) {
      return j.slug !== 'careers-test';
    })
    .map(function (j) {
      return {
        slug: j.slug,
        name: j.name,
        description: j.description || j.name,
        intro:
          'We are seeking a remote ' +
          j.name +
          ' to join a U.S. based distributed engineering team that can deliver market-leading software solutions.',
        duties: SHARED_DUTIES.slice(),
        requirements: (j.requirements || []).map(stripEm),
      };
    });

  jobs.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

  var data = {
    hub: {
      title: 'Engineer Careers | Remote Software Engineering Jobs at BetterEngineer',
      description:
        'Find remote software engineer jobs and advance your career. Explore open positions, join top global teams, and build your future with BetterEngineer.',
      h1: 'Join our network of better engineers, where talent has no borders.',
      lead:
        'At BetterEngineer, we match dedicated senior engineers with impactful projects at top US companies. Join a community where your potential is seen, your growth is supported, and your work truly matters.',
      openingsHeading: 'Our current openings',
      openingsLead:
        "Learn about our current available roles. Don't see an opening? We're always looking for top engineers. Send us your resume",
      selectHeading: 'Select a job to learn more',
      perks: [
        {
          title: 'Develop great products.',
          body: "We work on innovative projects that you'll be proud to show off.",
        },
        {
          title: 'Be a thought leader.',
          body: 'We value product-mindedness and open communication.',
        },
        {
          title: 'Work from anywhere.',
          body: "We are 100% remote, meaning you can work from wherever you're most productive.",
        },
      ],
    },
    shared: {
      chips: ['Work remotely', 'Full-time', 'Apply from anywhere'],
      roleMeta: [
        { id: 'remote', label: 'Work remotely' },
        { id: 'employment', label: 'Full-time' },
        { id: 'location', label: 'Apply from anywhere' },
      ],
      applyLabel: 'Apply as a Better Engineer',
      applyHref: 'https://app.betterengineer.com/sign-up/candidate',
      englishNote:
        'Candidates must have excellent English communication skills and previous experience with North American software companies.',
      additionalNote: 'Candidates in Western time zones preferred.',
      about:
        'We connect senior software engineers from across the Americas with our portfolio of high-growth and newsworthy technology companies in the United States. Our BetterEngineer platform introduces better talent to great teams and helps to create a tech world without borders.',
      communityHeading: 'Become part of the Better Engineer Community',
      communityLead: 'We value relationships and help you improve',
      jobTitle: 'Engineer Careers | Remote Software Engineering Jobs at BetterEngineer',
    },
    jobs: jobs,
  };

  writeJs(
    'data/careers.js',
    "/**\n * Careers hub and job listings. Generated from live HubSpot pages.\n * Edit this file (or re-run tools/compile-migration-data.js) then\n * `node build-careers.js`.\n */\n'use strict';\n\n" +
      'var WWW = \'https://www.betterengineer.com\';\n\n' +
      'var data = ' +
      JSON.stringify(data, null, 2) +
      ';\n\n' +
      "function jobPosting(job, canonical) {\n  return {\n    '@context': 'https://schema.org',\n    '@type': 'JobPosting',\n    title: job.name,\n    description: job.intro,\n    identifier: { '@type': 'PropertyValue', name: 'BetterEngineer', value: job.slug },\n    datePosted: '2026-09-01',\n    employmentType: 'FULL_TIME',\n    hiringOrganization: {\n      '@type': 'Organization',\n      name: 'BetterEngineer',\n      sameAs: WWW + '/',\n      logo: WWW + '/icons/betterengineer-logo.svg',\n    },\n    jobLocationType: 'TELECOMMUTE',\n    applicantLocationRequirements: { '@type': 'Country', name: 'United States' },\n    url: canonical,\n    directApply: false,\n  };\n}\n\n" +
      'function pageRecords() {\n  var hub = {\n    slug: \'careers\',\n    fragment: \'fragments/careers/index.html\',\n    outputs: [\'careers/index.html\'],\n    cssBundle: \'landing\',\n    script: \'page.js\',\n    migrated: true,\n    excludeFromDiscover: true,\n    navActive: \'join\',\n    title: data.hub.title,\n    description: data.hub.description,\n    canonical: WWW + \'/careers\',\n    breadcrumb: [{ name: \'Home\', url: WWW + \'/\' }, { name: \'Careers\' }],\n    lastUpdated: \'2026-09\',\n    extraSchema: function (ctx) {\n      return [{\n        \'@context\': \'https://schema.org\',\n        \'@type\': \'CollectionPage\',\n        name: data.hub.title,\n        url: ctx.canonical,\n        hasPart: data.jobs.map(function (job) {\n          return { \'@type\': \'WebPage\', name: job.name, url: WWW + \'/careers/\' + job.slug };\n        }),\n      }];\n    },\n  };\n  var jobPages = data.jobs.map(function (job) {\n    return {\n      slug: \'careers-\' + job.slug,\n      fragment: \'fragments/careers/\' + job.slug + \'.html\',\n      outputs: [\'careers/\' + job.slug + \'/index.html\'],\n      cssBundle: \'landing\',\n      script: \'page.js\',\n      migrated: true,\n      excludeFromDiscover: true,\n      title: data.shared.jobTitle,\n      description: job.description,\n      canonical: WWW + \'/careers/\' + job.slug,\n      breadcrumb: [\n        { name: \'Home\', url: WWW + \'/\' },\n        { name: \'Careers\', url: WWW + \'/careers\' },\n        { name: job.name },\n      ],\n      lastUpdated: \'2026-09\',\n      extraSchema: function (ctx) {\n        return [jobPosting(job, ctx.canonical)];\n      },\n    };\n  });\n  return [hub].concat(jobPages);\n}\n\nmodule.exports = {\n  WWW: WWW,\n  hub: data.hub,\n  shared: data.shared,\n  jobs: data.jobs,\n  pageRecords: pageRecords,\n};\n',
  );
}

function compileIndustries() {
  var industries = [
    buildIndustry('fintech', 'fintech.md', 'raw/fintech.html', {
      name: 'FinTech',
      category: 'Financial technology',
      relatedIndustries: ['martech', 'healthtech'],
      relatedRoles: ['full-stack-engineers', 'blockchain-engineers', 'data-engineers'],
      relatedTechnologies: ['python-developers', 'react-developers', 'aws-developers'],
      keyword: {
        primary: 'hire fintech engineers',
        secondary: ['fintech staff augmentation', 'hire blockchain developers', 'fintech nearshore'],
      },
      ctaLead: 'Nearshore Talent Without the Guesswork',
      solutionsImage: '/images/pages/fintech/solutions.png',
    }),
    buildIndustry('martech', 'martech.md', 'raw/martech.html', {
      name: 'MarTech',
      category: 'Marketing technology',
      relatedIndustries: ['fintech', 'healthtech'],
      relatedRoles: ['full-stack-engineers', 'front-end-engineers', 'data-engineers'],
      relatedTechnologies: ['javascript-developers', 'python-developers', 'react-developers'],
      keyword: {
        primary: 'hire martech engineers',
        secondary: ['martech staff augmentation', 'adtech developers', 'hire marketing engineers'],
      },
      ctaLead: 'Nearshore Talent Without the Guesswork',
      solutionsImage: '/images/pages/martech/solutions.png',
    }),
    buildIndustry('healthtech', 'healthtech.md', 'raw/healthtech.html', {
      name: 'HealthTech',
      category: 'Healthcare technology',
      relatedIndustries: ['fintech', 'martech'],
      relatedRoles: ['full-stack-engineers', 'data-engineers', 'qa-engineers'],
      relatedTechnologies: ['python-developers', 'react-developers', 'aws-developers'],
      keyword: {
        primary: 'hire healthtech engineers',
        secondary: ['healthcare software engineers', 'hire telemedicine developers', 'healthtech nearshore'],
      },
      ctaLead: 'Nearshore Talent Without the Guesswork',
      solutionsImage: '/images/pages/healthtech/solutions.png',
    }),
  ];

  writeJs(
    'data/industries.js',
    "/**\n * Industry hiring pages. Structured like data/technologies.js so new\n * industries can be added without copying HTML. Keep live slugs\n * (/fintech, /martech, /healthtech) unless a 301 is approved.\n *\n * Pipeline: edit this file, run `node build-industries.js`, then `npm run build`.\n */\n'use strict';\n\n" +
      'var WWW = \'https://www.betterengineer.com\';\n' +
      'var DISCOVER = \'https://discover.betterengineer.com\';\n\n' +
      'var industries = ' +
      JSON.stringify(industries, null, 2) +
      ';\n\n' +
      'function pageRecords() {\n  var hub = {\n    slug: \'industries\',\n    fragment: \'fragments/industries/index.html\',\n    outputs: [\'industries/index.html\'],\n    cssBundle: \'landing\',\n    script: \'page.js\',\n    migrated: true,\n    excludeFromDiscover: true,\n    title: \'Industries | Hire Nearshore Engineers by Vertical | BetterEngineer\',\n    description:\n      \'Hire senior nearshore engineers for FinTech, MarTech, HealthTech, and the next vertical you need to staff. Pre-vetted talent, U.S. hours, and industry-specific screening.\',\n    canonical: WWW + \'/industries\',\n    breadcrumb: [{ name: \'Home\', url: WWW + \'/\' }, { name: \'Industries\' }],\n    lastUpdated: \'2026-09\',\n  };\n  var pages = industries.filter(function (ind) { return ind.status === \'published\'; }).map(function (ind) {\n    return {\n      slug: ind.slug,\n      fragment: \'fragments/industries/\' + ind.slug + \'.html\',\n      outputs: [ind.slug + \'/index.html\'],\n      cssBundle: \'landing\',\n      script: \'page.js\',\n      migrated: true,\n      excludeFromDiscover: true,\n      title: ind.title,\n      description: ind.metaDescription,\n      canonical: WWW + \'/\' + ind.slug,\n      breadcrumb: [\n        { name: \'Home\', url: WWW + \'/\' },\n        { name: \'Industries\', url: WWW + \'/industries\' },\n        { name: ind.name },\n      ],\n      service: {\n        name: ind.name + \' engineering staff augmentation\',\n        serviceType: \'Nearshore \' + ind.name + \' software engineering staff augmentation\',\n      },\n      faqSchema: true,\n      lastUpdated: ind.lastUpdated,\n    };\n  });\n  return [hub].concat(pages);\n}\n\nmodule.exports = {\n  WWW: WWW,\n  DISCOVER: DISCOVER,\n  industries: industries,\n  pageRecords: pageRecords,\n};\n',
  );
}

function compileCaseStudies() {
  function fromMd(file, extras) {
    var md = read(file);
    var tokens = parseMdTokens(md);
    var titleMatch = md.match(/\| title tag \| `([^`]+)`/);
    var descMatch = md.match(/\| meta description \| `([^`]+)`/);
    var h1 = '';
    var heroLead = '';
    var summaryTitle = '';
    var summary = '';
    var challengeTitle = '';
    var challengeLead = '';
    var challengeItems = [];
    var challengeClose = '';
    var aboutTitle = '';
    var about = '';
    var solutionTitle = '';
    var solutionLead = '';
    var solutionItems = [];
    var solutionClose = '';
    var quote = '';
    var i = 0;
    while (i < tokens.length) {
      var t = tokens[i];
      if (t.type === 'h' && t.level === 1 && !h1) {
        h1 = t.text;
        i++;
        if (i < tokens.length && tokens[i].type === 'p') {
          heroLead = tokens[i].text;
          i++;
        }
        continue;
      }
      if (t.type === 'h' && t.level === 2 && /^The Summary/.test(t.text)) {
        summaryTitle = t.text.replace(/^The Summary/, '').trim();
        i++;
        if (i < tokens.length && tokens[i].type === 'p') {
          summary = tokens[i].text;
          i++;
        }
        continue;
      }
      if (t.type === 'h' && t.level === 2 && /^The Challenge/.test(t.text)) {
        challengeTitle = t.text.replace(/^The Challenge/, '').trim();
        i++;
        if (i < tokens.length && tokens[i].type === 'p') {
          challengeLead = tokens[i].text;
          i++;
        }
        if (i < tokens.length && tokens[i].type === 'list') {
          challengeItems = tokens[i].items;
          i++;
        }
        if (i < tokens.length && tokens[i].type === 'p') {
          challengeClose = tokens[i].text;
          i++;
        }
        continue;
      }
      if (t.type === 'h' && t.level === 4 && /^ABOUT /.test(t.text)) {
        aboutTitle = t.text;
        i++;
        if (i < tokens.length && tokens[i].type === 'p') {
          about = tokens[i].text;
          i++;
        }
        continue;
      }
      if (t.type === 'h' && (t.level === 2 || t.level === 3) && /^The Solution/.test(t.text)) {
        solutionTitle = t.text.replace(/^The Solution\s*/, '').trim();
        i++;
        if (i < tokens.length && tokens[i].type === 'p') {
          solutionLead = tokens[i].text;
          i++;
        }
        if (i < tokens.length && tokens[i].type === 'list') {
          solutionItems = tokens[i].items;
          i++;
        }
        if (i < tokens.length && tokens[i].type === 'p') {
          solutionClose = tokens[i].text;
          i++;
        }
        if (i < tokens.length && tokens[i].type === 'p' && /^["“]/.test(tokens[i].text)) {
          quote = tokens[i].text;
          i++;
        }
        continue;
      }
      i++;
    }
    return Object.assign(
      {
        title: titleMatch ? titleMatch[1] : extras.name,
        metaDescription: descMatch ? descMatch[1] : '',
        h1: stripEm(h1),
        heroLead: stripEm(heroLead),
        summaryTitle: stripEm(summaryTitle),
        summary: stripEm(summary),
        challengeTitle: stripEm(challengeTitle),
        challengeLead: stripEm(challengeLead),
        challengeItems: challengeItems.map(stripEm),
        challengeClose: stripEm(challengeClose),
        aboutTitle: stripEm(aboutTitle),
        about: stripEm(about),
        serviceModelLabel: 'SERVICE MODEL',
        serviceModelHref: 'https://www.betterengineer.com/staff-augmentation',
        serviceModelText: 'Staff Augmentation',
        solutionTitle: stripEm(solutionTitle),
        solutionLead: stripEm(solutionLead),
        solutionItems: solutionItems.map(stripEm),
        solutionClose: stripEm(solutionClose),
        quote: stripEm(quote),
      },
      extras,
    );
  }

  var studies = [
    fromMd('case-studies-livecgi.md', {
      slug: 'livecgi',
      name: 'Live CGI',
      logo: '/images/pages/case-studies/livecgi-logo.png',
      stats: [
        { num: '40%', label: 'Cost Savings for an Unreal Engineer compared to US Engineers' },
        { num: '2 Weeks', label: 'Turnaround time to Make an Offer to a Qualified Engineer' },
        { num: '35%', label: 'Increase in Team Productvity' },
      ],
      stack: [
        { src: '/images/pages/staff-augmentation/tech/react.png', label: 'React' },
        { src: '/images/pages/case-studies/webrtc.png', label: 'WebRTC' },
        { src: '/images/pages/case-studies/unreal.png', label: 'Unreal Engine' },
      ],
      rolesHired: ['UNREAL ENGINEERS', 'PRODUCT DESIGNER'],
    }),
    fromMd('case-studies-wasteplace.md', {
      slug: 'wasteplace',
      name: 'WastePlace',
      logo: '/images/pages/case-studies/wasteplace-logo.png',
      stats: [
        { num: '78%', label: 'Increase in new accounts after the first software launch' },
        { num: '81%', label: 'Reduction in operating expenses year-over-year' },
        { num: '100%', label: 'Return on investment annually' },
      ],
      stack: [
        { src: '/images/pages/staff-augmentation/tech/react.png', label: 'React' },
        { src: '/images/pages/staff-augmentation/tech/node-js.png', label: 'Node.JS' },
        { src: '/images/pages/staff-augmentation/tech/aws.png', label: 'AWS' },
      ],
      rolesHired: ['FULL STACK ENGINEER', 'QA ENGINEER', 'PRODUCT MANAGER', 'UX/UI DESIGNER'],
    }),
    fromMd('case-studies-securelink.md', {
      slug: 'securelink',
      name: 'SecureLink',
      logo: '/images/pages/case-studies/securelink-logo.png',
      stats: [
        { num: '78%', label: 'Increase in new accounts after the first software launch' },
        { num: '81%', label: 'Reduction in operating expenses year-over-year' },
        { num: '100%', label: 'Return on investment annually' },
      ],
      stack: [
        { src: '/images/pages/staff-augmentation/tech/react.png', label: 'React' },
        { src: '/images/pages/staff-augmentation/tech/node-js.png', label: 'Node.JS' },
        { src: '/images/pages/staff-augmentation/tech/aws.png', label: 'AWS' },
      ],
      rolesHired: ['Full Stack Engineer', 'Product Manager', 'QA Engineer', 'UX/UI Designer'],
    }),
  ];

  writeJs(
    'data/case-studies.js',
    "/**\n * Case study pages. Live HubSpot copy plus stats/roles pulled from the\n * source HTML. Shared trust/process blocks stay in the generator.\n */\n'use strict';\n\n" +
      'var WWW = \'https://www.betterengineer.com\';\n\n' +
      'var studies = ' +
      JSON.stringify(studies, null, 2) +
      ';\n\n' +
      'function pageRecords() {\n  return studies.map(function (s) {\n    return {\n      slug: \'case-studies-\' + s.slug,\n      fragment: \'fragments/case-studies/\' + s.slug + \'.html\',\n      outputs: [\'case-studies/\' + s.slug + \'/index.html\'],\n      cssBundle: \'landing\',\n      script: \'page.js\',\n      migrated: true,\n      excludeFromDiscover: true,\n      title: s.title,\n      description: s.metaDescription,\n      canonical: WWW + \'/case-studies/\' + s.slug,\n      breadcrumb: [\n        { name: \'Home\', url: WWW + \'/\' },\n        { name: \'Case Studies\' },\n        { name: s.name },\n      ],\n      lastUpdated: \'2026-09\',\n    };\n  });\n}\n\nmodule.exports = {\n  WWW: WWW,\n  studies: studies,\n  pageRecords: pageRecords,\n};\n',
  );
}

compileCareers();
compileIndustries();
compileCaseStudies();
console.log('done');
