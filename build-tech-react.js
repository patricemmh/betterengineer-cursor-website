'use strict';
const fs = require('fs');

// ── Config ───────────────────────────────────────────────────────────────────
const INPUT  = 'technologies/tech-template/index.html';
const OUTPUT = 'technologies/react/index.html';

let html = fs.readFileSync(INPUT, 'utf8');

// ── Helpers ──────────────────────────────────────────────────────────────────
function r(old, nw) {
  if (!html.includes(old)) { console.warn('MISS:', old.slice(0, 70)); return; }
  html = html.split(old).join(nw);
}
function replaceSection(marker, newContent) {
  const start = html.indexOf(marker);
  if (start === -1) { console.warn('MISS section:', marker.slice(0, 70)); return; }
  const end = html.indexOf('</section>', start) + '</section>'.length;
  html = html.slice(0, start) + newContent + html.slice(end);
}
function removeSection(marker) {
  const start = html.indexOf(marker);
  if (start === -1) { return; }
  const end = html.indexOf('</section>', start) + '</section>'.length;
  html = html.slice(0, start) + html.slice(end);
}

// ── HEAD ─────────────────────────────────────────────────────────────────────
r('<title>Role Page Template | BetterEngineer</title>',
  '<title>Hire React Engineers | BetterEngineer</title>');

r('content="Hire vetted nearshore senior front-end engineers in your timezone. React, TypeScript, Next.js  -  matched in 72 hours."',
  'content="Hire senior React engineers in your timezone. Next.js, TypeScript, and design systems expertise matched to your stack in as little as 72 hours."');

r('content="Role Page Template | BetterEngineer"',
  'content="Hire React Engineers | BetterEngineer"');

r('content="Hire vetted nearshore senior front-end engineers in your timezone. React, TypeScript, Next.js  -  matched in 72 hours."',
  'content="Hire senior React engineers in your timezone. Next.js, TypeScript, and design systems expertise matched to your stack in as little as 72 hours."');

r('href="https://www.betterengineer.com/roles/roles-template/"',
  'href="https://www.betterengineer.com/technologies/react/"');

r('content="https://www.betterengineer.com/roles/roles-template/"',
  'content="https://www.betterengineer.com/technologies/react/"');

// Add tech-specific inline CSS before </head>
const ECOSYSTEM_CSS = `<style>
/* ── Technology page: Ecosystem section ─────────────────────────────── */
.air-tech-page .air-role-hero-card h2{font-size:clamp(1rem,2.5vw,1.2rem)}
.air-tech-ecosystem{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:2rem}
.air-eco-group{background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:1.5rem}
.air-eco-group h3{font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--color-primary);margin:0 0 .4rem}
.air-eco-group__desc{font-size:.85rem;color:var(--color-muted);margin:0 0 1rem;line-height:1.5}
.air-eco-group__icons{display:flex;flex-wrap:wrap;gap:.85rem .75rem;align-items:flex-start}
.air-eco-icon{display:flex;flex-direction:column;align-items:center;gap:.35rem;width:52px}
.air-eco-icon img{width:36px;height:36px;object-fit:contain}
.air-eco-icon span{font-size:.68rem;color:#374151;font-weight:600;text-align:center;line-height:1.2}
@media(max-width:900px){.air-tech-ecosystem{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.air-tech-ecosystem{grid-template-columns:1fr}}
/* ── Technology guide variations ────────────────────────────────────── */
.air-tech-page .air-toc-section h3{font-size:clamp(1.05rem,2vw,1.2rem)}
</style>`;
r('</head>', ECOSYSTEM_CSS + '</head>');

