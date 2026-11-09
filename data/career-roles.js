'use strict';

function displayName(name) {
  if (name.charAt(0) === '.') return name;
  if (name.slice(0, 3) === 'iOS') return name;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function job(slug, name, intro, work, stack, requirements, aiClause, hireHref, hireLabel) {
  var display = displayName(name);
  var short = display.replace(/ engineer$/, '');
  return {
    slug: slug,
    name: display,
    title: display + ' jobs in Latin America | BetterEngineer',
    description:
      short +
      ' engineers in Latin America join US product teams through BetterEngineer. Full-time contract, US business hours, advanced English.',
    intro: intro,
    work: work,
    stack: stack,
    requirements: requirements,
    aiClause: aiClause,
    hireHref: hireHref,
    hireLabel: hireLabel,
  };
}

module.exports = [
  job(
    'net-engineer',
    '.NET engineer',
    'C#, ASP.NET Core, and SQL Server or PostgreSQL on a US product team.',
    'You work in an existing .NET codebase for a US product team. A normal change is an API or a service other teams already call, plus the database behind it. You ship through their pull requests and their deploy, and you can roll a change back.',
    ['C#', 'ASP.NET Core', 'SQL Server or PostgreSQL', 'Entity Framework or the data access the repo already uses', 'xUnit, NUnit, or the test project in the repo', 'Azure or the host the team already runs'],
    ['C# and ASP.NET Core in production', 'SQL Server or PostgreSQL', 'APIs that other teams call', '5 or more years as a software engineer'],
    'You use AI tools to draft tests and a first pass of a C# change, then you review the diff before it ships.',
    '/technologies/dotnet-developers/',
    'Hiring .NET engineers'
  ),
  job(
    'android-engineer',
    'Android engineer',
    'Native Android apps, from the repo to the Play Store, for a US product team.',
    'You work in the client Android repo. A normal change is a screen, a bug in a flow people already use, or a Play Store release. Kotlin is the default. Java stays where the existing app still uses it.',
    ['Kotlin', 'Java where the app still has it', 'Jetpack and the Android SDK', 'Gradle', 'Play Console', 'The design system the app already follows'],
    ['Kotlin, with Java where the existing app still uses it', 'Apps shipped to the Google Play Store', 'Screens that follow the product design system', '5 or more years as a software engineer'],
    'You use AI tools to draft tests or a Kotlin migration step, then you review the result before it ships.',
    '/technologies/android-developers/',
    'Hiring Android engineers'
  ),
  job(
    'aws-engineer',
    'AWS engineer',
    'Production systems on AWS for a US product team: accounts, networking, and the path to deploy.',
    'You look after production systems on AWS for a US team. The work is accounts, networking, and a deploy path the team can roll back. You change infrastructure in code, and you review it before it is applied.',
    ['AWS accounts and IAM', 'VPC, load balancers, and the network the app uses', 'Terraform or CloudFormation', 'CI that can deploy and roll back', 'CloudWatch or the logs the team already reads', 'The runtime the app uses, such as ECS, EKS, or Lambda'],
    ['Production workloads on AWS', 'Infrastructure as code, such as Terraform or CloudFormation', 'CI that can deploy and roll back', '5 or more years in engineering or operations'],
    'You use AI tools to draft a Terraform change or a runbook, then you review it before it is applied.',
    '/technologies/aws-developers/',
    'Hiring AWS engineers'
  ),
  job(
    'azure-engineer',
    'Azure engineer',
    'Production systems on Microsoft Azure for a US product team.',
    'You look after production systems on Microsoft Azure for a US team. The work is identity, networking, and a deploy path the team can roll back. You change infrastructure in code, and you review it before it is applied.',
    ['Azure subscriptions and identity', 'Networking for the app', 'Bicep, ARM, or Terraform', 'CI that can deploy and roll back', 'The logs and alerts the team already uses', 'App Service, AKS, or the host the app already runs on'],
    ['Production workloads on Azure', 'Infrastructure as code', 'Identity, networking, and a safe deploy path', '5 or more years in engineering or operations'],
    'You use AI tools to draft a template or a runbook, then you review it before it is applied.',
    '/technologies/azure-developers/',
    'Hiring Azure engineers'
  ),
  job(
    'blockchain-engineer',
    'Blockchain engineer',
    'Smart contracts and the services around them, for a US product team.',
    'You work on smart contracts and the services that read and write them for a US product team. A change is a contract, a test that shows how it fails, or an API the product uses to read chain state. You do not deploy a contract you have not reviewed line by line.',
    ['Solidity or the contract language in the repo', 'The test framework the repo uses', 'The chain the product is on', 'Keys, upgrades, and what happens when a transaction fails', 'The API in front of chain state'],
    ['Solidity or a comparable contract language', 'How transactions, keys, and upgrades fail in production', 'APIs that let a product read and write chain state', '5 or more years as a software engineer'],
    'You use AI tools to draft tests around a contract, then you review every line before it is deployed.',
    '/roles/blockchain-engineers/',
    'Hiring blockchain engineers'
  ),
  job(
    'data-science-engineer',
    'Data science engineer',
    'Models and experiments that answer a product question for a US team.',
    'You answer a product question with data a US team can use. A piece of work ends in a metric, a decision, or a model the product can run. A notebook that nobody else can rerun is not the deliverable.',
    ['Python', 'SQL', 'The warehouse the team uses', 'pandas or the library the repo already uses', 'The metric the decision depends on', 'A way for someone else to rerun the analysis'],
    ['Python for analysis and modeling', 'Experiments with a clear metric and a decision at the end', 'Data a report can trust, not a one-off notebook', '5 or more years in data science or engineering'],
    'You use AI tools to draft a query or a notebook step, then you check the result against the source data.',
    '/roles/data-science-engineers/',
    'Hiring data science engineers'
  ),
  job(
    'devops-engineer',
    'DevOps engineer',
    'CI, Kubernetes, and monitoring so a US team can release and roll back.',
    'You keep a US team release path working. That means CI, the cluster, monitoring, and a rollback they have used. You change pipelines and manifests in review. You do not edit production by hand as the first step.',
    ['GitHub Actions, GitLab CI, or the CI the team runs', 'Kubernetes', 'Terraform or the infrastructure repo', 'Monitoring and alerts', 'A rollback the team has used', 'The logs the on-call person already reads'],
    ['CI/CD that the team actually uses', 'Kubernetes in production', 'Monitoring and a rollback path', '5 or more years in engineering or operations'],
    'You use AI tools to draft a pipeline step or a dashboard query, then you review it before it runs in production.',
    '/roles/devops-engineers/',
    'Hiring DevOps engineers'
  ),
  job(
    'front-end-engineer',
    'Front-end engineer',
    'Screens in React, Vue, or Angular that follow a US team design system.',
    'You build screens in the client React, Vue, or Angular app, inside their design system. A change is a component, a bug in a flow, or a page that has to work with a keyboard and a screen reader. This role covers more than one front-end framework. React-only work is the React role.',
    ['HTML and CSS', 'React, Vue, or Angular, matching the app', 'TypeScript on the current codebase', 'The design system', 'Tests the repo already runs', 'Keyboard and screen reader behavior'],
    ['HTML, CSS, and accessible components', 'React, Vue, or Angular in production', 'TypeScript on the current codebase', '5 or more years as a software engineer'],
    'You use AI tools to draft a component or a test, then you review the markup and the behavior before it ships.',
    '/roles/front-end-engineers/',
    'Hiring front-end engineers'
  ),
  job(
    'full-stack-javascript-engineer',
    'Full-stack JavaScript engineer',
    'A feature from the React screen through the Node.js API to deploy, on a US team.',
    'You take a feature from the React screen through the Node.js API and the database, then through the team deploy. You own that path, including the failure in the middle. A pull request that only changes one layer, and leaves the others untested, is not finished.',
    ['React', 'Node.js', 'TypeScript', 'PostgreSQL or the database the feature uses', 'The test runner in the repo', 'A deploy the team can roll back'],
    ['React on the front end and Node.js on the API', 'A database the feature actually uses', 'A deploy you can roll back', '5 or more years as a software engineer'],
    'You use AI tools to draft one layer of a feature, then you review the whole path before it ships.',
    '/roles/full-stack-engineers/',
    'Hiring full-stack engineers'
  ),
  job(
    'ios-engineer',
    'iOS engineer',
    'Native iOS apps, from the repo through App Store review, for a US product team.',
    'You work in the client native iOS app, from a Swift change through TestFlight and App Store review. A normal week is a screen, a crash, or a release. You use the UI stack the app already uses, UIKit or SwiftUI.',
    ['Swift', 'UIKit or SwiftUI, matching the app', 'Xcode', 'TestFlight and App Store Connect', 'Networking and local storage', 'Crash reports from production'],
    ['Swift and the current Apple UI stack', 'Apps shipped through App Store review', 'Networking, storage, and crash reports in production', '5 or more years as a software engineer'],
    'You use AI tools to draft a Swift test or a first pass of a screen, then you review it before it goes to TestFlight.',
    '/technologies/ios-developers/',
    'Hiring iOS engineers'
  ),
  job(
    'java-engineer',
    'Java engineer',
    'Services and APIs in Java, usually with Spring Boot, for a US product team.',
    'You work on Java services a US team already runs, usually with Spring Boot. A change is an API, the database behind it, and a test that runs in their CI. You ship through their pull request and their deploy.',
    ['Java', 'Spring Boot', 'The database the service uses', 'JUnit', 'Maven or Gradle, matching the repo', 'A deploy the team can roll back'],
    ['Java and Spring Boot in production', 'APIs and the database behind them', 'Tests that run in CI', '5 or more years as a software engineer'],
    'You use AI tools to draft a test or a service method, then you review the diff before it ships.',
    '/technologies/java-developers/',
    'Hiring Java engineers'
  ),
  job(
    'kubernetes-software-engineer',
    'Kubernetes engineer',
    'Clusters, deploys, and the path to roll back, for a US product team.',
    'You work on the cluster a US team deploys to. A change is a manifest, a probe, or the CI job that applies it. You review it before it is applied, and you know how to roll it back.',
    ['Kubernetes', 'Helm, Kustomize, or plain YAML', 'The CI job that deploys', 'Ingress, services, and probes', 'Logs the team already uses', 'A rollback'],
    ['Kubernetes in production', 'Helm, Kustomize, or plain manifests the team can read', 'CI that deploys to the cluster', '5 or more years in engineering or operations'],
    'You use AI tools to draft a manifest or a probe, then you review it before it is applied.',
    '/technologies/kubernetes-developers/',
    'Hiring Kubernetes engineers'
  ),
  job(
    'node-js-engineer',
    'Node.js engineer',
    'APIs and services in Node.js for a US product team.',
    'You build and keep Node.js APIs and workers for a US product team. Other teams call what you ship, so a change includes the error path and a test, not only the happy path.',
    ['Node.js', 'REST or GraphQL', 'PostgreSQL, MySQL, or the store the service uses', 'The test runner in the repo', 'The deploy the team can roll back'],
    ['Node.js services in production', 'REST or GraphQL that other teams call', 'PostgreSQL, MySQL, or a document store', '5 or more years as a software engineer'],
    'You use AI tools to draft a handler or a test, then you review the behavior before it ships.',
    '/technologies/nodejs-developers/',
    'Hiring Node.js engineers'
  ),
  job(
    'php-engineer',
    'PHP engineer',
    'PHP applications, often Laravel, for a US product team.',
    'You work in a PHP application a US team already runs, often Laravel. A change is a feature in their app, the database it touches, and their deploy. You follow the framework the repo already uses.',
    ['PHP', 'Laravel or the framework in the repo', 'MySQL or PostgreSQL', 'The test suite', 'Queues, if the app uses them', 'The deploy path'],
    ['PHP and Laravel, or the framework the team already runs', 'MySQL or PostgreSQL', 'A deploy path the team uses', '5 or more years as a software engineer'],
    'You use AI tools to draft a controller or a test, then you review it before it ships.',
    '/technologies/php-developers/',
    'Hiring PHP engineers'
  ),
  job(
    'python-engineer',
    'Python engineer',
    'Services, data jobs, or internal tools in Python for a US product team.',
    'You write Python that a US team runs in production. That can be an API, a worker, or a data job. A notebook that only you can rerun does not count as the work. A change includes a test in their CI and a deploy they can roll back.',
    ['Python', 'Django, FastAPI, Flask, or the worker the repo uses', 'pytest', 'PostgreSQL or the store the job uses', 'The CI pipeline', 'A deploy the team can roll back'],
    ['Python in production, not only notebooks', 'APIs, workers, or data jobs the team relies on', 'Tests that run in CI', '5 or more years as a software engineer'],
    'You use AI tools to draft a test or a first pass of a script, then you review the result before it ships.',
    '/technologies/python-developers/',
    'Hiring Python engineers'
  ),
  job(
    'qa-automation-engineer',
    'QA automation engineer',
    'Cypress, Playwright, and API checks before a US team releases.',
    'You stop a bad release for a US team. You write Cypress or Playwright checks, plus API checks, and you wire them into the CI the team already runs. A test that never fails, or fails at random, does not count.',
    ['Cypress or Playwright', 'API tests', 'The CI the team runs', 'The environments the suite hits', 'The bug tracker the team uses', 'A way to tell a real failure from a flake'],
    ['Cypress or Playwright on a real product', 'API tests, not only UI clicks', 'A way to run the suite in CI', '5 or more years in QA or engineering'],
    'You use AI tools to draft a test case, then you run it and throw out the ones that do not catch a real failure.',
    '/roles/qa-engineers/',
    'Hiring QA engineers'
  ),
  job(
    'react-native-engineer',
    'React Native engineer',
    'iOS and Android apps in React Native, through store review, for a US team.',
    'You ship one React Native codebase to iOS and Android for a US team, through store review. A change is a screen, a native module the app already depends on, or a release. You run it on a device before it ships.',
    ['React Native', 'TypeScript', 'iOS and Android build tooling', 'The navigation and state the app uses', 'App Store Connect and Play Console', 'A device build, not only a simulator'],
    ['React Native in production', 'TypeScript', 'A release through the App Store and Play Store', '5 or more years as a software engineer'],
    'You use AI tools to draft a component or a test, then you review it on a device before it ships.',
    '/technologies/react-native-developers/',
    'Hiring React Native engineers'
  ),
  job(
    'ruby-on-rails-engineer',
    'Ruby on Rails engineer',
    'Rails applications, from the model to the deploy, for a US product team.',
    'You work in a Ruby on Rails application a US team already runs. A normal change starts in a model or a controller, includes the database migration, and ends in a pull request with a test. You use their deploy, and you can roll it back.',
    ['Ruby on Rails', 'PostgreSQL or MySQL', 'RSpec or the suite in the repo', 'Hotwire, or the front end the app already uses', 'Sidekiq or the job runner, if the app has one', 'The deploy the team can roll back'],
    ['Ruby on Rails in production', 'PostgreSQL or MySQL', 'Tests with RSpec or the suite the team already runs', '5 or more years as a software engineer'],
    'You use AI tools to draft a model test or a migration, then you review it before it runs.',
    '/technologies/ruby-on-rails-developers/',
    'Hiring Ruby on Rails engineers'
  ),
  job(
    'rust-c-engineer',
    'Rust and C++ engineer',
    'Performance-sensitive services in Rust or C++ for a US product team.',
    'You work on performance-sensitive code in Rust or C++ for a US product team. A change has to say what it does to memory, latency, and failure under load. You do not merge a function you have not reviewed.',
    ['Rust or C++, matching the repo', 'The build the repo uses', 'Tests, and sanitizers if the repo has them', 'The service or engine the code sits in', 'Profiling when the work is about speed'],
    ['Rust or C++ in production', 'Memory, latency, and what fails under load', 'Tests and a review bar the team trusts', '5 or more years as a software engineer'],
    'You use AI tools to draft a test or a small function, then you review ownership and error paths before it ships.',
    '/technologies/rust-developers/',
    'Hiring Rust engineers'
  ),
  job(
    'salesforce-engineer',
    'Salesforce engineer',
    'Salesforce configuration and code for a US team that runs its work in the platform.',
    'You change a live Salesforce org for a US team: Apex, Lightning, or both, plus the integrations around it. Changes go through a sandbox. Editing production is not the first step.',
    ['Apex', 'Lightning', 'The objects the team uses', 'Integrations with the rest of the product', 'A sandbox and the path that promotes a change', 'Tests in the org'],
    ['Apex, Lightning, or both, in a live org', 'Integrations with the rest of the product', 'A sandbox path, not edits straight in production', '5 or more years in engineering or Salesforce delivery'],
    'You use AI tools to draft an Apex test or a field plan, then you review it in a sandbox before it is promoted.',
    '/contact/',
    'Hiring Salesforce engineers'
  ),
  job(
    'shopify-engineer',
    'Shopify engineer',
    'Shopify themes, apps, and checkout changes for a US commerce team.',
    'You change a Shopify store a US team sells on. That is a theme, an app, or checkout. You preview the change before it hits the live store, including a test order when the change touches checkout.',
    ['Shopify', 'Liquid', 'JavaScript or a Shopify app backend', 'Checkout', 'A preview theme', 'Products, carts, and orders the change touches'],
    ['Shopify themes or apps in production', 'Liquid, JavaScript, or a Shopify app backend', 'A change you can preview before it hits the live store', '5 or more years as a software engineer'],
    'You use AI tools to draft a section or a test order path, then you review it in a preview theme before it goes live.',
    '/contact/',
    'Hiring Shopify engineers'
  ),
  job(
    'typescript-engineer',
    'TypeScript engineer',
    'Typed JavaScript across a US team stack, from the UI to the API.',
    'You work in a TypeScript codebase that spans the UI, the API, or both, for a US team. The types have to match what the code does with real input, including the failure case. A type that only covers the happy path is not done.',
    ['TypeScript', 'React, Node.js, or both', 'Types at the API boundary', 'The test runner in the repo', 'The lint and build the team already runs'],
    ['TypeScript in a production codebase', 'Types that match the runtime, not only the happy path', 'React, Node.js, or both', '5 or more years as a software engineer'],
    'You use AI tools to draft a typed function, then you check the types against real inputs before it ships.',
    '/technologies/typescript-developers/',
    'Hiring TypeScript engineers'
  ),
  job(
    'ui-ux-engineer',
    'UI / UX engineer',
    'Interface design and the front-end code that implements it, for a US product team.',
    'You design and build interface work for a US product team. A change is a flow in their design system and the HTML and CSS that implement it. You check it with a keyboard and a screen reader, not only by looking at it.',
    ['Figma, or the design tool the team uses', 'HTML and CSS', 'The component library', 'The front-end framework the product uses', 'Keyboard and screen reader checks'],
    ['Design systems and the components that implement them', 'HTML, CSS, and accessible interaction', 'Figma, or the tool the team already uses, plus the code', '5 or more years in UI engineering or product design'],
    'You use AI tools to draft a variant or a copy pass, then you check it against the design system before it ships.',
    '/contact/',
    'Hiring UI engineers'
  ),
  job(
    'unity-engineer',
    'Unity engineer',
    'Unity games or interactive apps for a US team, through a build players can run.',
    'You work in a Unity project a US team can build and run. A change is a scene, input, a C# script, and a build that plays on the target device. You play the build before it is merged.',
    ['Unity', 'C#', 'The render pipeline the project uses', 'Input', 'The build target', 'Profiling on the target device'],
    ['Unity and C# in a shipped or live project', 'Scenes, input, and a build pipeline', 'Performance on the target device', '5 or more years as a software engineer'],
    'You use AI tools to draft a script or a test scene, then you play the result before it is merged.',
    '/contact/',
    'Hiring Unity engineers'
  ),
  job(
    'unreal-engineer',
    'Unreal engineer',
    'Unreal projects, in C++ or Blueprints, for a US team.',
    'You work in an Unreal project for a US team, in C++ or Blueprints, matching the codebase. A change is something you can run in the editor and hand to the team as a build. You run it before it is merged.',
    ['Unreal Engine', 'C++ or Blueprints, matching the project', 'The gameplay framework the project uses', 'A build the team can run', 'The source control the team uses'],
    ['Unreal Engine on a real project', 'C++ or Blueprints, matching the codebase', 'A build the team can run', '5 or more years as a software engineer'],
    'You use AI tools to draft a Blueprint note or a C++ stub, then you run it in editor before it is merged.',
    '/contact/',
    'Hiring Unreal engineers'
  ),
  job(
    'wordpress-engineer',
    'WordPress engineer',
    'WordPress themes and plugins for a US team, with PHP they can review.',
    'You change WordPress themes and plugins for a US team. PHP goes through review. You try the change on a staging site before it reaches production.',
    ['WordPress', 'PHP', 'The theme and the hooks the site uses', 'Custom fields, if the site uses them', 'MySQL', 'A staging site'],
    ['WordPress themes or plugins in production', 'PHP, and the hooks the site already uses', 'A staging site, not edits only on production', '5 or more years as a software engineer'],
    'You use AI tools to draft a template or a plugin function, then you review it on staging before it goes live.',
    '/technologies/php-developers/',
    'Hiring WordPress engineers'
  ),
  job(
    'magento-engineer',
    'Magento engineer',
    'Adobe Commerce or Magento stores for a US commerce team.',
    'You change an Adobe Commerce or Magento store for a US commerce team. The work is catalog, checkout, a module, or an integration. You try it on a staging store, and you can roll it back.',
    ['Magento or Adobe Commerce', 'PHP modules', 'The theme the store uses', 'Catalog and checkout', 'MySQL', 'A staging store'],
    ['Magento or Adobe Commerce in production', 'PHP modules and the theme the store already uses', 'Checkout, catalog, or integration work you can roll back', '5 or more years as a software engineer'],
    'You use AI tools to draft a module sketch, then you review it on a staging store before it goes live.',
    '/contact/',
    'Hiring Magento engineers'
  ),
  job(
    'ai-engineer',
    'AI engineer',
    'LLM features inside an existing product, from a demo to something the team can run.',
    'You put a model feature inside a product a US team already ships. The work is the prompt or the tool call, the product code around it, and a way to tell when the output is wrong. A demo notebook is not the feature.',
    ['The language the product is written in', 'A model API', 'Prompts and tool calls', 'A review set or an eval for bad outputs', 'Logging when the model is wrong', 'The product path the feature has to live in'],
    ['A shipped feature that calls a model, not only a notebook', 'Prompts, tools, and a way to tell when the output is wrong', 'The product stack the feature has to live in', '5 or more years as a software engineer'],
    'You are assessed at the top of the four-level scale: you design the model workflow and you can explain a bad output.',
    '/roles/ai-engineers/',
    'Hiring AI engineers'
  ),
  job(
    'data-engineer',
    'Data engineer',
    'Pipelines a US team can trust, with tools such as Airflow, dbt, or Spark.',
    'You build pipelines a US team can schedule and trust. A pipeline feeds a report or a product feature. It fails a check when the data is wrong, instead of quietly shipping a bad number.',
    ['SQL', 'The warehouse the team uses', 'Airflow, dbt, or Spark, matching the stack', 'Tests or freshness checks', 'The scheduler', 'The report or feature that reads the output'],
    ['A pipeline that feeds a report or a product feature', 'SQL and a warehouse the team already uses', 'Tests or checks that fail when the data is wrong', '5 or more years in data or software engineering'],
    'You use AI tools to draft a model or a SQL check, then you compare the output to the source before it is scheduled.',
    '/roles/data-engineers/',
    'Hiring data engineers'
  ),
  job(
    'react-engineer',
    'React engineer',
    'React and TypeScript screens for a US product team, inside their design system.',
    'You build React and TypeScript screens inside a US team design system. A change is a component, the data it loads, and a pull request someone else can review. This role is React. The front-end role is the one that also covers Vue and Angular.',
    ['React', 'TypeScript', 'The design system', 'Data loading', 'Tests in the repo', 'Accessibility checks'],
    ['React in production', 'TypeScript', 'Component state, data loading, and a reviewable pull request', '5 or more years as a software engineer'],
    'You use AI tools to draft a component or a test, then you review rendering and accessibility before it ships.',
    '/technologies/react-developers/',
    'Hiring React engineers'
  ),
  job(
    'go-engineer',
    'Go engineer',
    'Services in Go for a US product team: APIs, workers, and a deploy they can roll back.',
    'You write Go services for a US team: an API, a worker, and a deploy they can roll back. Error handling is part of the change, not a follow-up. You review it before it ships.',
    ['Go', 'HTTP or gRPC', 'PostgreSQL, Redis, or the store the service uses', 'The testing package', 'Context and error handling', 'A deploy the team can roll back'],
    ['Go services in production', 'HTTP or RPC APIs', 'PostgreSQL, Redis, or the store the service uses', '5 or more years as a software engineer'],
    'You use AI tools to draft a handler or a test, then you review error handling before it ships.',
    '/technologies/golang-developers/',
    'Hiring Go engineers'
  ),
  job(
    'flutter-engineer',
    'Flutter engineer',
    'iOS and Android apps in Flutter, through store review, for a US team.',
    'You ship iOS and Android from one Flutter codebase, through store review, for a US team. A change is a screen, state, networking, and a build you have run on a device.',
    ['Flutter', 'Dart', 'The state approach the app uses', 'Networking', 'iOS and Android tooling', 'App Store Connect and Play Console'],
    ['Flutter and Dart in a shipped app', 'A release through the App Store and Play Store', 'State, networking, and the builds the team runs', '5 or more years as a software engineer'],
    'You use AI tools to draft a widget or a test, then you run it on a device before it ships.',
    '/technologies/flutter-developers/',
    'Hiring Flutter engineers'
  ),
];
