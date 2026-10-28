'use strict';

/**
 * Write legal page fragments from the live HubSpot HTML extracts.
 * Copy is preserved character-for-character. Do not paraphrase, and do not
 * strip punctuation, quotes, or placeholders from the source.
 */

var fs = require('fs');
var path = require('path');

var root = __dirname;
var extractDir = path.join(root, 'tmp-live-extract', 'raw');
var privacyExtract = path.join(extractDir, 'privacy-policy.content.html');
var termsExtract = path.join(extractDir, 'terms-of-service.content.html');

if (!fs.existsSync(privacyExtract) || !fs.existsSync(termsExtract)) {
  console.log('skip legal extract; main-privacy-policy.html / main-terms-of-service.html already on disk');
  process.exit(0);
}

function extractRichInner(html) {
  var match = html.match(/hs_cos_wrapper_type_rich_text"[^>]*>([\s\S]*?)<\/span><\/div>/);
  if (!match) {
    throw new Error('Could not find HubSpot rich_text wrapper in legal extract');
  }
  return match[1].trim();
}

function decodeEntities(text) {
  return String(text)
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function visibleText(html) {
  return decodeEntities(
    String(html)
      .replace(/<wbr\s*\/?>/gi, '')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/(p|h[1-6]|li|div)>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function indentBlock(html, spaces) {
  var pad = new Array(spaces + 1).join(' ');
  return String(html)
    .split(/\r?\n/)
    .map(function (line) {
      line = line.replace(/[ \t]+$/g, '');
      return line.trim() ? pad + line.trim() : '';
    })
    .filter(Boolean)
    .join('\n');
}

function pageShell(title, bodyInner) {
  return [
    '<main id="main" class="legal-page">',
    '  <section class="section" id="legal" aria-labelledby="legal-title">',
    '    <div class="wrap">',
    '      <h1 class="h1" id="legal-title">' + title + '</h1>',
    '      <div class="legal-prose">',
    indentBlock(bodyInner, 8),
    '      </div>',
    '    </div>',
    '  </section>',
    '</main>',
    '',
  ].join('\n');
}

function assertSameLegalText(label, sourceInner, generatedBody) {
  var sourceText = visibleText(sourceInner);
  var generatedText = visibleText(generatedBody);
  if (sourceText !== generatedText) {
    var i = 0;
    while (i < sourceText.length && sourceText[i] === generatedText[i]) i++;
    var srcBit = sourceText.slice(Math.max(0, i - 40), i + 80);
    var genBit = generatedText.slice(Math.max(0, i - 40), i + 80);
    throw new Error(
      label + ' text drifted from the live extract at index ' + i +
      '\n  source: ' + JSON.stringify(srcBit) +
      '\n  output: ' + JSON.stringify(genBit)
    );
  }
}

function termsBody(inner) {
  var html = inner.replace(
    /<span style="font-weight: bold;">([\s\S]*?)<\/span>/gi,
    function (_, label) {
      return '<strong>' + String(label).replace(/&nbsp;/g, ' ').trim() + '</strong>';
    }
  ).replace(/&nbsp;/g, ' ');

  var paragraphs = [];
  html.replace(/<p>([\s\S]*?)<\/p>/gi, function (_, p) {
    paragraphs.push(p);
    return '';
  });
  if (!paragraphs.length) {
    throw new Error('Terms of Service extract had no paragraphs');
  }

  var parts = [];
  var sawTitle = false;
  paragraphs.forEach(function (paragraph) {
    paragraph.split(/<br\s*\/?>/i).forEach(function (chunk) {
      chunk = chunk.replace(/[ \t]+/g, ' ').trim();
      if (!chunk) return;

      var strongOnly = chunk.match(/^<strong>([\s\S]*?)<\/strong>$/);
      if (strongOnly) {
        var label = strongOnly[1].trim();
        if (!sawTitle && /BetterEngineer Terms of Service/i.test(label)) {
          parts.push('<p><strong>' + label + '</strong></p>');
          sawTitle = true;
        } else {
          parts.push('<h2>' + label + '</h2>');
        }
        return;
      }

      var plain = chunk.replace(/<[^>]+>/g, '').trim();
      if (/^Contact Us$/i.test(plain)) {
        parts.push('<h2>Contact Us</h2>');
        return;
      }

      parts.push('<p>' + chunk + '</p>');
    });
  });

  var body = parts.join('\n');
  if (wordCount(visibleText(body)) < 1200) {
    throw new Error('Terms of Service body looks truncated');
  }
  return body;
}

function privacyBody(inner) {
  var html = inner
    .replace(/&nbsp;/g, ' ')
    .replace(/<h4[^>]*>/gi, '<h2>')
    .replace(/<\/h4>/gi, '</h2>')
    .replace(/<h2>\s*<strong>([\s\S]*?)<\/strong>\s*<\/h2>/gi, '<h2>$1</h2>')
    .replace(/\sstyle="[^"]*"/g, '')
    .replace(/<span>\s*<\/span>/g, ' ')
    .replace(/<wbr\s*\/?>/gi, '')
    .replace(/<(p|h2|li|ul)>\s+/g, '<$1>')
    .replace(/\s+<\/(p|h2|li|ul)>/g, '</$1>')
    .replace(/<p>\s+/g, '<p>')
    .replace(/\s+<\/p>/g, '</p>')
    .replace(/>\s+</g, '>\n<');

  if (!/<ul>[\s\S]*<li>Name<\/li>/.test(html)) {
    throw new Error('Privacy Policy is missing the Personal Information list');
  }
  if (wordCount(visibleText(html)) < 700) {
    throw new Error('Privacy Policy body looks truncated');
  }
  return html;
}

var privacyInner = extractRichInner(fs.readFileSync(privacyExtract, 'utf8'));
var termsInner = extractRichInner(fs.readFileSync(termsExtract, 'utf8'));
var privacyHtml = privacyBody(privacyInner);
var termsHtml = termsBody(termsInner);

assertSameLegalText('Privacy Policy', privacyInner, privacyHtml);
assertSameLegalText('Terms of Service', termsInner, termsHtml);

fs.writeFileSync(path.join(root, 'main-privacy-policy.html'), pageShell('Privacy Policy', privacyHtml));
fs.writeFileSync(path.join(root, 'main-terms-of-service.html'), pageShell('Terms of Service', termsHtml));
console.log('wrote legal fragments');
console.log('  privacy words:', wordCount(visibleText(privacyHtml)));
console.log('  terms words:', wordCount(visibleText(termsHtml)));