// ── JSON-LD ───────────────────────────────────────────────────────────────────
const OLD_JSON_KEY = '"@type":"FAQPage"';
const jStart = html.indexOf('<script type="application/ld+json">');
const jEnd   = html.indexOf('</script>', jStart) + '</script>'.length;
const NEW_JSON = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How does BetterEngineer vet React engineers?","acceptedAnswer":{"@type":"Answer","text":"React candidates go through a technical assessment covering component architecture, state management patterns, TypeScript usage, and performance optimization. We also evaluate English communication, remote collaboration habits, and fit for your team's specific stack and delivery style. Only senior engineers with five or more years of production React experience qualify."}},{"@type":"Question","name":"Will the engineers know the specific React libraries my team uses?","acceptedAnswer":{"@type":"Answer","text":"We match based on your actual stack. If you are using Next.js with Tailwind and React Query, we filter for engineers with that specific combination. If a gap exists, we tell you clearly before you interview anyone."}},{"@type":"Question","name":"Can I interview candidates before committing?","acceptedAnswer":{"@type":"Answer","text":"Yes. You meet every candidate we recommend. Most teams run a short technical conversation or live code review. The interview is yours to structure and run."}},{"@type":"Question","name":"How quickly can I receive React engineer profiles?","acceptedAnswer":{"@type":"Answer","text":"Most teams receive initial candidate profiles within 72 hours of our intake call, once we understand your stack, team structure, and delivery goals."}},{"@type":"Question","name":"What if I need Next.js or React Native experience specifically?","acceptedAnswer":{"@type":"Answer","text":"We have engineers who specialize in Next.js including App Router, Pages Router, and SSR and ISR strategies, as well as React Native for iOS and Android. You can specify this during intake and we filter accordingly."}},{"@type":"Question","name":"How do your React engineers integrate with an existing team?","acceptedAnswer":{"@type":"Answer","text":"Our engineers plug directly into your GitHub, Jira or Linear, Slack or Teams, and your sprint cadence from day one. They work U.S. business hours, attend standups, follow your code review process, and operate as team members rather than a separate delivery stream."}},{"@type":"Question","name":"What types of React projects do your engineers typically work on?","acceptedAnswer":{"@type":"Answer","text":"Our React engineers have worked on SaaS dashboards, fintech portals, e-commerce storefronts, design systems, internal tools, healthcare platforms, and consumer apps. Most engagements are staff augmentation into an existing product team."}},{"@type":"Question","name":"What kind of support does BetterEngineer provide after placement?","acceptedAnswer":{"@type":"Answer","text":"You get an account manager who stays involved after placement, regular check-ins, and a clear process for handling any performance or fit issues. We manage contracts, payroll, and compliance so the operational side stays low overhead on your end."}}]}</script>`;
html = html.slice(0, jStart) + NEW_JSON + html.slice(jEnd);

// ── BODY class ────────────────────────────────────────────────────────────────
r('<main id="main" class="air-page">', '<main id="main" class="air-page air-tech-page">');

// ── HERO ──────────────────────────────────────────────────────────────────────
r('ROLES | FRONT-END ENGINEERS', 'TECHNOLOGIES | REACT');

r('<h1 class="h1" id="role-hero-title">\nHire senior <span class="light">Front-End engineers</span> in your timezone.\n</h1>',
  '<h1 class="h1" id="role-hero-title">Hire senior <span class="light">React engineers</span> in your timezone.</h1>');

r('<p class="lead">Access our extensive network of vetted nearshore engineer professionals with proven expertise in AI, software development, and 100+ modern technologies across industries.</p>',
  '<p class="lead">Finding a React developer is easy. Finding one who can make architecture decisions, own your TypeScript standards, and ship features without creating maintenance debt is harder. Senior React engineers from BetterEngineer have done exactly that on production codebases across SaaS, FinTech, and e-commerce. Get profiles matched to your stack and timezone in as little as 72 hours.</p>');

r('Tell us about your front-end hiring needs',
  'Tell us about your React hiring needs');

r('Stack, team size, and what you need shipped',
  'Current stack, team size, and what you need to ship');

r('<h2 class="hero-form__title">Book a 20-minute intro and tell us what you need on the front end.</h2>',
  '<h2 class="hero-form__title">Book a 20-minute intro and tell us about your React project.</h2>');

// ── CANDIDATES ────────────────────────────────────────────────────────────────
r('Meet Our <span class="accent">Vetted Front-End Engineers</span> ready to work.',
  'Meet Our <span class="accent">Vetted React Engineers</span> ready to work.');

r('<p class="air-candidate-card__role">Front-End Engineer</p> <h3 class="air-candidate-card__name">Agustin Crovetto</h3>',
  '<p class="air-candidate-card__role">React Engineer</p> <h3 class="air-candidate-card__name">Agustin Crovetto</h3>');

