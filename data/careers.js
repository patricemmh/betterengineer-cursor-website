/**
 * Careers hub and the roles BetterEngineer places.
 * These are not live job openings. US companies ask for a skill, and
 * BetterEngineer introduces vetted engineers from the network.
 * Edit this file, then run `node build-careers.js`.
 */
'use strict';

var WWW = 'https://www.betterengineer.com';

var data = {
  hub: {
    title: 'Software engineer jobs in Latin America | BetterEngineer',
    description:
      'Roles BetterEngineer places with US product teams: senior engineers in Latin America, on a full-time contract, working US business hours.',
    h1: 'Roles we place with US product teams',
    lead:
      'These pages are not open jobs. US companies ask us for a skill, and we introduce vetted senior engineers from our network. Active client openings are posted on LinkedIn.',
    openingsHeading: 'Roles we place',
    openingsLead:
      'Each role is a full-time contract with a US product team. You work US business hours from Latin America.',
    selectHeading: 'Other roles we place',
    perks: [
      {
        title: 'Work in the client codebase.',
        body: 'You join a US product team and ship in their repo, their standups, and their code reviews.',
      },
      {
        title: 'Full-time contract, paid monthly.',
        body: 'The monthly amount stays the same. You are paid in US dollars. Candidates never pay anything.',
      },
      {
        title: 'Latin America, US business hours.',
        body: 'Engineers live in Mexico, Costa Rica, Colombia, Peru, Brazil, Chile, Argentina, and Uruguay.',
      },
    ],
  },
  shared: {
    roleMeta: [
      { id: 'remote', label: 'Remote, US business hours' },
      { id: 'employment', label: 'Full-time contract' },
      { id: 'location', label: 'Latin America' },
    ],
    applyLabel: 'Join the network',
    applyHref: 'https://app.betterengineer.com/sign-up/candidate',
    linkedInHref: 'https://www.linkedin.com/company/betterengineer/jobs/',
    englishNote:
      'You need advanced or fluent English. You will be in standups, code reviews, and Slack with a US team.',
    aiNote:
      'Every engineer is assessed on the four-level AI fluency scale before a client meets them.',
    aiHref: '/ai-fluent-engineers/',
    poolNote:
      'This is not a single opening. When a US company asks for this skill, we introduce engineers from the network.',
    about:
      'BetterEngineer keeps a network of senior engineers in Latin America and introduces them to US product teams. Placements are almost always a full-time contract, paid the same amount every month in US dollars.',
    communityHeading: 'How joining works',
    communityLead: 'Create a profile. We vet your work, your English, and your AI fluency.',
    updatedLabel: 'Updated November 9, 2026',
    joinHref: '/join/',
  },
  retired: [
    { slug: 'cordova-c-engineer', to: '/careers/react-native-engineer/' },
    { slug: 'groovy-on-grails-engineer', to: '/careers/java-engineer/' },
    { slug: 'openstack-engineer', to: '/careers/devops-engineer/' },
    { slug: 'peoplesoft-consultant', to: '/careers/' },
    { slug: 'drupal-engineer', to: '/careers/wordpress-engineer/' },
    { slug: 'ms-dynamics-crm-engineer', to: '/careers/' },
    { slug: 'cloudops-engineer', to: '/careers/devops-engineer/' },
    { slug: 'e-commerce-engineer', to: '/careers/shopify-engineer/' },
    { slug: 'project-manager', to: '/careers/' },
    { slug: 'elixir-engineer', to: '/careers/' },
    { slug: 'scala-engineer', to: '/careers/' },
    { slug: 'embedded-software-engineer', to: '/careers/' },
    { slug: 'magneto-engineer', to: '/careers/magento-engineer/' },
  ],
  jobs: [
    job('net-engineer', '.NET engineer', 'C#, ASP.NET Core, and SQL Server or PostgreSQL on a US product team.', ['C# and ASP.NET Core in production', 'SQL Server or PostgreSQL', 'APIs that other teams call', '5 or more years as a software engineer'], 'You use AI tools to draft tests and a first pass of a C# change, then you review the diff before it ships.', '/technologies/dotnet-developers/', 'Hiring .NET engineers'),
    job('android-engineer', 'Android engineer', 'Native Android apps, from the repo to the Play Store, for a US product team.', ['Kotlin, with Java where the existing app still uses it', 'Apps shipped to the Google Play Store', 'Screens that follow the product design system', '5 or more years as a software engineer'], 'You use AI tools to draft tests or a Kotlin migration step, then you review the result before it ships.', '/technologies/android-developers/', 'Hiring Android engineers'),
    job('aws-engineer', 'AWS engineer', 'Production systems on AWS for a US product team: accounts, networking, and the path to deploy.', ['Production workloads on AWS', 'Infrastructure as code, such as Terraform or CloudFormation', 'CI that can deploy and roll back', '5 or more years in engineering or operations'], 'You use AI tools to draft a Terraform change or a runbook, then you review it before it is applied.', '/technologies/aws-developers/', 'Hiring AWS engineers'),
    job('azure-engineer', 'Azure engineer', 'Production systems on Microsoft Azure for a US product team.', ['Production workloads on Azure', 'Infrastructure as code', 'Identity, networking, and a safe deploy path', '5 or more years in engineering or operations'], 'You use AI tools to draft a template or a runbook, then you review it before it is applied.', '/technologies/azure-developers/', 'Hiring Azure engineers'),
    job('blockchain-engineer', 'Blockchain engineer', 'Smart contracts and the services around them, for a US product team.', ['Solidity or a comparable contract language', 'How transactions, keys, and upgrades fail in production', 'APIs that let a product read and write chain state', '5 or more years as a software engineer'], 'You use AI tools to draft tests around a contract, then you review every line before it is deployed.', '/roles/blockchain-engineers/', 'Hiring blockchain engineers'),
    job('data-science-engineer', 'Data science engineer', 'Models and experiments that answer a product question for a US team.', ['Python for analysis and modeling', 'Experiments with a clear metric and a decision at the end', 'Data a report can trust, not a one-off notebook', '5 or more years in data science or engineering'], 'You use AI tools to draft a query or a notebook step, then you check the result against the source data.', '/roles/data-science-engineers/', 'Hiring data science engineers'),
    job('devops-engineer', 'DevOps engineer', 'CI, Kubernetes, and monitoring so a US team can release and roll back.', ['CI/CD that the team actually uses', 'Kubernetes in production', 'Monitoring and a rollback path', '5 or more years in engineering or operations'], 'You use AI tools to draft a pipeline step or a dashboard query, then you review it before it runs in production.', '/roles/devops-engineers/', 'Hiring DevOps engineers'),
    job('front-end-engineer', 'Front-end engineer', 'Screens in React, Vue, or Angular that follow a US team design system.', ['HTML, CSS, and accessible components', 'React, Vue, or Angular in production', 'TypeScript on the current codebase', '5 or more years as a software engineer'], 'You use AI tools to draft a component or a test, then you review the markup and the behavior before it ships.', '/roles/front-end-engineers/', 'Hiring front-end engineers'),
    job('full-stack-javascript-engineer', 'Full-stack JavaScript engineer', 'A feature from the React screen through the Node.js API to deploy, on a US team.', ['React on the front end and Node.js on the API', 'A database the feature actually uses', 'A deploy you can roll back', '5 or more years as a software engineer'], 'You use AI tools to draft one layer of a feature, then you review the whole path before it ships.', '/roles/full-stack-engineers/', 'Hiring full-stack engineers'),
    job('ios-engineer', 'iOS engineer', 'Native iOS apps, from the repo through App Store review, for a US product team.', ['Swift and the current Apple UI stack', 'Apps shipped through App Store review', 'Networking, storage, and crash reports in production', '5 or more years as a software engineer'], 'You use AI tools to draft a Swift test or a first pass of a screen, then you review it before it goes to TestFlight.', '/technologies/ios-developers/', 'Hiring iOS engineers'),
    job('java-engineer', 'Java engineer', 'Services and APIs in Java, usually with Spring Boot, for a US product team.', ['Java and Spring Boot in production', 'APIs and the database behind them', 'Tests that run in CI', '5 or more years as a software engineer'], 'You use AI tools to draft a test or a service method, then you review the diff before it ships.', '/technologies/java-developers/', 'Hiring Java engineers'),
    job('kubernetes-software-engineer', 'Kubernetes engineer', 'Clusters, deploys, and the path to roll back, for a US product team.', ['Kubernetes in production', 'Helm, Kustomize, or plain manifests the team can read', 'CI that deploys to the cluster', '5 or more years in engineering or operations'], 'You use AI tools to draft a manifest or a probe, then you review it before it is applied.', '/technologies/kubernetes-developers/', 'Hiring Kubernetes engineers'),
    job('node-js-engineer', 'Node.js engineer', 'APIs and services in Node.js for a US product team.', ['Node.js services in production', 'REST or GraphQL that other teams call', 'PostgreSQL, MySQL, or a document store', '5 or more years as a software engineer'], 'You use AI tools to draft a handler or a test, then you review the behavior before it ships.', '/technologies/nodejs-developers/', 'Hiring Node.js engineers'),
    job('php-engineer', 'PHP engineer', 'PHP applications, often Laravel, for a US product team.', ['PHP and Laravel, or the framework the team already runs', 'MySQL or PostgreSQL', 'A deploy path the team uses', '5 or more years as a software engineer'], 'You use AI tools to draft a controller or a test, then you review it before it ships.', '/technologies/php-developers/', 'Hiring PHP engineers'),
    job('python-engineer', 'Python engineer', 'Services, data jobs, or internal tools in Python for a US product team.', ['Python in production, not only notebooks', 'APIs, workers, or data jobs the team relies on', 'Tests that run in CI', '5 or more years as a software engineer'], 'You use AI tools to draft a test or a first pass of a script, then you review the result before it ships.', '/technologies/python-developers/', 'Hiring Python engineers'),
    job('qa-automation-engineer', 'QA automation engineer', 'Cypress, Playwright, and API checks before a US team releases.', ['Cypress or Playwright on a real product', 'API tests, not only UI clicks', 'A way to run the suite in CI', '5 or more years in QA or engineering'], 'You use AI tools to draft a test case, then you run it and throw out the ones that do not catch a real failure.', '/roles/qa-engineers/', 'Hiring QA engineers'),
    job('react-native-engineer', 'React Native engineer', 'iOS and Android apps in React Native, through store review, for a US team.', ['React Native in production', 'TypeScript', 'A release through the App Store and Play Store', '5 or more years as a software engineer'], 'You use AI tools to draft a component or a test, then you review it on a device before it ships.', '/technologies/react-native-developers/', 'Hiring React Native engineers'),
    job('ruby-on-rails-engineer', 'Ruby on Rails engineer', 'Rails applications, from the model to the deploy, for a US product team.', ['Ruby on Rails in production', 'PostgreSQL or MySQL', 'Tests with RSpec or the suite the team already runs', '5 or more years as a software engineer'], 'You use AI tools to draft a model test or a migration, then you review it before it runs.', '/technologies/ruby-on-rails-developers/', 'Hiring Ruby on Rails engineers'),
    job('rust-c-engineer', 'Rust and C++ engineer', 'Performance-sensitive services in Rust or C++ for a US product team.', ['Rust or C++ in production', 'Memory, latency, and what fails under load', 'Tests and a review bar the team trusts', '5 or more years as a software engineer'], 'You use AI tools to draft a test or a small function, then you review ownership and error paths before it ships.', '/technologies/rust-developers/', 'Hiring Rust engineers'),
    job('salesforce-engineer', 'Salesforce engineer', 'Salesforce configuration and code for a US team that runs its work in the platform.', ['Apex, Lightning, or both, in a live org', 'Integrations with the rest of the product', 'A sandbox path, not edits straight in production', '5 or more years in engineering or Salesforce delivery'], 'You use AI tools to draft an Apex test or a field plan, then you review it in a sandbox before it is promoted.', '/contact/', 'Hiring Salesforce engineers'),
    job('shopify-engineer', 'Shopify engineer', 'Shopify themes, apps, and checkout changes for a US commerce team.', ['Shopify themes or apps in production', 'Liquid, JavaScript, or a Shopify app backend', 'A change you can preview before it hits the live store', '5 or more years as a software engineer'], 'You use AI tools to draft a section or a test order path, then you review it in a preview theme before it goes live.', '/contact/', 'Hiring Shopify engineers'),
    job('typescript-engineer', 'TypeScript engineer', 'Typed JavaScript across a US team stack, from the UI to the API.', ['TypeScript in a production codebase', 'Types that match the runtime, not only the happy path', 'React, Node.js, or both', '5 or more years as a software engineer'], 'You use AI tools to draft a typed function, then you check the types against real inputs before it ships.', '/technologies/typescript-developers/', 'Hiring TypeScript engineers'),
    job('ui-ux-engineer', 'UI engineer', 'Interface design and the front-end code that implements it, for a US product team.', ['Design systems and the components that implement them', 'HTML, CSS, and accessible interaction', 'Figma, or the tool the team already uses, plus the code', '5 or more years in UI engineering or product design'], 'You use AI tools to draft a variant or a copy pass, then you check it against the design system before it ships.', '/contact/', 'Hiring UI engineers'),
    job('unity-engineer', 'Unity engineer', 'Unity games or interactive apps for a US team, through a build players can run.', ['Unity and C# in a shipped or live project', 'Scenes, input, and a build pipeline', 'Performance on the target device', '5 or more years as a software engineer'], 'You use AI tools to draft a script or a test scene, then you play the result before it is merged.', '/contact/', 'Hiring Unity engineers'),
    job('unreal-engineer', 'Unreal engineer', 'Unreal projects, in C++ or Blueprints, for a US team.', ['Unreal Engine on a real project', 'C++ or Blueprints, matching the codebase', 'A build the team can run', '5 or more years as a software engineer'], 'You use AI tools to draft a Blueprint note or a C++ stub, then you run it in editor before it is merged.', '/contact/', 'Hiring Unreal engineers'),
    job('wordpress-engineer', 'WordPress engineer', 'WordPress themes and plugins for a US team, with PHP they can review.', ['WordPress themes or plugins in production', 'PHP, and the hooks the site already uses', 'A staging site, not edits only on production', '5 or more years as a software engineer'], 'You use AI tools to draft a template or a plugin function, then you review it on staging before it goes live.', '/technologies/php-developers/', 'Hiring WordPress engineers'),
    job('magento-engineer', 'Magento engineer', 'Adobe Commerce or Magento stores for a US commerce team.', ['Magento or Adobe Commerce in production', 'PHP modules and the theme the store already uses', 'Checkout, catalog, or integration work you can roll back', '5 or more years as a software engineer'], 'You use AI tools to draft a module sketch, then you review it on a staging store before it goes live.', '/contact/', 'Hiring Magento engineers'),
    job('ai-engineer', 'AI engineer', 'LLM features inside an existing product, from a demo to something the team can run.', ['A shipped feature that calls a model, not only a notebook', 'Prompts, tools, and a way to tell when the output is wrong', 'The product stack the feature has to live in', '5 or more years as a software engineer'], 'You are assessed at the top of the four-level scale: you design the model workflow and you can explain a bad output.', '/roles/ai-engineers/', 'Hiring AI engineers'),
    job('data-engineer', 'Data engineer', 'Pipelines a US team can trust, with tools such as Airflow, dbt, or Spark.', ['A pipeline that feeds a report or a product feature', 'SQL and a warehouse the team already uses', 'Tests or checks that fail when the data is wrong', '5 or more years in data or software engineering'], 'You use AI tools to draft a model or a SQL check, then you compare the output to the source before it is scheduled.', '/roles/data-engineers/', 'Hiring data engineers'),
    job('react-engineer', 'React engineer', 'React and TypeScript screens for a US product team, inside their design system.', ['React in production', 'TypeScript', 'Component state, data loading, and a reviewable pull request', '5 or more years as a software engineer'], 'You use AI tools to draft a component or a test, then you review rendering and accessibility before it ships.', '/technologies/react-developers/', 'Hiring React engineers'),
    job('go-engineer', 'Go engineer', 'Services in Go for a US product team: APIs, workers, and a deploy they can roll back.', ['Go services in production', 'HTTP or RPC APIs', 'PostgreSQL, Redis, or the store the service uses', '5 or more years as a software engineer'], 'You use AI tools to draft a handler or a test, then you review error handling before it ships.', '/technologies/golang-developers/', 'Hiring Go engineers'),
    job('flutter-engineer', 'Flutter engineer', 'iOS and Android apps in Flutter, through store review, for a US team.', ['Flutter and Dart in a shipped app', 'A release through the App Store and Play Store', 'State, networking, and the builds the team runs', '5 or more years as a software engineer'], 'You use AI tools to draft a widget or a test, then you run it on a device before it ships.', '/technologies/flutter-developers/', 'Hiring Flutter engineers'),
  ],
};

