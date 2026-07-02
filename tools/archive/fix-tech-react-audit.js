'use strict';
const fs = require('fs');

// ── Helpers ──────────────────────────────────────────────────────────────────
function patch(file, edits) {
  let h = fs.readFileSync(file, 'utf8');
  edits.forEach(([old, nw]) => {
    if (!h.includes(old)) { console.warn(`  MISS [${file}]: ${old.slice(0, 60)}`); return; }
    h = h.split(old).join(nw);
  });
  fs.writeFileSync(file, h);
}

function replaceSection(file, marker, newContent) {
  let h = fs.readFileSync(file, 'utf8');
  const start = h.indexOf(marker);
  if (start === -1) { console.warn(`  MISS section [${file}]: ${marker.slice(0, 60)}`); return; }
  const end = h.indexOf('</section>', start) + '</section>'.length;
  h = h.slice(0, start) + newContent + h.slice(end);
  fs.writeFileSync(file, h);
}

const REACT = 'technologies/react/index.html';
const TMPL  = 'technologies/tech-template/index.html';

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 1 + 2 — React page
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── React page ──────────────────────────────────────────────');

// 1. GTM injection
const GTM_PLACEHOLDER = '<!-- Google Tag Manager would go here (GTM-WT77L8JF), same as your current setup -->';
const GTM_HEAD = `<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WT77L8JF');</script><!-- End Google Tag Manager -->`;
const GTM_NOSCRIPT = `<!-- Google Tag Manager (noscript) --><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WT77L8JF" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><!-- End Google Tag Manager (noscript) -->`;

// 2. BreadcrumbList JSON-LD (inject alongside FAQPage)
const BREADCRUMB_LD = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://www.betterengineer.com/"},{"@type":"ListItem","position":2,"name":"Technologies","item":"https://www.betterengineer.com/technologies/"},{"@type":"ListItem","position":3,"name":"React Engineers","item":"https://www.betterengineer.com/technologies/react/"}]}</script>`;

// 3. New JSON-LD (re-ordered to match visible FAQ)
const OLD_FAQ_LD_OPEN = '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage"';
const OLD_FAQ_LD_END  = '</script>';
const NEW_FAQ_LD = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How does BetterEngineer vet React engineers?","acceptedAnswer":{"@type":"Answer","text":"React candidates go through a technical assessment covering component architecture, state management patterns, TypeScript usage, and performance optimization. We also evaluate English communication, remote collaboration habits, and fit for your team's specific stack and delivery style. Only senior engineers with five or more years of production React experience qualify."}},{"@type":"Question","name":"Can I interview candidates before committing?","acceptedAnswer":{"@type":"Answer","text":"Yes. You meet every candidate we recommend. Most teams run a short technical conversation or live code review. The interview is yours to structure and run."}},{"@type":"Question","name":"Will the engineers know the specific React libraries my team uses?","acceptedAnswer":{"@type":"Answer","text":"We match based on your actual stack. If you are using Next.js with Tailwind and React Query, we filter for engineers with that specific combination. If a gap exists, we tell you clearly before you interview anyone."}},{"@type":"Question","name":"How quickly can I receive React engineer profiles?","acceptedAnswer":{"@type":"Answer","text":"Most teams receive initial candidate profiles within 72 hours of our intake call, once we understand your stack, team structure, and delivery goals."}},{"@type":"Question","name":"What types of React projects do your engineers typically work on?","acceptedAnswer":{"@type":"Answer","text":"Our React engineers have worked on SaaS dashboards, fintech portals, e-commerce storefronts, design systems, internal tools, healthcare platforms, and consumer apps. Most engagements are staff augmentation into an existing product team."}},{"@type":"Question","name":"How do your React engineers integrate with an existing team?","acceptedAnswer":{"@type":"Answer","text":"Our engineers plug directly into your GitHub, Jira or Linear, Slack or Teams, and your sprint cadence from day one. They work U.S. business hours, attend standups, follow your code review process, and operate as team members rather than a separate delivery stream."}},{"@type":"Question","name":"What if I need Next.js or React Native experience specifically?","acceptedAnswer":{"@type":"Answer","text":"We have engineers who specialize in Next.js including App Router, Pages Router, and SSR and ISR strategies, as well as React Native for iOS and Android. You can specify this during intake and we filter accordingly."}},{"@type":"Question","name":"What kind of support does BetterEngineer provide after placement?","acceptedAnswer":{"@type":"Answer","text":"You get an account manager who stays involved after placement, regular check-ins, and a clear process for handling any performance or fit issues. We manage contracts, payroll, and compliance so the operational side stays low overhead on your end."}}]}</script>`;