r('<div class="air-skill-tags" aria-label="Expertise"> <span>React</span><span>Typescript</span><span>Node.js</span><span>AWS</span><span>PostgreSQL</span><span>CSS</span><span>Accessibility</span> </div> <a class="btn btn--primary" href="https://app.betterengineer.com/sign-up/hiring-manager">Hire Agustin</a>',
  '<div class="air-skill-tags" aria-label="Expertise"> <span>React</span><span>Next.js</span><span>TypeScript</span><span>Redux</span><span>AWS</span><span>Performance</span><span>Accessibility</span> </div> <a class="btn btn--primary" href="https://app.betterengineer.com/sign-up/hiring-manager">Hire Agustin</a>');

r('<p class="air-candidate-card__role">Front-End Engineer</p> <h3 class="air-candidate-card__name">Lucas Benítez</h3>',
  '<p class="air-candidate-card__role">React Engineer</p> <h3 class="air-candidate-card__name">Lucas Benítez</h3>');

r('<div class="air-skill-tags" aria-label="Expertise"> <span>React</span><span>Typescript</span><span>CSS</span><span>PostgreSQL</span><span>Component Libraries</span><span>Design Tokens</span> </div> <a class="btn btn--primary" href="https://app.betterengineer.com/sign-up/hiring-manager">Hire Lucas</a>',
  '<div class="air-skill-tags" aria-label="Expertise"> <span>React</span><span>TypeScript</span><span>Tailwind CSS</span><span>Design Systems</span><span>Storybook</span><span>React Query</span> </div> <a class="btn btn--primary" href="https://app.betterengineer.com/sign-up/hiring-manager">Hire Lucas</a>');

r('<p class="air-candidate-card__role">Front-End Engineer</p> <h3 class="air-candidate-card__name">Cecilia Davina</h3>',
  '<p class="air-candidate-card__role">React Engineer</p> <h3 class="air-candidate-card__name">Cecilia Davina</h3>');

r('<div class="air-skill-tags" aria-label="Expertise"> <span>React</span><span>Typescript</span><span>Responsive Design</span><span>UX Patterns</span><span>Design Systems</span> </div> <a class="btn btn--primary" href="https://app.betterengineer.com/sign-up/hiring-manager">Hire Cecilia</a>',
  '<div class="air-skill-tags" aria-label="Expertise"> <span>React</span><span>Next.js</span><span>GraphQL</span><span>Component Architecture</span><span>Accessibility</span><span>Figma</span> </div> <a class="btn btn--primary" href="https://app.betterengineer.com/sign-up/hiring-manager">Hire Cecilia</a>');

// ── GUIDE ─────────────────────────────────────────────────────────────────────
r('Everything you need to hire <span class="accent">front-end engineers</span>',
  'Everything you need to know before hiring a <span class="accent">React engineer</span>');

r('<a class="toc-link" href="#what-does-a-front-end-engineer-do">What does a front-end engineer do, and where do they fit in your product team</a>',
  '<a class="toc-link" href="#when-react-is-the-right-choice">When React is the right choice for your product (and when it isn\'t)</a>');

r('<a class="toc-link" href="#why-strong-front-end-engineers">Why strong front-end engineers are critical for your business</a>',
  '<a class="toc-link" href="#what-a-senior-react-engineer-owns">What a senior React engineer owns on your product team</a>');

r('<a class="toc-link" href="#typical-roles-and-responsibilities">Typical roles and responsibilities of a front-end engineer</a>',
  '<a class="toc-link" href="#react-ecosystem-to-know">The React ecosystem your hire should know well</a>');

r('<a class="toc-link" href="#what-skills-to-look-for">What skills should you look for when hiring a front-end engineer</a>',
  '<a class="toc-link" href="#how-to-evaluate-react-candidates">How to evaluate React candidates before you make a hiring decision</a>');