function job(slug, name, intro, requirements, aiClause, hireHref, hireLabel) {
  var short = name.replace(' engineer', '').replace('Engineer', '').trim();
  return {
    slug: slug,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    title: name.charAt(0).toUpperCase() + name.slice(1) + ' jobs in Latin America | BetterEngineer',
    description:
      short +
      ' engineers in Latin America join US product teams through BetterEngineer. Full-time contract, US business hours, advanced English.',
    intro: intro,
    requirements: requirements,
    aiClause: aiClause,
    hireHref: hireHref,
    hireLabel: hireLabel,
  };
}

function pageRecords() {
  var hub = {
    slug: 'careers',
    fragment: 'fragments/careers/index.html',
    outputs: ['careers/index.html'],
    cssBundle: 'landing',
    script: 'page.js',
    migrated: true,
    excludeFromDiscover: true,
    navActive: 'join',
    title: data.hub.title,
    description: data.hub.description,
    canonical: WWW + '/careers',
    breadcrumb: [{ name: 'Home', url: WWW + '/' }, { name: 'Careers' }],
    lastUpdated: '2026-11-09',
    extraSchema: function (ctx) {
      return [{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: data.hub.title,
        url: ctx.canonical,
        hasPart: data.jobs.map(function (item) {
          return { '@type': 'WebPage', name: item.name, url: WWW + '/careers/' + item.slug };
        }),
      }];
    },
  };
  var jobPages = data.jobs.map(function (item) {
    return {
      slug: 'careers-' + item.slug,
      fragment: 'fragments/careers/' + item.slug + '.html',
      outputs: ['careers/' + item.slug + '/index.html'],
      cssBundle: 'landing',
      script: 'page.js',
      migrated: true,
      excludeFromDiscover: true,
      navActive: 'join',
      title: item.title,
      description: item.description,
      canonical: WWW + '/careers/' + item.slug,
      breadcrumb: [
        { name: 'Home', url: WWW + '/' },
        { name: 'Careers', url: WWW + '/careers' },
        { name: item.name },
      ],
      lastUpdated: '2026-11-09',
    };
  });
  return [hub].concat(jobPages);
}

module.exports = {
  WWW: WWW,
  hub: data.hub,
  shared: data.shared,
  jobs: data.jobs,
  retired: data.retired,
  pageRecords: pageRecords,
};
