'use strict';

var fs = require('fs');
var path = require('path');
var { JSDOM } = require('jsdom');

var rawDir = path.join(__dirname, '..', 'tmp-live-extract', 'raw');
var outDir = path.join(__dirname, '..', 'tmp-live-extract');
var ssr = fs.readFileSync(path.join(rawDir, 'multi-step-contact-form.ssr.html'), 'utf8');

function textClean(s) {
  return (s || '').replace(/<[^>]+>/g, ' ').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

// Extract embedded HTML fragments from template literals / strings
var htmlChunks = [];
var re = /createContextualFragment\(`([\s\S]*?)`\)/g;
var m;
while ((m = re.exec(ssr))) htmlChunks.push(m[1]);
// also unescaped HTML after script
var after = ssr.indexOf('</script>');
if (after > 0) htmlChunks.push(ssr.slice(after + 9));

console.log('chunks', htmlChunks.length, 'sizes', htmlChunks.map(function (c) { return c.length; }));

var allHtml = htmlChunks.join('\n');
fs.writeFileSync(path.join(rawDir, 'multi-step-contact-form.ssr-decoded.html'), allHtml.slice(0, 500000));

var labels = [];
var labelRe = /<label\b[^>]*>([\s\S]*?)<\/label>/gi;
while ((m = labelRe.exec(allHtml))) {
  var lab = textClean(m[1]);
  if (lab && labels.indexOf(lab) < 0) labels.push(lab);
}

var fields = [];
var inputRe = /<(input|select|textarea)\b([^>]*)>/gi;
while ((m = inputRe.exec(allHtml))) {
  var tag = m[1].toLowerCase();
  var attrs = m[2];
  var typeM = attrs.match(/\btype=["']([^"']+)["']/i);
  var nameM = attrs.match(/\bname=["']([^"']+)["']/i);
  var phM = attrs.match(/\bplaceholder=["']([^"']+)["']/i);
  var idM = attrs.match(/\bid=["']([^"']+)["']/i);
  var type = (typeM ? typeM[1] : tag).toLowerCase();
  if (type === 'hidden' || type === 'submit') continue;
  fields.push({
    tag: tag,
    type: type,
    name: nameM ? nameM[1] : '',
    id: idM ? idM[1] : '',
    placeholder: phM ? phM[1] : '',
    required: /\brequired\b/i.test(attrs)
  });
}

// Try JSON definition inside SSR
var jsonIdx = ssr.search(/"fieldGroups"|"formFieldGroups"|"fields"\s*:\s*\[/);
console.log('jsonIdx', jsonIdx);
if (jsonIdx >= 0) {
  console.log('json snippet', ssr.slice(jsonIdx, jsonIdx + 500));
}

// HubSpot modern forms often serialize definition as window.hsfc or similar
var defMatches = ssr.match(/fieldType["']?\s*:\s*["'][^"']+["']/g) || [];
console.log('fieldType mentions', defMatches.length);
defMatches.slice(0, 30).forEach(function (x) {
  console.log(' ', x);
});

var nameMentions = ssr.match(/"name"\s*:\s*"[^"]+"/g) || [];
console.log('name json', nameMentions.length);
nameMentions.slice(0, 40).forEach(function (x) {
  console.log(' ', x);
});

var labelMentions = ssr.match(/"label"\s*:\s*"[^"]+"/g) || [];
console.log('label json', labelMentions.length);
labelMentions.slice(0, 40).forEach(function (x) {
  console.log(' ', x);
});

console.log('\nHTML labels:', labels);
console.log('HTML fields:', fields);

// Look for step titles in rich text / headings inside form
var stepTitles = [];
var hRe = /<(h[1-6]|legend)[^>]*>([\s\S]*?)<\/\1>/gi;
while ((m = hRe.exec(allHtml))) {
  stepTitles.push({ tag: m[1], text: textClean(m[2]) });
}
console.log('headings in form html', stepTitles);

// navigation / progress
var progress = (ssr.match(/progress|stepper|Step \d|navigationrow/gi) || []).slice(0, 20);
console.log('progress tokens sample', progress);

var out = {
  labelsFromHtml: labels,
  fieldsFromHtml: fields,
  headings: stepTitles,
  labelJson: labelMentions,
  nameJson: nameMentions,
  fieldTypeJson: defMatches
};
fs.writeFileSync(path.join(rawDir, 'multi-step-contact-form.parsed.json'), JSON.stringify(out, null, 2));

// Rewrite multi-step md with best-effort field list
var lines = [];
lines.push('# Extraction: multi-step-contact-form');
lines.push('');
lines.push('- Source URL: https://www.betterengineer.com/multi-step-contact-form');
lines.push('- Extracted: ' + new Date().toISOString().slice(0, 10));
lines.push('- Method: HubSpot SSR decode (modern hsfc form)');
lines.push('- robots: noindex, nofollow');
lines.push('');
lines.push('## 1. Source metadata');
lines.push('');
lines.push('| Field | Value |');
lines.push('| --- | --- |');
lines.push('| title tag | `Find Top Software Engineering Talent – Find the Right Candidates` |');
lines.push('| meta description | `Tell us what you need in a software engineer, and we’ll match you with the right candidates. Start your search now with our simple multi-step form.` |');
lines.push('| canonical | `https://www.betterengineer.com/multi-step-contact-form` |');
lines.push('| robots | `noindex, nofollow` |');
lines.push('| H1 | `(none)` |');
lines.push('| Visible headline | `Let\'s define your ideal engineer` |');
lines.push('| HubSpot portal | `8679235` |');
lines.push('| HubSpot form id | `d43da6a3-79aa-45d4-99be-0d1e8162daf7` |');
lines.push('');
lines.push('## 2. Page copy (VERBATIM)');
lines.push('');
lines.push('> Let\'s define your ideal engineer');
lines.push('');
lines.push('**CTA:** `Book a Call` → `https://calendly.com/tim-salsamobi/30min`');
lines.push('');
lines.push('## 3. Form structure');
lines.push('');
lines.push('Modern HubSpot Forms (hsfc) multi-step embed. SSR includes navigationrow / progressbar CSS tokens (`step` appears frequently).');
lines.push('');
lines.push('### Labels (from decoded SSR HTML)');
lines.push('');
labels.forEach(function (lab, i) {
  lines.push((i + 1) + '. ' + lab);
});
lines.push('');
lines.push('### Inputs (from decoded SSR HTML)');
lines.push('');
fields.forEach(function (f, i) {
  lines.push(
    (i + 1) +
      '. type=`' +
      f.type +
      '`' +
      (f.name ? ' name=`' + f.name + '`' : '') +
      (f.placeholder ? ' placeholder=`' + f.placeholder + '`' : '') +
      (f.required ? ' required' : '')
  );
});
lines.push('');
if (labelMentions.length) {
  lines.push('### JSON label tokens found in SSR');
  lines.push('');
  labelMentions.forEach(function (x) {
    lines.push('- ' + x);
  });
  lines.push('');
}
if (stepTitles.length) {
  lines.push('### Headings inside form HTML');
  lines.push('');
  stepTitles.forEach(function (h) {
    lines.push('- **' + h.tag + '** ' + h.text);
  });
  lines.push('');
}
lines.push('Raw artifacts: `raw/multi-step-contact-form.ssr.html`, `raw/multi-step-contact-form.ssr-decoded.html`, `raw/multi-step-contact-form.parsed.json`');
lines.push('');
lines.push('## 4. Template notes');
lines.push('');
lines.push('Standalone lead-capture page. Not shared with marketing section templates.');
lines.push('');
fs.writeFileSync(path.join(outDir, 'multi-step-contact-form.md'), lines.join('\n'));
console.log('wrote multi-step md');