// ── GUIDE SECTIONS ────────────────────────────────────────────────────────────
replaceSection('<section class="air-toc-section" id="what-does-a-front-end-engineer-do">',
`<section class="air-toc-section" id="when-react-is-the-right-choice"> <h3>When React is the right choice for your product (and when it isn't)</h3> <div class="air-role-prose"><p>React is the dominant front-end library for a reason. Its component model, large ecosystem, and massive hiring pool make it the practical default for most product teams. But it is worth being honest about when it is genuinely the right fit and when another tool might serve you better.</p><p><strong>React is a strong choice when:</strong></p><ul><li>Your product has complex, interactive UI with significant shared state across views</li><li>Your team is already on the JavaScript or TypeScript ecosystem and wants a large pool of potential hires</li><li>You want to share logic or components between a web product and a mobile app using React Native</li><li>You need a mature ecosystem of third-party libraries, design systems, and tooling</li><li>You plan to use Next.js for server-side rendering, static generation, or hybrid rendering strategies</li></ul><p><strong>Where React adds overhead you may not need:</strong></p><ul><li>Lightweight marketing or content sites with minimal interactivity (a CMS with simple JS often performs better with less tooling)</li><li>Teams with deep institutional knowledge in Vue or Angular where the migration cost does not justify the switch</li><li>Projects where bundle size and initial load time are mission-critical and every kilobyte matters</li></ul><p>If your team is already on React, the question is not whether to use it. It is whether you have engineers with the depth to use it well at production scale. That is where seniority matters most.</p></div> </section>`);

replaceSection('<section class="air-toc-section" id="why-strong-front-end-engineers">',
`<section class="air-toc-section" id="what-a-senior-react-engineer-owns"> <h3>What a senior React engineer owns on your product team</h3> <div class="air-role-prose"><p>The gap between a junior and a senior React engineer is not React knowledge. Juniors write components that work. Seniors write components that will still work correctly in 12 months when three other engineers are touching the same codebase under deadline pressure.</p><p>A senior React engineer typically owns:</p><p><strong>Architecture and rendering strategy</strong><br>Deciding between client-side rendering, server-side rendering with Next.js, static generation, or a hybrid approach. Choosing the right rendering model for each page type based on performance requirements, SEO needs, and data freshness constraints.</p><p><strong>State management decisions</strong><br>Picking the right tool for the right problem: React Context for local shared state, React Query or SWR for server state, Redux or Zustand for complex global client state. A senior engineer has opinions on these tradeoffs backed by production experience, not just documentation familiarity.</p><p><strong>TypeScript standards and enforcement</strong><br>Defining and maintaining type safety across the codebase. Not just adding types as decoration, but using TypeScript to constrain behavior, document intent, and catch bugs before they ship.</p><p><strong>Performance budget and optimization</strong><br>Owning Core Web Vitals scores, bundle size, lazy loading strategy, and image optimization. Running Lighthouse audits and making concrete improvements, not just filing tickets.</p><p><strong>Design system and component API design</strong><br>Building reusable components that are composable, accessible, and documented. Setting the standards that junior engineers follow when adding new features.</p><p><strong>Code review and team standards</strong><br>Reviewing PRs with a focus on maintainability and correctness, not just functionality. Catching patterns that will create problems in six months.</p><p>This is why seniority matters on React specifically. The framework is permissive. It lets you do almost anything. A senior engineer knows what not to do.</p></div> </section>`);

replaceSection('<section class="air-toc-section" id="typical-roles-and-responsibilities">',
`<section class="air-toc-section" id="react-ecosystem-to-know"> <h3>The React ecosystem your hire should know well</h3> <div class="air-role-prose"><p>React is the core library, but the ecosystem around it is what separates a narrow framework user from an engineer who can own a production codebase end to end.</p><p><strong>Core and architecture layer</strong><br>React plus TypeScript plus Next.js is the standard production stack for most teams today. Engineers should understand hydration, the App Router vs Pages Router tradeoffs in Next.js, and when server components make sense versus client components. Familiarity with Vite for client-side projects and Webpack for legacy setups is also expected at the senior level.</p><p><strong>State management</strong><br>Strong candidates distinguish between server state and client state, and choose their tools accordingly. React Query or SWR for async data fetching and caching. Redux Toolkit for complex global state that genuinely warrants it. Zustand or Jotai for lighter global state. React Context for simple component subtree state. Engineers who reach for Redux on every project without justification are a flag.</p><p><strong>Styling and UI</strong><br>Tailwind CSS has become the dominant utility-first approach. Senior engineers are also comfortable with CSS Modules, styled-components, or Emotion depending on the codebase. Radix UI and Headless UI for accessible component primitives. Material UI or Chakra UI for teams that want a pre-built component library. Storybook for component documentation and visual testing.</p><p><strong>Testing</strong><br>Jest plus React Testing Library for unit and integration tests. Cypress or Playwright for end-to-end testing. Engineers who write tests by default, not only before a major release, are significantly more valuable than those who treat testing as optional.</p><p><strong>Tooling and code quality</strong><br>TypeScript (already mentioned), ESLint with sensible rules, Prettier for formatting, and a CI pipeline that runs tests and linting on every PR. These are baseline expectations for production codebases, not optional extras.</p></div> </section>`);

