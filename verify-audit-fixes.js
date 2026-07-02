'use strict';
const fs = require('fs');

function check(file, label, present, absent) {
  const h = fs.readFileSync(file, 'utf8');
  let pass = 0, fail = 0;
  (present || []).forEach(s => {
    if (h.includes(s)) { pass++; }
    else { console.log(`  FAIL [${label}] missing: ${s.slice(0,70)}`); fail++; }
  });
  (absent || []).forEach(s => {
    if (!h.includes(s)) { pass++; }
    else { console.log(`  FAIL [${label}] should be gone: ${s.slice(0,70)}`); fail++; }
  });
  return { pass, fail };
}

let total = 0, failed = 0;

function tally(r) { total += r.pass + r.fail; failed += r.fail; }

const REACT = 'technologies/react/index.html';
const TMPL  = 'technologies/tech-template/index.html';

console.log('\n── React page ──');
tally(check(REACT, 'GTM head',
  ["(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start'"],
  ['<!-- Google Tag Manager would go here']));

tally(check(REACT, 'GTM noscript',
  ['www.googletagmanager.com/ns.html?id=GTM-WT77L8JF']));

tally(check(REACT, 'og:image',
  ['og:image" content="https://www.betterengineer.com/images/roles/shared/trust-laptop.png"',
   'og:image:width" content="720"', 'og:image:height" content="540"']));

tally(check(REACT, 'BreadcrumbList',
  ['"@type":"BreadcrumbList"', '"Technologies"']));

tally(check(REACT, 'FAQ JSON-LD reordered',
  ['"Can I interview candidates before committing?"',
   '"What types of React projects do your engineers typically work on?"',
   '"How do your React engineers integrate with an existing team?"']));

tally(check(REACT, 'Visible FAQ new Q5',
  ['What types of React projects do your engineers typically work on?']));

tally(check(REACT, 'FAQ scale-up GONE',
  [],
  ['What if I need to scale the team up or down?']));

tally(check(REACT, 'Trust card 3 rewritten',
  ['Next.js server components, streaming UI, modern React patterns'],
  ['trailblazers with modern frameworks and seamlessly']));

tally(check(REACT, 'Trust card 4 renamed',
  ['Works Your Hours, Your Stack'],
  ['Seamless U.S. Integration']));

tally(check(REACT, 'Trust card 1 copy',
  ['Our senior React engineers combine architectural depth'],
  ['Our senior front-end talent']));

tally(check(REACT, 'Verified badge',
  ['aria-hidden="true">✓</span>'],
  ['aria-hidden="true">?</span>']));

tally(check(REACT, 'Hiring path onboarding',
  ['Up to Speed in Days, Not Weeks'],
  ['Seamless Onboarding']));

tally(check(REACT, 'Mid-CTA React-specific',
  ['Ready to hire a React engineer?'],
  ['Describe your role and receive vetted matches in 72 hours']));

tally(check(REACT, 'TanStack icon',
  ['cdn.simpleicons.org/tanstack', 'TanStack'],
  ['Zustand']));

tally(check(REACT, 'Internal link front-end engineers',
  ['/roles/front-end-engineers/']));

tally(check(REACT, 'Tech-hero ID',
  ['id="tech-hero"'],
  ['id="role-hero"']));

tally(check(REACT, 'Empty comment gone',
  [],
  ['<!-- Tech stack -->  <!-- FAQ -->']));

tally(check(REACT, 'After placement in FAQ',
  ['after placement']));

console.log('\n── Template ──');
tally(check(TMPL, 'Meta description no React prefix',
  ['content="[TECH_META_DESCRIPTION]"'],
  ['Hire senior React engineers in your timezone.']));

tally(check(TMPL, 'Candidate roles updated',
  ['[TECHNOLOGY] Engineer'],
  ['React Engineer">']));

tally(check(TMPL, 'Trust alt text',
  ['[TECHNOLOGY] engineer working on laptop']));

tally(check(TMPL, 'Section comments',
  ['REPLACE guide h2, 4 TOC links', 'REPLACE all 6 group headings', 'REPLACE all 8 card headings',
   'REPLACE all 8 question']));

tally(check(TMPL, 'Tech-hero ID',
  ['id="tech-hero"']));

tally(check(TMPL, 'Hiring path onboarding',
  ['Up to Speed in Days, Not Weeks']));

console.log(`\n${'─'.repeat(50)}`);
console.log(`TOTAL: ${total - failed}/${total} passed  |  ${failed} failed`);