// 4. New visible FAQ list (matches JSON-LD exactly)
const NEW_FAQ_LIST = `<div class="faq-list reveal" id="faq-list"> <div class="faq-item is-open"> <button type="button" aria-expanded="true"><span class="faq-question">How does BetterEngineer vet React engineers?</span><span class="chevron" aria-hidden="true"></span></button> <div class="faq-panel"> <p>React candidates go through a technical assessment covering component architecture, state management patterns, TypeScript usage, and performance optimization. We also evaluate communication and remote collaboration fit. Only senior engineers with five or more years of production React experience qualify.</p> </div> </div><div class="faq-item"> <button type="button" aria-expanded="false"><span class="faq-question">Can I interview candidates before committing?</span><span class="chevron" aria-hidden="true"></span></button> <div class="faq-panel" hidden> <p>Yes. You meet every candidate we recommend. Most teams run a short technical conversation or live code review. The interview is yours to structure and run.</p> </div> </div><div class="faq-item"> <button type="button" aria-expanded="false"><span class="faq-question">Will the engineers know the specific React libraries my team uses?</span><span class="chevron" aria-hidden="true"></span></button> <div class="faq-panel" hidden> <p>We match based on your actual stack. If you are using Next.js with Tailwind and React Query, we filter for engineers with that specific combination. If a gap exists, we tell you clearly before you interview anyone.</p> </div> </div><div class="faq-item"> <button type="button" aria-expanded="false"><span class="faq-question">How quickly can I receive React engineer profiles?</span><span class="chevron" aria-hidden="true"></span></button> <div class="faq-panel" hidden> <p>Most teams receive initial candidate profiles within 72 hours of our intake call, once we understand your stack, team structure, and delivery goals.</p> </div> </div><div class="faq-item"> <button type="button" aria-expanded="false"><span class="faq-question">What types of React projects do your engineers typically work on?</span><span class="chevron" aria-hidden="true"></span></button> <div class="faq-panel" hidden> <p>Our React engineers have worked on SaaS dashboards, fintech portals, e-commerce storefronts, design systems, internal tools, healthcare platforms, and consumer apps. Most engagements are staff augmentation into an existing product team.</p> </div> </div><div class="faq-item"> <button type="button" aria-expanded="false"><span class="faq-question">How do your React engineers integrate with an existing team?</span><span class="chevron" aria-hidden="true"></span></button> <div class="faq-panel" hidden> <p>Our engineers plug directly into your GitHub, Jira or Linear, Slack or Teams, and your sprint cadence from day one. They work U.S. business hours, attend standups, follow your code review process, and operate as team members rather than a separate delivery stream.</p> </div> </div><div class="faq-item"> <button type="button" aria-expanded="false"><span class="faq-question">What if I need Next.js or React Native experience specifically?</span><span class="chevron" aria-hidden="true"></span></button> <div class="faq-panel" hidden> <p>We have engineers who specialize in Next.js including App Router, Pages Router, and SSR and ISR strategies, as well as React Native for iOS and Android. You specify this during intake and we filter accordingly.</p> </div> </div><div class="faq-item"> <button type="button" aria-expanded="false"><span class="faq-question">What kind of support does BetterEngineer provide after placement?</span><span class="chevron" aria-hidden="true"></span></button> <div class="faq-panel" hidden> <p>You get an account manager who stays involved after placement, regular check-ins, and a clear process for handling any performance or fit issues. We manage contracts, payroll, and compliance so the operational side stays low overhead on your end.</p> </div> </div> </div>`;

const OLD_FAQ_LIST_START = '<div class="faq-list reveal" id="faq-list">';
const OLD_FAQ_LIST_END   = '</div> </div> </section> <!-- Final CTA -->';