replaceSection('<section class="air-toc-section" id="what-skills-to-look-for">',
`<section class="air-toc-section" id="how-to-evaluate-react-candidates"> <h3>How to evaluate React candidates before you make a hiring decision</h3> <div class="air-role-prose"><p>React's permissiveness makes it easy to find people who can write React. It makes finding people who can own a React codebase much harder. Here is how to tell the difference during interviews.</p><p><strong>Test component design, not syntax</strong><br>Give candidates a design or a feature requirement and ask them to talk through how they would structure the components. You are looking for thinking about state boundaries, reusability, and the consumer API of the component, not whether they remember the exact hook API.</p><p><strong>Ask about state management decisions they have made</strong><br>Good question: "Walk me through a time you chose between different state management approaches. What were the tradeoffs?" A strong candidate has a specific example with a clear rationale. A weak candidate talks in abstract best practices without a concrete experience to back it up.</p><p><strong>Ask about a performance problem they have diagnosed and fixed</strong><br>Performance work on React is concrete and specific. Ask for a bundle size problem, a re-render issue, or a hydration delay. If they can describe the problem, the tool they used to find it, and the specific change they made, you are talking to someone who has done real production work.</p><p><strong>Green flags to watch for:</strong></p><ul><li>Talks about maintaining existing code, not just building new things</li><li>Has opinions on TypeScript strictness and can explain why</li><li>Mentions accessibility as a default concern, not an afterthought</li><li>References Core Web Vitals or Lighthouse in discussions of performance</li><li>Can explain a time a design system decision caused problems later</li></ul><p><strong>Red flags:</strong></p><ul><li>Cannot explain why they picked one state library over another in a past project</li><li>Uses the phrase "best practices" without being able to be specific</li><li>Has only worked in greenfield projects and has no experience maintaining legacy React code</li><li>Cannot discuss a production bug they were responsible for finding and fixing</li></ul><p>At BetterEngineer, we do this evaluation before you ever speak to a candidate. But understanding how to run your own assessment gives you a better interview and a more confident hiring decision.</p></div> </section>`);

// ── MID CTA (leave as-is, it's generic enough) ────────────────────────────────

// ── SKILLS section → ECOSYSTEM section ───────────────────────────────────────
const SI = 'https://cdn.simpleicons.org';
const DI = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

function ecoIcon(url, label) {
  return `<div class="air-eco-icon"><img src="${url}" alt="${label}" width="36" height="36" loading="lazy"><span>${label}</span></div>`;
}

const ECO_SECTION = `<section class="section section-tint" id="ecosystem" aria-labelledby="ecosystem-heading"> <div class="wrap"> <div class="reveal air-section-head"> <p class="eyebrow">Full ecosystem coverage</p> <h2 class="h2" id="ecosystem-heading">The <span class="accent">React ecosystem</span> your engineers know</h2> <p class="lead air-roles-lead" style="margin-bottom:0">Our React engineers are not framework beginners. They make deliberate choices between the right tools for the right problem and can defend those decisions to your team.</p> </div> <div class="air-tech-ecosystem"> <div class="air-eco-group reveal"> <h3>Core &amp; Architecture</h3> <p class="air-eco-group__desc">React, Next.js, and TypeScript form the production baseline. Engineers know when to use SSR, SSG, or client-side rendering.</p> <div class="air-eco-group__icons"> ${ecoIcon(SI+'/react','React')} ${ecoIcon(SI+'/nextdotjs','Next.js')} ${ecoIcon(SI+'/typescript','TypeScript')} </div> </div> <div class="air-eco-group reveal"> <h3>State Management</h3> <p class="air-eco-group__desc">Engineers distinguish server state from client state and pick the right tool: React Query, Redux, or Zustand depending on complexity.</p> <div class="air-eco-group__icons"> ${ecoIcon(SI+'/redux','Redux')} ${ecoIcon(SI+'/reactquery','React Query')} ${ecoIcon(SI+'/javascript','Zustand')} </div> </div> <div class="air-eco-group reveal"> <h3>UI &amp; Styling</h3> <p class="air-eco-group__desc">Tailwind for utility-first, MUI or Radix for component libraries, Storybook for documentation and visual testing.</p> <div class="air-eco-group__icons"> ${ecoIcon(SI+'/tailwindcss','Tailwind')} ${ecoIcon(SI+'/mui','MUI')} ${ecoIcon(SI+'/storybook','Storybook')} </div> </div> <div class="air-eco-group reveal"> <h3>Testing</h3> <p class="air-eco-group__desc">Jest and React Testing Library for unit tests, Cypress or Playwright for end-to-end flows. Tests ship with the feature.</p> <div class="air-eco-group__icons"> ${ecoIcon(SI+'/jest','Jest')} ${ecoIcon(SI+'/cypress','Cypress')} ${ecoIcon(DI+'/playwright/playwright-original.svg','Playwright')} </div> </div> <div class="air-eco-group reveal"> <h3>Tooling &amp; Build</h3> <p class="air-eco-group__desc">Vite for modern projects, Webpack for existing setups, ESLint and Prettier enforced on every PR.</p> <div class="air-eco-group__icons"> ${ecoIcon(SI+'/vite','Vite')} ${ecoIcon(SI+'/webpack','Webpack')} ${ecoIcon(SI+'/eslint','ESLint')} </div> </div> <div class="air-eco-group reveal"> <h3>Mobile &amp; Cross-Platform</h3> <p class="air-eco-group__desc">React Native and Expo for teams sharing logic between web and mobile, with platform-specific implementations where needed.</p> <div class="air-eco-group__icons"> ${ecoIcon(SI+'/react','React Native')} ${ecoIcon(SI+'/expo','Expo')} </div> </div> </div> </div> </section>`;

