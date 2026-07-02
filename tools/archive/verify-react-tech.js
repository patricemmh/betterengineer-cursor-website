'use strict';
const fs = require('fs');
const h = fs.readFileSync('technologies/react/index.html', 'utf8');

const checks = [
  ['Title',             h.includes('<title>Hire React Engineers')],
  ['Meta desc',         h.includes('Next.js, TypeScript, and design systems')],
  ['Canonical',         h.includes('technologies/react/')],
  ['JSON-LD',           h.includes('"How does BetterEngineer vet React engineers?"')],
  ['GTM head',          h.includes('GTM-WT77L8JF')],
  ['Ecosystem CSS',     h.includes('air-tech-ecosystem')],
  ['Hero H1',           h.includes('Hire senior <span class="light">React engineers</span>')],
  ['Hero lead',         h.includes('Finding a React developer is easy')],
  ['Eyebrow',           h.includes('TECHNOLOGIES | REACT')],
  ['Candidates h2',     h.includes('Vetted React Engineers')],
  ['Candidate skills',  h.includes('React Query')],
  ['Guide h2',          h.includes('before hiring a <span class="accent">React engineer</span>')],
  ['Guide sec 1',       h.includes('id="when-react-is-the-right-choice"')],
  ['Guide sec 2',       h.includes('id="what-a-senior-react-engineer-owns"')],
  ['Guide sec 3',       h.includes('id="react-ecosystem-to-know"')],
  ['Guide sec 4',       h.includes('id="how-to-evaluate-react-candidates"')],
  ['Ecosystem section', h.includes('id="ecosystem"')],
  ['Eco: Core group',   h.includes('Core &amp; Architecture')],
  ['Eco: State group',  h.includes('State Management')],
  ['Eco: UI group',     h.includes('UI &amp; Styling')],
  ['Eco: Testing group',h.includes('"Testing"')],
  ['Eco: Tooling',      h.includes('Tooling &amp; Build')],
  ['Eco: Mobile',       h.includes('Mobile &amp; Cross-Platform')],
  ['React icon',        h.includes('simpleicons.org/react')],
  ['Next.js icon',      h.includes('simpleicons.org/nextdotjs')],
  ['TypeScript icon',   h.includes('simpleicons.org/typescript')],
  ['Use cases h2',      h.includes('React</span> expertise')],
  ['UC: SaaS',          h.includes('SaaS Dashboards')],
  ['UC: Migration',     h.includes('Legacy Migration')],
  ['UC: React Native',  h.includes('React Native Mobile')],
  ['Trust heading',     h.includes('React</span> Engineering')],
  ['FAQ eyebrow',       h.includes('REACT ENGINEER FAQ')],
  ['FAQ Q1',            h.includes('How does BetterEngineer vet React engineers?')],
  ['FAQ Q3',            h.includes('Will the engineers know the specific React libraries')],
  ['Final CTA lead',    h.includes('Senior React engineers matched')],
  ['No skills section', !h.includes('id="skills"')],
  ['No tech-stack',     !h.includes('id="tech-stack"')],
  ['No other-roles',    !h.includes('id="other-roles"')],
  ['No template refs',  !h.includes('roles-template')],
  ['Air tech page cls', h.includes('air-tech-page')],
];

let pass = 0, fail = 0;
checks.forEach(([name, ok]) => {
  console.log(ok ? `  PASS  ${name}` : `  FAIL  ${name}`);
  ok ? pass++ : fail++;
});
console.log(`\n${pass} passed, ${fail} failed`);