patch(REACT, [
  // 1. GTM placeholder → real GTM head snippet
  [GTM_PLACEHOLDER, GTM_HEAD],

  // 2. GTM noscript after <body>
  ['<body> <a class="skip-link"', '<body> ' + GTM_NOSCRIPT + ' <a class="skip-link"'],

  // 3. OG image tags (inject after og:type)
  ['<meta property="og:type" content="website">',
   '<meta property="og:type" content="website"><meta property="og:image" content="https://www.betterengineer.com/images/roles/shared/trust-laptop.png"><meta property="og:image:width" content="720"><meta property="og:image:height" content="540">'],

  // 4. BreadcrumbList JSON-LD (inject before existing FAQPage script)
  [OLD_FAQ_LD_OPEN, BREADCRUMB_LD + OLD_FAQ_LD_OPEN],

  // 5. Replace entire FAQPage JSON-LD with re-ordered version
  // Find via unique end string after the FAQPage script
]);

// 5. Replace old FAQ JSON-LD content directly via section boundary
let h = fs.readFileSync(REACT, 'utf8');
const ldStart = h.indexOf('<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage"');
const ldEnd   = h.indexOf('</script>', ldStart) + '</script>'.length;
h = h.slice(0, ldStart) + NEW_FAQ_LD + h.slice(ldEnd);
fs.writeFileSync(REACT, h);
console.log('  FAQ JSON-LD replaced');

patch(REACT, [
  // 6. Fix hero section ID
  ['id="role-hero"', 'id="tech-hero"'],

  // 7. Remove empty tech-stack comment
  ['<!-- Tech stack -->  <!-- FAQ -->', '<!-- FAQ -->'],

  // 8. Verified badge ? → ✓
  ['<span aria-hidden="true">?</span>', '<span aria-hidden="true">✓</span>'],

  // 9. Hiring path: Seamless Onboarding → Up to Speed in Days
  ['<h3>Seamless Onboarding</h3> <p>Your engineer is up to speed - hyper-collaborative, timezone matched, impact-driven.</p>',
   '<h3>Up to Speed in Days, Not Weeks</h3> <p>Your engineer joins your repo, tools, and sprint cycle. Most are contributing meaningfully in the first week.</p>'],

  // 10. Mid-CTA copy: "Describe your role" → "Tell us your stack"
  ['Ready to meet your next engineer? Describe your role and receive vetted matches in 72 hours.',
   'Ready to hire a React engineer? Tell us your stack and we will send vetted candidate profiles in 72 hours.'],

  // 11. Trust card 1: "front-end talent" → React engineers
  ['Our senior front-end talent blends deep technical mastery with authentic product ownership. They connect design, UX, and engineering to deliver measurable business outcomes, not just completed tickets.',
   'Our senior React engineers combine architectural depth with genuine product ownership. They make decisions about rendering strategy, state design, and component APIs with your product goals in mind, not just the next ticket.'],

  // 12. Trust card 3: "Future-Ready & AI-Savvy" rewrite (remove "seamlessly" and generic copy)
  ['BetterEngineer&#39;s experts are trailblazers with modern frameworks and seamlessly adopt the latest AI-powered tools, from dynamic user flows to intelligent UI personalization.',
   'Our React engineers work with the current ecosystem as standard practice: Next.js server components, streaming UI, modern React patterns, and AI-assisted development tooling built into their workflow.'],

  // 13. Trust card 4: "Seamless U.S. Integration" → "Works Your Hours, Your Stack"
  ['<h4>Seamless U.S. Integration</h4> <p>English-fluent, timezone-aligned, and fully embedded with your workflows. Expect instant collaboration that feels like an in-house extension, not outsourcing.</p>',
   '<h4>Works Your Hours, Your Stack</h4> <p>English-fluent and timezone-aligned. Our engineers join GitHub reviews, attend standups, follow your branching conventions, and contribute like a team member from the first sprint.</p>'],

  // 14. Zustand icon (JS logo) → TanStack
  ['src="https://cdn.simpleicons.org/javascript" alt="Zustand"',
   'src="https://cdn.simpleicons.org/tanstack" alt="TanStack Query"'],
  ['<span>Zustand</span>', '<span>TanStack</span>'],

  // 15. Internal link: end of guide section 1, before the closing </div>
  ['If your team is already on React, the question is not whether to use it. It is whether you have engineers with the depth to use it well at production scale. That is where seniority matters most.</p></div> </section><section class="air-toc-section" id="what-a-senior-react-engineer-owns">',
   'If your team is already on React, the question is not whether to use it. It is whether you have engineers with the depth to use it well at production scale. That is where seniority matters most.</p><p>If you are still deciding between a front-end generalist and a React specialist, see our <a href="/roles/front-end-engineers/">Front-End Engineers hiring guide</a> for a broader overview of the role.</p></div> </section><section class="air-toc-section" id="what-a-senior-react-engineer-owns">'],

  // 16. Internal link on E-Commerce Storefronts use case card
  ['<h3>E-Commerce Storefronts</h3> <p>High-conversion shopping experiences built in React or Next.js with Core Web Vitals optimization and Stripe or custom checkout flows.</p>',
   '<h3><a href="/technologies/react-fintech/" style="color:inherit;text-decoration:none">E-Commerce &amp; FinTech Storefronts ↗</a></h3> <p>High-conversion shopping and financial product experiences built in React or Next.js with Core Web Vitals optimization and Stripe or custom checkout flows.</p>'],
]);