replaceSection('<section class="section section-tint" id="skills"', ECO_SECTION);

// ── USE CASES ─────────────────────────────────────────────────────────────────
r('Use Cases &amp; <span class="accent">Front-End</span> expertise',
  'Use Cases &amp; <span class="accent">React</span> expertise');

r('This is where our front-end skills make the biggest difference, no matter the size or stage of your product.',
  'This is where our React engineers make the biggest impact, from first commit to production scale.');

r('<article class="air-serve-card reveal"> <h3>UI Development &amp; Pixel-Perfect Integration</h3> <p>Launch and scale SaaS dashboards, admin panels, and custom interfaces.</p> </article><article class="air-serve-card reveal"> <h3>Design System Implementation</h3> <p>Build cohesive, scalable design systems for rapid iteration.</p> </article><article class="air-serve-card reveal"> <h3>Responsive, Mobile-First Experiences</h3> <p>Deliver cross-device and cross-browser compatibility to reach customers wherever they are.</p> </article><article class="air-serve-card reveal"> <h3>E-Commerce Overhauls &amp; Performance Tuning</h3> <p>Boost engagement and conversions through lightning-fast, visually stunning online storefronts.</p> </article><article class="air-serve-card reveal"> <h3>Legacy UI Modernization</h3> <p>Migrate older interfaces to modern frameworks like React, Angular, or Vue.</p> </article><article class="air-serve-card reveal"> <h3>Animation, Interactivity &amp; Web Performance</h3> <p>Integrate advanced animation, micro-interactions, and optimize load times to enhance usability.</p> </article><article class="air-serve-card reveal"> <h3>AI-Driven Front Ends</h3> <p>Embed intelligent components that make user experiences smarter and more intuitive.</p> </article><article class="air-serve-card reveal"> <h3>Integration with Back-End APIs</h3> <p>Connect robust, secure, and scalable front ends with all your business-critical systems.</p> </article>',
  '<article class="air-serve-card reveal"> <h3>SaaS Dashboards &amp; Admin Panels</h3> <p>Complex data-heavy interfaces with real-time updates, role-based views, and performant rendering of large datasets.</p> </article><article class="air-serve-card reveal"> <h3>Design System Creation</h3> <p>Component libraries built in React and documented in Storybook so every team ships consistent UI without reinventing components.</p> </article><article class="air-serve-card reveal"> <h3>Legacy Migration to React</h3> <p>Phased migrations from AngularJS, jQuery, or older React versions with minimal disruption to the live product.</p> </article><article class="air-serve-card reveal"> <h3>E-Commerce Storefronts</h3> <p>High-conversion shopping experiences built in React or Next.js with Core Web Vitals optimization and Stripe or custom checkout flows.</p> </article><article class="air-serve-card reveal"> <h3>Next.js SSR &amp; Static Sites</h3> <p>Server-rendered and statically generated React apps with SEO requirements, fast first paint, and predictable data fetching.</p> </article><article class="air-serve-card reveal"> <h3>Internal Tools &amp; Portals</h3> <p>Operations dashboards, partner portals, and internal platforms that need fast iteration and are used by teams every day.</p> </article><article class="air-serve-card reveal"> <h3>React Native Mobile Apps</h3> <p>iOS and Android apps that share component logic with your existing React web codebase, built by engineers who know both targets.</p> </article><article class="air-serve-card reveal"> <h3>AI-Powered Frontend Interfaces</h3> <p>Streaming UI, chat interfaces, and dynamic components that connect React frontends to LLM and AI backends.</p> </article>');

