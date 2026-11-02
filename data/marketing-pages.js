'use strict';

const jobs = require('./careers-jobs');

function jobCards() {
  return jobs
    .map(function (job) {
      return (
        '<a class="mkt-card" href="/careers/' +
        job.slug +
        '/"><h3>' +
        job.name +
        '</h3><p>Senior remote role with U.S. hours overlap. Apply through Join Us.</p></a>'
      );
    })
    .join('');
}

const pages = [
  {
    path: 'about',
    title: 'About BetterEngineer | Who We Are',
    description:
      'BetterEngineer connects U.S. companies with pre-vetted senior software engineers from Latin America. Meet the team and how we hire.',
    eyebrow: 'Who we are',
    h1: 'Finding top talent is tough. <span class="light">So we built a better way.</span>',
    lead: 'We take the hardest part of software development, finding senior engineers you can trust, and make it a repeatable process. Our network connects U.S. teams with engineers in Latin America who work overlapping hours and stay.',
    body: `
      <section class="section section-tint">
        <div class="wrap mkt-prose reveal">
          <p class="eyebrow">Our mission</p>
          <h2 class="h2">Nurture connections, not resume piles.</h2>
          <p>We help growing companies hire senior engineering talent they can keep. That means vetting for technical depth, communication, and fit before you ever meet someone, then supporting the relationship after the first commit.</p>
          <p>We also exist for the engineers. We connect people in Colombia, Brazil, Argentina, Costa Rica, and across Latin America with teams where they can do serious work, not ticket mills.</p>
        </div>
      </section>
      <section class="section">
        <div class="wrap">
          <p class="eyebrow reveal">Leadership</p>
          <h2 class="h2 reveal">The people behind BetterEngineer</h2>
          <div class="people-grid">
            <article class="person-card reveal"><p class="person-role">Founder / CEO</p><h3>Boris Portman</h3></article>
            <article class="person-card reveal"><p class="person-role">Chief Operating Officer</p><h3>Tim Breidigan</h3></article>
            <article class="person-card reveal"><p class="person-role">Chief Technology Officer</p><h3>Josh Arnold</h3></article>
            <article class="person-card reveal"><p class="person-role">Chief Innovation Officer</p><h3>Marc Boudria</h3></article>
            <article class="person-card reveal"><p class="person-role">Director of Talent Operations</p><h3>Dario Trevisani</h3></article>
            <article class="person-card reveal"><p class="person-role">Lead Product Designer</p><h3>Patrice Mailloux-Huberdeau</h3></article>
            <article class="person-card reveal"><p class="person-role">Management Consultant</p><h3>Karla Perez Ascencio</h3></article>
          </div>
        </div>
      </section>
      <section class="section section-tint">
        <div class="wrap">
          <p class="eyebrow reveal">Values</p>
          <h2 class="h2 reveal">What we hire and operate on</h2>
          <div class="mkt-card-grid">
            <article class="mkt-card reveal"><h3>Passionate team players</h3><p>We celebrate the work and the people who do it. Engineers are teammates, not interchangeable contractors.</p></article>
            <article class="mkt-card reveal"><h3>Result-oriented ownership</h3><p>We look for people who take pride in the product, not just the ticket they closed today.</p></article>
            <article class="mkt-card reveal"><h3>Give before getting</h3><p>We lead with useful introductions and honest feedback, then earn the right to grow the team.</p></article>
            <article class="mkt-card reveal"><h3>Transparency and respect</h3><p>Open communication with clients and engineers. No bait-and-switch on role, rate, or seniority.</p></article>
            <article class="mkt-card reveal"><h3>Data-driven decisions</h3><p>We track time to intro, interview conversion, tenure, and savings. Claims have to match the numbers.</p></article>
          </div>
        </div>
      </section>
    `,
    faqs: [
      {
        q: 'What makes BetterEngineer different from other nearshore staffing firms?',
        a: 'We do not just fill roles. We match senior, pre-vetted engineers for long-term work. Success is measured by tenure and team fit, not by how many resumes we send.'
      },
      {
        q: 'How do you check cultural and personal fit, not only technical skill?',
        a: 'Every engineer is screened for communication, ownership, and how they work with product teams, in addition to a technical assessment. We introduce fewer people on purpose.'
      },
      {
        q: 'What kinds of engineers can I hire?',
        a: 'Senior full stack, front end, back end, mobile, data, AI and machine learning, DevOps, and QA. Tell us the stack and the work. We match to that, not to a generic title.'
      },
      {
        q: 'What results do clients typically see?',
        a: 'First profiles in about 72 hours, 38 days average time to hire, 42.8% average first-year cost savings vs a U.S. equivalent, and 21.3 months average tenure. Three of four presented candidates are interviewed.'
      }
    ]
  },
  {
    path: 'contact',
    title: 'Contact BetterEngineer',
    description:
      'Contact BetterEngineer to hire senior nearshore engineers. Tell us your stack and timeline. We reply within one business day.',
    eyebrow: 'Contact',
    h1: 'Tell us what you need to ship. <span class="light">We will match the team.</span>',
    lead: 'Share your stack, team size, and the role. We reply within one business day with next steps, or you can book time with Tim directly.',
    showForm: true,
    formTitle: 'Start a hiring conversation',
    formSubmit: 'Send message'
  },
  {
    path: 'multi-step-contact-form',
    title: 'Hire Engineers | BetterEngineer',
    description:
      'Book a 20-minute intro and hire senior nearshore engineers. First vetted profiles in about 72 hours.',
    eyebrow: 'Hire engineers',
    h1: 'Get matched with vetted senior engineers. <span class="light">In about 72 hours.</span>',
    lead: 'Tell us the role, the stack, and what you need to ship. We come back with senior engineers who already work U.S. hours.',
    showForm: true,
    formTitle: 'Book a 20-minute intro',
    formSubmit: 'Get matched in 72 hours'
  },
  {
    path: 'staff-augmentation',
    title: 'Staff Augmentation | Nearshore Software Engineers',
    description:
      'Scale your team with senior nearshore software engineers. Staff augmentation with U.S. hours overlap and first profiles in about 72 hours.',
    eyebrow: 'Services / Staff augmentation',
    h1: 'Scale your team with senior software engineering staff augmentation.',
    lead: 'Add pre-vetted senior engineers from Latin America who embed with your team. We match for stack, communication, and how they actually work, then stay involved after kickoff.',
    body: `
      <section class="section section-tint">
        <div class="wrap">
          <h2 class="h2 reveal">What you get</h2>
          <div class="mkt-card-grid">
            <article class="mkt-card reveal"><h3>Senior only</h3><p>Engineers who can own a service, a feature area, or a workstream without a week of hand-holding.</p></article>
            <article class="mkt-card reveal"><h3>U.S. hours overlap</h3><p>Standups, pairing, and reviews happen in your working day, not overnight tickets.</p></article>
            <article class="mkt-card reveal"><h3>72-hour intros</h3><p>First profiles in about 72 hours. Average time to hire is 38 days.</p></article>
            <article class="mkt-card reveal"><h3>People who stay</h3><p>21.3 months average tenure and 98% long-term engagement. This is not a churn mill.</p></article>
          </div>
        </div>
      </section>
    `
  },
  {
    path: 'ai-readiness',
    title: 'AI Readiness Assessment | BetterEngineer',
    description:
      'Get a practical AI readiness assessment for your product and engineering team. Identify use cases your team can actually ship.',
    eyebrow: 'Services / AI readiness',
    h1: 'Find practical AI work your team can ship.',
    lead: 'We assess how your engineers already use AI, where it would change delivery, and what talent you need next. This is a working plan, not a slide deck of trends.',
    body: `
      <section class="section section-tint">
        <div class="wrap mkt-prose reveal">
          <h2 class="h2">What the assessment covers</h2>
          <p>Current tooling and habits. Where AI already helps, and where it creates review debt. Use cases tied to your stack. A hiring recommendation if you need AI-fluent engineers, not just licenses.</p>
        </div>
      </section>
    `
  },
  {
    path: 'hiring-dashboard',
    title: 'Hiring Dashboard | BetterEngineer Platform',
    description:
      'Review vetted engineer profiles, collaborate with your team, and move from search to interview in the BetterEngineer hiring dashboard.',
    eyebrow: 'Services / Platform',
    h1: 'Review vetted profiles in one place.',
    lead: 'The BetterEngineer dashboard is how hiring managers see candidates, share feedback, and keep interviews moving. Sign up to start a search.',
    body: `
      <section class="section section-tint">
        <div class="wrap">
          <div class="btn-row reveal">
            <a class="btn btn--primary" href="https://app.betterengineer.com/sign-up/hiring-manager" rel="noopener noreferrer">Try it free</a>
            <a class="btn btn--outline" href="/contact/">Talk to us first</a>
          </div>
        </div>
      </section>
    `
  },
  {
    path: 'latamengineer',
    title: 'Why Nearshore | Hire Latin America Software Engineers',
    description:
      'Hire senior nearshore software engineers from Latin America. U.S. time zone overlap, strong English, and long-term team fit.',
    eyebrow: 'Why nearshore',
    h1: 'Your next engineering hire is closer than you think.',
    lead: 'Latin America gives you senior talent in overlapping U.S. hours, without the overnight handoff tax of offshore. We work with engineers in Argentina, Brazil, Colombia, Costa Rica, and across the region.',
    body: `
      <section class="section section-tint">
        <div class="wrap">
          <div class="mkt-card-grid">
            <article class="mkt-card reveal"><h3>Time zones that work</h3><p>Same-day pairing, standups, and code review. Collaboration feels local.</p></article>
            <article class="mkt-card reveal"><h3>Senior bar</h3><p>We only introduce engineers who have shipped production systems, not bootcamp volume.</p></article>
            <article class="mkt-card reveal"><h3>Cost that still hires well</h3><p>42.8% average first-year savings vs a U.S. equivalent, without dropping seniority.</p></article>
          </div>
        </div>
      </section>
    `
  },
  {
    path: 'join',
    title: 'Join BetterEngineer | Senior Software Engineer Jobs',
    description:
      'Join BetterEngineer as a senior software engineer. Remote roles with U.S. teams, overlapping hours, and long-term placements.',
    eyebrow: 'Careers / Join us',
    h1: 'Senior engineers who want real product work.',
    lead: 'We place senior software engineers from Latin America onto U.S. product teams. If you want ownership, overlapping hours, and a team that keeps you, start here.',
    body: `
      <section class="section section-tint">
        <div class="wrap">
          <div class="btn-row reveal">
            <a class="btn btn--primary" href="https://app.betterengineer.com/sign-up/candidate" rel="noopener noreferrer">Create a candidate account</a>
            <a class="btn btn--outline" href="/careers/">See open roles</a>
          </div>
        </div>
      </section>
    `
  },
  {
    path: 'faqs-nearshore-software-engineers-staff-augmentation-ai-talent',
    title: 'FAQs | Nearshore Software Engineers and Staff Augmentation',
    description:
      'FAQs on nearshore software engineers, staff augmentation, AI talent, vetting, time zones, and how BetterEngineer hiring works.',
    eyebrow: 'Resources / FAQs',
    h1: 'Frequently asked questions',
    lead: 'Straight answers on how we vet, how fast intros work, and what nearshore staff augmentation looks like in practice.',
    faqs: [
      {
        q: 'How fast can I see candidates?',
        a: 'First profiles typically go out in about 72 hours after we understand the role, stack, and team.'
      },
      {
        q: 'Are engineers employees or contractors?',
        a: 'We handle the engagement so you get a teammate in your workflow. Ask during intake if you have a preferred model for your legal or finance team.'
      },
      {
        q: 'Do you only hire AI engineers?',
        a: 'No. We staff full stack, front end, back end, mobile, data, DevOps, QA, and AI roles. AI fluency is assessed because most product teams now expect it.'
      },
      {
        q: 'What time zones do you cover?',
        a: 'Latin America with U.S. hours overlap: Argentina, Brazil, Colombia, Costa Rica, and additional countries in the region depending on the search.'
      }
    ]
  },
  {
    path: 'ebooks',
    title: 'Ebooks | Engineering and AI Insights for Tech Leaders',
    description:
      'Engineering and AI ebooks for tech leaders. Practical hiring and delivery notes, not generic thought leadership.',
    eyebrow: 'Resources / Ebooks',
    h1: 'Engineering notes, backed by how we actually hire.',
    lead: 'Short reads for founders, CTOs, and hiring managers who need senior talent and a clearer view of AI-fluent engineering.',
    body: `
      <section class="section section-tint">
        <div class="wrap mkt-card-grid">
          <a class="mkt-card reveal" href="/youvegotllm/"><h3>You have an LLM. Now what?</h3><p>How teams move from a demo to production work with engineers who can evaluate model output.</p></a>
          <a class="mkt-card reveal" href="/roi/"><h3>R&amp;D ROI with nearshore teams</h3><p>Where cost savings show up, and where cheap hiring quietly costs more.</p></a>
        </div>
      </section>
    `
  },
  {
    path: 'podcast',
    title: 'Off The Algorithm Podcast | BetterEngineer',
    description:
      'Off The Algorithm explores the future of software engineering, hiring, and how teams actually ship with AI.',
    eyebrow: 'Resources / Podcast',
    h1: 'Off The Algorithm',
    lead: 'Conversations on software engineering, hiring senior talent, and what AI fluency looks like on real product teams.',
    body: `
      <section class="section section-tint">
        <div class="wrap mkt-prose reveal">
          <p>Episodes live on the production BetterEngineer podcast feed. This local page is the cleaned shell so we can rebuild the listing in this design system.</p>
        </div>
      </section>
    `
  },
  {
    path: 'technical-glossary',
    title: 'Technical Glossary | BetterEngineer',
    description:
      'A practical glossary of software engineering, nearshore hiring, and AI fluency terms used across BetterEngineer pages.',
    eyebrow: 'Resources / Glossary',
    h1: 'Technical glossary',
    lead: 'Short definitions for the terms we use when matching engineers to U.S. product teams.',
    body: `
      <section class="section section-tint">
        <div class="wrap mkt-card-grid">
          <article class="mkt-card reveal"><h3>Nearshore</h3><p>Hiring in nearby time zones, here Latin America, so collaboration happens in overlapping U.S. hours.</p></article>
          <article class="mkt-card reveal"><h3>Staff augmentation</h3><p>Adding engineers to your existing team and workflow, rather than outsourcing a whole project.</p></article>
          <article class="mkt-card reveal"><h3>AI fluent</h3><p>Engineers who use AI tools in design, build, and review, and can judge when to trust or reject the output.</p></article>
          <article class="mkt-card reveal"><h3>Time to intro</h3><p>How long after intake until you see the first vetted profiles. Our average is about 72 hours.</p></article>
        </div>
      </section>
    `
  },
  {
    path: 'fintech',
    title: 'Hire FinTech Engineers | BetterEngineer',
    description:
      'Hire senior FinTech engineers for payments, banking, and compliance-heavy product work. Nearshore talent in U.S. hours.',
    eyebrow: 'Industries / FinTech',
    h1: 'FinTech teams that need senior engineers, not resume volume.',
    lead: 'Payments, lending, wealth, and banking products need engineers who have shipped in regulated environments. We match that experience on purpose.',
    body: `
      <section class="section section-tint">
        <div class="wrap mkt-prose reveal">
          <p>Typical searches include backend services, data pipelines, mobile banking, and platform work around KYC, ledger, and payments integrations.</p>
        </div>
      </section>
    `
  },
  {
    path: 'martech',
    title: 'Hire MarTech Engineers | BetterEngineer',
    description:
      'Hire senior MarTech engineers for analytics, campaign platforms, and customer data products. Nearshore talent in U.S. hours.',
    eyebrow: 'Industries / MarTech',
    h1: 'MarTech engineers who have shipped data-heavy product work.',
    lead: 'Campaign platforms, CDPs, and analytics products need people who can move data reliably and keep the UI fast. We staff those teams.',
    body: `
      <section class="section section-tint">
        <div class="wrap mkt-prose reveal">
          <p>Common stacks include React, Node.js, Python, warehouses, and event pipelines. Tell us the product surface and we match to it.</p>
        </div>
      </section>
    `
  },
  {
    path: 'healthtech',
    title: 'Hire HealthTech Engineers | BetterEngineer',
    description:
      'Hire senior HealthTech engineers for clinical, patient, and operations products. Nearshore talent with U.S. hours overlap.',
    eyebrow: 'Industries / HealthTech',
    h1: 'Healthcare software with engineers who respect the stakes.',
    lead: 'Patient data, clinical workflows, and operations tools need careful delivery. We introduce senior engineers who have worked on products where mistakes are expensive.',
    body: `
      <section class="section section-tint">
        <div class="wrap mkt-prose reveal">
          <p>We staff product, platform, data, and mobile roles. If HIPAA, integrations, or auditability matter, say so in intake so we match accordingly.</p>
        </div>
      </section>
    `
  },
  {
    path: 'careers',
    title: 'Engineer Careers | Remote Software Jobs at BetterEngineer',
    description:
      'Browse senior remote software engineering jobs with BetterEngineer. Apply through Join Us for long-term U.S. product team placements.',
    eyebrow: 'Careers',
    h1: 'Open engineering roles',
    lead: 'These are the in-demand searches we staff most often. Create a candidate account to apply, or go to Join Us to learn how placements work.',
    body: `
      <section class="section section-tint">
        <div class="wrap">
          <div class="mkt-card-grid">${jobCards()}</div>
        </div>
      </section>
    `
  },
  {
    path: 'case-studies/livecgi',
    title: 'Live CGI Case Study | Unreal Engine Team in 2 Weeks',
    description:
      'How BetterEngineer helped Live CGI scale an Unreal Engine team in two weeks with 40% cost savings.',
    eyebrow: 'Case study / Live CGI',
    h1: 'Unreal expertise delivered in two weeks.',
    lead: 'Live CGI needed Unreal Engine talent fast. We introduced senior engineers who could join production work without a long ramp.',
    body: `
      <section class="section section-tint">
        <div class="wrap mkt-prose reveal">
          <p>The live page reports 40% cost savings and a two-week scale-up. This local version keeps that outcome and rebuilds the story in the current design system.</p>
        </div>
      </section>
    `
  },
  {
    path: 'case-studies/wasteplace',
    title: 'WastePlace Case Study | Hiring Time Cut by 81%',
    description:
      'How WastePlace accelerated product growth with BetterEngineer and cut hiring time by 81%.',
    eyebrow: 'Case study / WastePlace',
    h1: 'Product growth with an engineering team that stuck.',
    lead: 'WastePlace built its development team with BetterEngineer. Hiring time dropped 81%, and the engineers stayed on the product.',
    body: `
      <section class="section section-tint">
        <div class="wrap mkt-prose reveal">
          <p>Gary LaBreck, Co-Founder and CEO: "The whole WastePlace development team is made up of Better Engineers. We could not have gotten this far, this quickly, and within this budget without them."</p>
        </div>
      </section>
    `
  },
  {
    path: 'case-studies/securelink',
    title: 'SecureLink Case Study | Engineering Team in Costa Rica',
    description:
      'How SecureLink built a high-quality engineering team in Costa Rica with BetterEngineer.',
    eyebrow: 'Case study / SecureLink',
    h1: 'A Costa Rica engineering team that held the quality bar.',
    lead: 'SecureLink needed to expand internationally without lowering engineering standards. We helped them build that team in Costa Rica.',
    body: `
      <section class="section section-tint">
        <div class="wrap mkt-prose reveal">
          <p>This local page rebuilds the SecureLink story in the current layout so it can be edited alongside the other case studies.</p>
        </div>
      </section>
    `
  },
  {
    path: 'terms-of-service',
    title: 'Terms of Service | BetterEngineer',
    description: 'Terms of Service for BetterEngineer website and hiring services.',
    eyebrow: 'Legal',
    h1: 'Terms of Service',
    lead: 'This is a local rebuild shell. The controlling legal text remains on the live BetterEngineer terms page until counsel signs off on a full migration.',
    body: `
      <section class="section section-tint">
        <div class="wrap mkt-prose reveal">
          <p>For the current legal terms, see the live page at betterengineer.com/terms-of-service. Do not treat this preview as the official policy.</p>
        </div>
      </section>
    `
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy | BetterEngineer',
    description: 'Privacy Policy preview for the BetterEngineer static rebuild.',
    eyebrow: 'Legal',
    h1: 'Privacy Policy',
    lead: 'This is a local rebuild shell. The controlling privacy policy remains on the live BetterEngineer site until a full legal migration.',
    body: `
      <section class="section section-tint">
        <div class="wrap mkt-prose reveal">
          <p>For the current policy, see the live BetterEngineer privacy page. This preview exists so the footer link has a local target while we rebuild.</p>
        </div>
      </section>
    `
  },
  {
    path: 'roi',
    title: 'R&D ROI | Nearshore Software Engineers',
    description:
      'See how nearshore senior engineers affect R&D cost and delivery compared with U.S. hiring.',
    eyebrow: 'Resources',
    h1: 'Higher R&amp;D output without lowering the hiring bar.',
    lead: 'Clients see 42.8% average first-year savings vs a U.S. equivalent, with 21.3 months average tenure. Cheap hiring that churns is not the same thing.',
    body: ''
  },
  {
    path: 'webinar',
    title: 'Webinar | Innovating with Purpose',
    description: 'BetterEngineer webinar on purposeful product and engineering work.',
    eyebrow: 'Events',
    h1: 'Innovating with purpose',
    lead: 'Local rebuild of the webinar landing page. Registration still lives on the production HubSpot form until we wire the new intake.',
    body: ''
  },
  {
    path: 'aiwebinar',
    title: 'AI Webinar Registration | BetterEngineer',
    description: 'Register for the BetterEngineer AI webinar. Local rebuild preview.',
    eyebrow: 'Events',
    h1: 'AI webinar registration',
    lead: 'Local rebuild of the AI webinar landing page. Use the contact form if you want to be notified about the next session.',
    showForm: true,
    formTitle: 'Get session details',
    formSubmit: 'Request details'
  },
  {
    path: 'youvegotllm',
    title: "You've got an LLM. Now what?",
    description:
      'A BetterEngineer ebook landing page on what to do after you adopt an LLM, rebuilt in the current design system.',
    eyebrow: 'Ebooks',
    h1: 'You have an LLM. Now what?',
    lead: 'Most teams can open a chat window. Fewer can turn that into production work with review, evaluation, and engineers who know when the model is wrong.',
    body: ''
  },
  {
    path: 'hire-software-engineers-in-72-hours',
    title: 'Hire Remote Software Developers in 72 Hours',
    description:
      'Get matched with vetted senior software engineers in about 72 hours. Nearshore talent, U.S. hours overlap.',
    eyebrow: 'Hire',
    h1: 'Get matched with vetted engineers in 72 hours.',
    lead: 'Tell us the role and stack. We send senior nearshore profiles you can actually interview.',
    showForm: true,
    formTitle: 'Start the 72-hour match',
    formSubmit: 'Get matched'
  },
  {
    path: 'hire-senior-full-stack-engineers-nearshore-latam-talent',
    title: 'Hire Senior Full Stack Engineers | Nearshore LATAM',
    description:
      'Hire senior full stack engineers from Latin America who work U.S. hours and feel in-house.',
    eyebrow: 'Hire / Full stack',
    h1: 'Hire senior full stack engineers who feel in-house.',
    lead: 'React, Node.js, TypeScript, APIs, and cloud. Senior engineers who can own a slice of the product, not just tickets.',
    showForm: true,
    formTitle: 'Request full stack profiles',
    formSubmit: 'Get profiles'
  },
  {
    path: 'hire-senior-python-engineers-nearshore-latam-talent',
    title: 'Hire Senior Python Engineers | Nearshore LATAM',
    description:
      'Hire senior Python engineers from Latin America for Django, FastAPI, data, and backend work.',
    eyebrow: 'Hire / Python',
    h1: 'Hire senior Python engineers who feel in-house.',
    lead: 'Django, FastAPI, data services, and production Python. Matched to your stack, with first profiles in about 72 hours.',
    showForm: true,
    formTitle: 'Request Python profiles',
    formSubmit: 'Get profiles'
  },
  {
    path: 'hire-senior-ai-data-engineers-nearshore-latam-talent',
    title: 'Hire Senior AI and Data Engineers | Nearshore LATAM',
    description:
      'Hire senior AI and data engineers from Latin America for pipelines, ML, and production AI work.',
    eyebrow: 'Hire / AI and data',
    h1: 'Hire senior AI and data engineers who feel in-house.',
    lead: 'Pipelines, models, and production AI features. We match engineers who have shipped, not just notebook demos.',
    showForm: true,
    formTitle: 'Request AI and data profiles',
    formSubmit: 'Get profiles'
  },
  {
    path: 'ai-readiness-manufacturing',
    title: 'AI Strategy for Manufacturers | BetterEngineer',
    description:
      'AI readiness for manufacturing companies. Audit systems and plan practical AI workflows your plant and ops teams can use.',
    eyebrow: 'Industries / Manufacturing',
    h1: 'Practical AI for manufacturing teams.',
    lead: 'Disconnected ERP, CRM, and operations tools slow plants down. We help you find AI workflows that reduce manual work, then staff the engineers to build them.',
    body: `
      <section class="section section-tint">
        <div class="wrap">
          <a class="btn btn--primary reveal" href="/services/ai-systems-readiness-for-manufacturing/">See the manufacturing landing page</a>
        </div>
      </section>
    `
  }
];

module.exports = { pages, jobs };