// 17. Replace visible FAQ list (between opening div and closing section boundary)
h = fs.readFileSync(REACT, 'utf8');
const faqStart = h.indexOf(OLD_FAQ_LIST_START);
const faqEnd   = h.indexOf('</div> </div> </section> <!-- Final CTA -->');
h = h.slice(0, faqStart) + NEW_FAQ_LIST + ' </div> </div> </section> <!-- Final CTA -->' + h.slice(faqEnd + '</div> </div> </section> <!-- Final CTA -->'.length);
fs.writeFileSync(REACT, h);
console.log('  Visible FAQ list replaced');

console.log('  React page: all fixes applied');

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 3 — Template fixes
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── Template fixes ──────────────────────────────────────────');

patch(TMPL, [
  // Fix meta description: remove hardcoded React prefix before [TECH_META_DESCRIPTION]
  ['content="Hire senior React engineers in your timezone. [TECH_META_DESCRIPTION]"',
   'content="[TECH_META_DESCRIPTION]"'],

  // Fix OG description same
  ['content="Hire senior React engineers in your timezone. [TECH_META_DESCRIPTION]"',
   'content="[TECH_META_DESCRIPTION]"'],

  // Fix candidate role labels
  ['<p class="air-candidate-card__role">React Engineer</p> <h3 class="air-candidate-card__name">Agustin Crovetto</h3>',
   '<p class="air-candidate-card__role">[TECHNOLOGY] Engineer</p> <h3 class="air-candidate-card__name">Agustin Crovetto</h3>'],
  ['<p class="air-candidate-card__role">React Engineer</p> <h3 class="air-candidate-card__name">Lucas Benítez</h3>',
   '<p class="air-candidate-card__role">[TECHNOLOGY] Engineer</p> <h3 class="air-candidate-card__name">Lucas Benítez</h3>'],
  ['<p class="air-candidate-card__role">React Engineer</p> <h3 class="air-candidate-card__name">Cecilia Davina</h3>',
   '<p class="air-candidate-card__role">[TECHNOLOGY] Engineer</p> <h3 class="air-candidate-card__name">Cecilia Davina</h3>'],

  // Fix trust image alt text
  ['alt="React engineer reviewing code on laptop"', 'alt="[TECHNOLOGY] engineer working on laptop"'],

  // Add section comments to mark what needs replacing
  ['<!-- Long-form guide -->',
   '<!-- Long-form guide: REPLACE guide h2, 4 TOC links, and all 4 section IDs + content per technology -->'],
  ['<!-- Skills -->',
   '<!-- Ecosystem section: REPLACE all 6 group headings, descriptions, and icon URLs per technology -->'],
  ['<!-- Use cases -->',
   '<!-- Use cases: REPLACE all 8 card headings and descriptions per technology -->'],
  ['<!-- FAQ -->',
   '<!-- FAQ: REPLACE all 8 question/answer pairs in both visible HTML and JSON-LD per technology -->'],

  // Fix hero section ID in template too
  ['id="role-hero"', 'id="tech-hero"'],

  // Fix hiring path seamless copy in template
  ['<h3>Seamless Onboarding</h3> <p>Your engineer is up to speed - hyper-collaborative, timezone matched, impact-driven.</p>',
   '<h3>Up to Speed in Days, Not Weeks</h3> <p>Your engineer joins your repo, tools, and sprint cycle. Most are contributing meaningfully in the first week.</p>'],
]);

console.log('  Template: all fixes applied');
