'use strict';
// Stamps technologies/react/index.html → technologies/tech-template/index.html
// by replacing React-specific content with obvious placeholder tokens.
// Future tech pages copy this template and run their own replacement script.
const fs = require('fs');

let h = fs.readFileSync('technologies/react/index.html', 'utf8');

const subs = [
  // Meta
  ['Hire React Engineers | BetterEngineer',     'Hire [TECHNOLOGY] Engineers | BetterEngineer'],
  ['Next.js, TypeScript, and design systems expertise matched to your stack in as little as 72 hours.',
   '[TECH_META_DESCRIPTION]'],
  ['https://www.betterengineer.com/technologies/react/',
   'https://www.betterengineer.com/technologies/[TECH_SLUG]/'],
  // Hero
  ['TECHNOLOGIES | REACT',                       'TECHNOLOGIES | [TECHNOLOGY]'],
  ['Hire senior <span class="light">React engineers</span>',
   'Hire senior <span class="light">[TECHNOLOGY] engineers</span>'],
  ['Finding a React developer is easy. Finding one who can make architecture decisions, own your TypeScript standards, and ship features without creating maintenance debt is harder. Senior React engineers from BetterEngineer have done exactly that on production codebases across SaaS, FinTech, and e-commerce. Get profiles matched to your stack and timezone in as little as 72 hours.',
   '[HERO_LEAD_PARAGRAPH]'],
  ['Tell us about your React hiring needs',       'Tell us about your [TECHNOLOGY] hiring needs'],
  ['Current stack, team size, and what you need to ship',
   '[FORM_PLACEHOLDER]'],
  ['Book a 20-minute intro and tell us about your React project.',
   'Book a 20-minute intro and tell us about your [TECHNOLOGY] project.'],
  // Candidates
  ['Vetted React Engineers',                     'Vetted [TECHNOLOGY] Engineers'],
  // Guide
  ['before hiring a <span class="accent">React engineer</span>',
   'before hiring a <span class="accent">[TECHNOLOGY] engineer</span>'],
  // Ecosystem heading
  ['The <span class="accent">React ecosystem</span> your engineers know',
   'The <span class="accent">[TECHNOLOGY] ecosystem</span> your engineers know'],
  ['Our React engineers are not framework beginners.',
   'Our [TECHNOLOGY] engineers are not framework beginners.'],
  // Use cases
  ['React</span> expertise',                     '[TECHNOLOGY]</span> expertise'],
  ['This is where our React engineers make the biggest impact',
   'This is where our [TECHNOLOGY] engineers make the biggest impact'],
  // Trust
  ['BetterEngineer for <span class="accent">React</span> Engineering',
   'BetterEngineer for <span class="accent">[TECHNOLOGY]</span> Engineering'],
  // FAQ
  ['REACT ENGINEER FAQ',                          '[TECHNOLOGY] ENGINEER FAQ'],
  // Final CTA
  ['Senior React engineers matched to your stack',
   'Senior [TECHNOLOGY] engineers matched to your stack'],
];

subs.forEach(([from, to]) => {
  if (!h.includes(from)) { console.warn('TEMPLATE MISS:', from.slice(0, 60)); }
  h = h.split(from).join(to);
});

fs.writeFileSync('technologies/tech-template/index.html', h);
console.log('Template saved to technologies/tech-template/index.html');