// ── TRUST ─────────────────────────────────────────────────────────────────────
r('Why High-Growth Teams Trust BetterEngineer&#39;s <span class="accent">Front-End</span> experts',
  'Why High-Growth Teams Trust BetterEngineer for <span class="accent">React</span> Engineering');

r('alt="Engineer working on laptop"',
  'alt="React engineer reviewing code on laptop"');

// ── TECH STACK section → remove it (ecosystem replaces it) ───────────────────
removeSection('<section class="section" id="tech-stack"');

// ── FAQ ───────────────────────────────────────────────────────────────────────
r('<p class="eyebrow">FRONT-END DEVELOPER FAQ</p>',
  '<p class="eyebrow">REACT ENGINEER FAQ</p>');

r('<h2 class="h2" id="faq-heading">Frequently asked <span class="accent">questions</span></h2>',
  '<h2 class="h2" id="faq-heading">Frequently asked <span class="accent">questions</span></h2>');

r('<span class="faq-question">How are BetterEngineer front-end engineers vetted?</span>',
  '<span class="faq-question">How does BetterEngineer vet React engineers?</span>');

r('<p>We use a multi-step process that includes technical screening, live coding evaluation, communication review, and matching against your stack and product needs.</p>',
  '<p>React candidates go through a technical assessment covering component architecture, state management patterns, TypeScript usage, and performance optimization. We also evaluate communication and remote collaboration fit. Only senior engineers with five or more years of production React experience qualify.</p>');

r('<span class="faq-question">What technologies do your front-end engineers specialize in?</span>',
  '<span class="faq-question">Will the engineers know the specific React libraries my team uses?</span>');

r('<p>We match teams with engineers experienced in React, Vue, Angular, Next.js, TypeScript, design systems, accessibility, and the supporting tooling around modern front-end delivery.</p>',
  '<p>We match based on your actual stack. If you are using Next.js with Tailwind and React Query, we filter for engineers with that specific combination. If a gap exists, we tell you clearly before you interview anyone.</p>');

r('<span class="faq-question">How fast can I get matched with a front-end engineer?</span>',
  '<span class="faq-question">How quickly can I receive React engineer profiles?</span>');

r('<p>Most teams can review initial matches within a few business days once we understand the role, stack, and collaboration expectations.</p>',
  '<p>Most teams receive initial candidate profiles within 72 hours of our intake call, once we understand your stack, team structure, and delivery goals.</p>');

r('<span class="faq-question">What kinds of companies get the most value from your front-end engineers?</span>',
  '<span class="faq-question">What if I need Next.js or React Native experience specifically?</span>');

r('<p>SaaS teams, product-led companies, fast-moving startups, and established digital teams benefit most when they need senior front-end ownership without a long hiring cycle.</p>',
  '<p>We have engineers who specialize in Next.js including App Router, Pages Router, and SSR and ISR strategies, as well as React Native for iOS and Android. You specify this during intake and we filter accordingly.</p>');

// ── FINAL CTA ─────────────────────────────────────────────────────────────────
r('<p class="lead">Senior front-end engineers matched to your stack, culture, and timezone - in as little as 72 hours.</p>',
  '<p class="lead">Senior React engineers matched to your stack, delivery goals, and timezone in as little as 72 hours.</p>');

// ── Remove the other-roles grid (not relevant for tech pages) ─────────────────
removeSection('<section class="section section-tint" id="other-roles"');

// ── Write output ──────────────────────────────────────────────────────────────
fs.writeFileSync(OUTPUT, html);
console.log('Done:', OUTPUT);
