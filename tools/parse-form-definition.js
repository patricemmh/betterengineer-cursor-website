'use strict';

var fs = require('fs');
var path = require('path');

var rawDir = path.join(__dirname, '..', 'tmp-live-extract', 'raw');
var outDir = path.join(__dirname, '..', 'tmp-live-extract');
var decoded = fs.readFileSync(path.join(rawDir, 'multi-step-contact-form.ssr-decoded.html'), 'utf8');

// Find renderDefinition JSON inside island props
var marker = '"renderDefinition":';
var idx = decoded.indexOf(marker);
if (idx < 0) {
  // try unicode escaped in original ssr
  var ssr = fs.readFileSync(path.join(rawDir, 'multi-step-contact-form.ssr.html'), 'utf8');
  idx = ssr.indexOf(marker);
  decoded = ssr;
}
if (idx < 0) {
  console.error('renderDefinition not found');
  process.exit(1);
}

// Extract JSON object starting at renderDefinition value
var start = idx + marker.length;
// find matching braces
var i = start;
while (i < decoded.length && decoded[i] !== '{') i++;
var depth = 0;
var end = -1;
var inStr = false;
var esc = false;
for (var j = i; j < decoded.length; j++) {
  var ch = decoded[j];
  if (inStr) {
    if (esc) esc = false;
    else if (ch === '\\') esc = true;
    else if (ch === '"') inStr = false;
    continue;
  }
  if (ch === '"') {
    inStr = true;
    continue;
  }
  if (ch === '{') depth++;
  else if (ch === '}') {
    depth--;
    if (depth === 0) {
      end = j + 1;
      break;
    }
  }
}
if (end < 0) {
  console.error('could not find end of renderDefinition');
  process.exit(1);
}

var jsonStr = decoded.slice(i, end);
fs.writeFileSync(path.join(rawDir, 'multi-step-contact-form.renderDefinition.json'), jsonStr);
var def;
try {
  def = JSON.parse(jsonStr);
} catch (e) {
  console.error('JSON parse fail', e.message);
  process.exit(1);
}

function walkModules(mods, acc, stepHint) {
  (mods || []).forEach(function (m) {
    if (!m) return;
    if (m.type === 'step' || m.type === 'page' || m.type === 'screen') {
      acc.steps.push({
        id: m.id,
        type: m.type,
        label: m.label || m.title || '',
        modules: []
      });
      walkModules(m.modules, { steps: acc.steps, fields: acc.steps[acc.steps.length - 1].modules }, m.label);
      return;
    }
    if (m.type === 'row' || m.type === 'column' || m.type === 'section' || m.modules) {
      walkModules(m.modules, acc, stepHint);
    }
    if (m.label || m.fieldType || m.propertyName || m.name) {
      var field = {
        id: m.id,
        type: m.type,
        fieldType: m.fieldType || m.type,
        label: m.label || '',
        name: m.name || m.propertyName || '',
        required: !!(m.required || m.propertyRequired),
        placeholder: m.placeholder || '',
        options: [],
        richText: m.html ? String(m.html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '',
        stepHint: stepHint || ''
      };
      (m.options || m.choices || []).forEach(function (o) {
        if (typeof o === 'string') field.options.push(o);
        else field.options.push(o.label || o.value || JSON.stringify(o));
      });
      // enum values
      if (m.enumerationOptions) {
        m.enumerationOptions.forEach(function (o) {
          field.options.push(o.label || o.value);
        });
      }
      acc.fields.push(field);
    }
    if (m.html && !m.label) {
      acc.fields.push({
        type: 'richText',
        richText: String(m.html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      });
    }
  });
}

var acc = { steps: [], fields: [] };
if (def.form && def.form.modules) walkModules(def.form.modules, acc);
else if (def.modules) walkModules(def.modules, acc);

// Also flatten by scanning entire JSON for labeled fields
function deepFind(obj, out) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) return obj.forEach(function (x) {
    deepFind(x, out);
  });
  if (obj.label && (obj.fieldType || obj.type === 'input' || obj.options || obj.propertyName || obj.name)) {
    out.push({
      label: obj.label,
      fieldType: obj.fieldType || obj.type,
      name: obj.name || obj.propertyName || '',
      required: !!(obj.required || obj.propertyRequired),
      placeholder: obj.placeholder || '',
      options: (obj.options || obj.enumerationOptions || []).map(function (o) {
        return typeof o === 'string' ? o : o.label || o.value;
      }),
      type: obj.type
    });
  }
  Object.keys(obj).forEach(function (k) {
    if (k === 'parent') return;
    deepFind(obj[k], out);
  });
}
var deep = [];
deepFind(def, deep);
// dedupe by label+name
var seen = Object.create(null);
deep = deep.filter(function (f) {
  var k = f.label + '|' + f.name + '|' + f.fieldType;
  if (seen[k]) return false;
  seen[k] = true;
  return true;
});

fs.writeFileSync(
  path.join(rawDir, 'multi-step-contact-form.fields-deep.json'),
  JSON.stringify({ steps: acc.steps, fieldsWalk: acc.fields, fieldsDeep: deep }, null, 2)
);

console.log('steps', acc.steps.length);
console.log('fieldsWalk', acc.fields.length);
console.log('fieldsDeep', deep.length);
deep.forEach(function (f, i) {
  console.log(
    i + 1,
    f.fieldType,
    '|',
    f.label,
    f.options && f.options.length ? 'opts=' + f.options.join('/') : '',
    f.name
  );
});

// Detect step groups from module tree types
function findStepModules(obj, out) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) return obj.forEach(function (x) {
    findStepModules(x, out);
  });
  if (obj.type && /step|page|screen/i.test(obj.type)) {
    out.push({ type: obj.type, id: obj.id, label: obj.label || obj.title || '', childCount: (obj.modules || []).length });
  }
  Object.keys(obj).forEach(function (k) {
    findStepModules(obj[k], out);
  });
}
var stepMods = [];
findStepModules(def, stepMods);
console.log('step-like modules', stepMods);

// Write polished md
var lines = [];
lines.push('# Extraction: multi-step-contact-form');
lines.push('');
lines.push('- Source URL: https://www.betterengineer.com/multi-step-contact-form');
lines.push('- Extracted: ' + new Date().toISOString().slice(0, 10));
lines.push('- Method: HubSpot hsfc SSR `renderDefinition` JSON');
lines.push('- robots: `noindex, nofollow`');
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
lines.push('Form intro rich text:');
lines.push('');
var intro = deep.find(function () { return false; });
var rich = [];
function findRich(obj) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) return obj.forEach(findRich);
  if (obj.type === 'richText' && obj.html) rich.push(String(obj.html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  Object.keys(obj).forEach(function (k) {
    findRich(obj[k]);
  });
}
findRich(def);
rich.filter(Boolean).forEach(function (t) {
  lines.push('> ' + t);
  lines.push('');
});
lines.push('**CTA:** `Book a Call` → `https://calendly.com/tim-salsamobi/30min`');
lines.push('');
lines.push('## 3. Form fields (VERBATIM labels)');
lines.push('');
if (stepMods.length) {
  lines.push('### Step modules detected');
  lines.push('');
  stepMods.forEach(function (s, i) {
    lines.push((i + 1) + '. type=`' + s.type + '` id=`' + s.id + '` label=`' + s.label + '` children=' + s.childCount);
  });
  lines.push('');
} else {
  lines.push('No explicit step module types in definition; UI uses HubSpot progress/navigation row (multi-step presentation). Group fields by question order below.');
  lines.push('');
}
lines.push('### Likely step grouping (by field order)');
lines.push('');
lines.push('1. **Headcount** – How many engineers are you looking to hire?');
lines.push('2. **Skills** – Do you know what skills... + skill checkboxes + free-text skills');
lines.push('3. **Contact** – Name, Company, Work Email, optional notes, consent');
lines.push('');
deep.forEach(function (f, i) {
  lines.push(
    (i + 1) +
      '. **' +
      f.label +
      '** fieldType=`' +
      f.fieldType +
      '`' +
      (f.name ? ' name=`' + f.name + '`' : '') +
      (f.required ? ' required' : '') +
      (f.placeholder ? ' placeholder=`' + f.placeholder + '`' : '')
  );
  if (f.options && f.options.length) {
    f.options.forEach(function (o) {
      lines.push('   - option: ' + o);
    });
  }
});
lines.push('');
lines.push('Artifacts: `raw/multi-step-contact-form.renderDefinition.json`, `raw/multi-step-contact-form.fields-deep.json`');
lines.push('');
lines.push('## 4. Template notes');
lines.push('');
lines.push('Standalone lead-capture page. Not shared with marketing section templates.');
lines.push('');
fs.writeFileSync(path.join(outDir, 'multi-step-contact-form.md'), lines.join('\n'));
console.log('wrote md');
