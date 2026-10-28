# Extraction Record: Technical Glossary

- Source URL: https://www.betterengineer.com/technical-glossary
- Legacy path: `/technical-glossary`
- Proposed new path: `/technical-glossary/` (keep; it is already seeded in `data/live-url-inventory.js` as `{ url: '/technical-glossary', status: 'pending', phase: 2 }`, it is the target of the live footer's "Technical Glossary" resource link, and it is a keyword-clean slug. No rename recommended.)
- Extracted: 2026-08-07
- Extraction method: WebFetch (live HubSpot page), 8 passes
- Status: EXTRACTED

## 1. Source metadata

| Field | Value |
| --- | --- |
| title tag | `Tech Glossary \| Essential Terms for Software Industry Success \| BetterEngineer` |
| meta description | `Discover the BetterEngineer Tech Glossary, a curated list of essential terms in software engineering and AI built to help you scale your engineering org with confidence.` |
| canonical | `https://www.betterengineer.com/technical-glossary` |
| robots | None specified (no robots meta tag found) |
| H1 | `Technical Glossary` |
| og:title | `Tech Glossary \| Essential Terms for Software Industry Success \| BetterEngineer` |
| og:description | `Discover the BetterEngineer Tech Glossary, a curated list of essential terms in software engineering and AI built to help you scale your engineering org with confidence.` |
| og:image | Not found in extraction (see Migration Notes) |
| og:type | Not found in extraction (see Migration Notes) |
| og:url | `https://www.betterengineer.com/technical-glossary` |
| twitter:card | `summary` |
| twitter:title | `Tech Glossary \| Essential Terms for Software Industry Success \| BetterEngineer` |
| twitter:description | `Discover the BetterEngineer Tech Glossary, a curated list of essential terms in software engineering and AI built to help you scale your engineering org with confidence.` |
| viewport | `width=device-width, initial-scale=1` |
| existing JSON-LD types | None found |
| Analytics | Google Tag Manager container `GTM-WT77L8JF` |

### Existing structured data

None found.

No JSON-LD was present on the page. Notably there is **no `DefinedTermSet` / `DefinedTerm` schema** despite 71 defined terms (see Migration Notes). This is the single largest structured-data gap in the Phase 2 set.

### Heading outline

Every heading in document order, verbatim. The page is metadata-thin at the heading level: one H1, then one H2 per glossary term, then one closing H2. **There are no letter-group headings (no "A", "B", "C" section headings).**

| Level | Verbatim heading text |
| --- | --- |
| H1 | Technical Glossary |
| H2 | AI Cloud Services |
| H2 | AI Code Assistant |
| H2 | AI Engineer |
| H2 | AI‑Enhanced Development Workflow |
| H2 | Analytics (Engineering & Product Analytics) |
| H2 | Angular |
| H2 | API (Application Programming Interface) |
| H2 | Application Frameworks |
| H2 | Artificial Intelligence (AI) |
| H2 | AWS (Amazon Web Services) |
| H2 | Cloud Computing Platforms |
| H2 | Cloud‑Native |
| H2 | CMS (Content Management System) |
| H2 | Collaboration Tools |
| H2 | Cypress |
| H2 | Data Engineer |
| H2 | Data Processing & Management |
| H2 | Data Science Engineer |
| H2 | Database Technologies |
| H2 | Dedicated Team / Dedicated Team Model |
| H2 | DevOps Engineer |
| H2 | Distributed Engineering Team |
| H2 | Docker |
| H2 | Engineering Manager |
| H2 | Engineering Pod / Product Development Team |
| H2 | Engineering Talent Marketplace |
| H2 | Extended Development Team |
| H2 | Frontend Engineer |
| H2 | Full‑Stack Engineer |
| H2 | Generative AI |
| H2 | GitLab CI |
| H2 | Google Cloud Platform (GCP) |
| H2 | GraphQL |
| H2 | Hadoop |
| H2 | HTML |
| H2 | Infrastructure as Code (IaC) |
| H2 | Java |
| H2 | JavaScript |
| H2 | Jenkins |
| H2 | Jupyter Notebooks |
| H2 | Kanban |
| H2 | Kotlin |
| H2 | Kubernetes |
| H2 | Large Language Model (LLM) |
| H2 | Linux |
| H2 | Machine Learning Engineer |
| H2 | MLOps Engineer |
| H2 | Mobile Engineer |
| H2 | MVP (Minimum Viable Product) |
| H2 | Nearshore Development Team |
| H2 | NLP Tools (Natural Language Processing Tools) |
| H2 | Node.js (Node) |
| H2 | Product Engineer |
| H2 | Prompt Engineering |
| H2 | Python |
| H2 | QA Engineer (Quality Assurance Engineer) |
| H2 | React |
| H2 | SaaS (Software as a Service) |
| H2 | Selenium WebDriver |
| H2 | Site Reliability Engineer (SRE) |
| H2 | Software Architect |
| H2 | SQL |
| H2 | Staff Augmentation |
| H2 | Talent Pipeline |
| H2 | Technical Lead (Tech Lead) |
| H2 | TensorFlow |
| H2 | TypeScript |
| H2 | Vector Database |
| H2 | Version Control |
| H2 | Vanilla JavaScript |
| H2 | WebDriver (Selenium WebDriver) |
| H2 | Want to build something great together? |

**Total glossary term H2s: 71.** Plus one H1 and one closing CTA H2 = 73 headings total.

Several term headings use a non-breaking hyphen (U+2011) rather than a plain hyphen: `AI‑Enhanced Development Workflow`, `Cloud‑Native`, `Full‑Stack Engineer`. Preserved verbatim above; flagged in Migration Notes.

## 2. Content (VERBATIM)

### Section 0 — Global header navigation (site chrome, not page content)

Identical to every other migrated page. Reproduced for completeness.

- nav item: `Services`
  - nav sub-item: `Staff Augmentation`
  - nav sub-item: `AI Readiness`
  - nav sub-item: `Platform`
  - nav sub-item: `Browse Roles`
  - nav sub-item: `Browse by Technologies`
- nav item: `AI Fluency`
- nav item: `About`
  - nav sub-item: `Who We Are`
  - nav sub-item: `Why Nearshore`
- nav item: `Resources`
  - nav sub-item: `Blog`
  - nav sub-item: `FAQs`
  - nav sub-item: `Podcast`
- nav item: `Join Us`
- nav CTA: `Hire Engineers`
- nav item: `Login`

### Section 1 — Hero / intro

- h1: `Technical Glossary`
- body: `The BetterEngineer Glossary is your go‑to resource for the concepts, roles, and delivery models that power modern software teams. Whether you're scaling an engineering org, exploring staff augmentation in Latin America, or evaluating AI capabilities, use this glossary to get clear, practical definitions without the noise.`
- CTA label: `Hire Better Engineers`

No eyebrow/kicker precedes the H1. Note the intro uses "The BetterEngineer Glossary" while the H1 says "Technical Glossary" and the title tag says "Tech Glossary" — three names for the same page (flagged in Migration Notes).

**There is no alphabetical jump navigation (no A B C ... Z index), no in-page index, no search box, and no filter control.** The terms run as one continuous alphabetical list.

### Section 2 — Glossary terms (71 entries, alphabetical, no letter groupings)

Each entry is an H2 term heading followed by one definition paragraph. Mobile Engineer is the only entry containing a bulleted sub-list. **No term heading and no definition body contains a hyperlink** — the glossary is entirely unlinked.

---

**Term 1**
- term: `AI Cloud Services`
- definition: `AI Cloud Services are cloud‑hosted platforms and APIs that provide pre‑built AI capabilities and infrastructure. Examples include managed services for natural language processing, speech recognition, image classification, translation, and custom model training. Instead of building and maintaining their own ML infrastructure from scratch, engineering teams can leverage AI cloud services to accelerate development, experiment with new ideas, and scale AI features as demand grows. These services lower the barrier to entry for AI, especially for product teams that want to focus on user experience and business logic.`

**Term 2**
- term: `AI Code Assistant`
- definition: `An AI code assistant is a tool that integrates into a developer's workflow—often directly into the IDE—to suggest code completions, generate snippets, or explain existing code. Powered by LLMs or other AI models, these assistants can accelerate common tasks, help engineers navigate unfamiliar codebases, and reduce context‑switching. They are particularly useful for repetitive patterns, boilerplate, and discovering idiomatic usage of frameworks. Effective use of AI code assistants involves setting clear expectations: they are helpers, not authorities, and their suggestions must be reviewed and tested like any other code.`

**Term 3**
- term: `AI Engineer`
- definition: `An AI Engineer focuses on designing, implementing, and integrating artificial intelligence capabilities into products and internal systems. While Data Science Engineers often concentrate on exploratory analysis and experimentation, AI Engineers are more oriented toward building production‑ready systems that apply machine learning and related techniques at scale. Their work may include selecting appropriate models and frameworks (e.g., TensorFlow, PyTorch), implementing APIs for model inference, optimizing performance and latency, and ensuring that AI features are robust and observable in production.`

**Term 4**
- term: `AI‑Enhanced Development Workflow`
- definition: `An AI‑enhanced development workflow is a software engineering process that incorporates AI tools across the development lifecycle. This may include AI assistance for requirements clarification, code generation, test case creation, bug triage, documentation, and incident analysis. Rather than relying on AI at a single touchpoint, an AI‑enhanced workflow intentionally weaves AI into multiple stages, aiming to improve speed, quality, and consistency. Teams adopting this approach must pay attention to governance, data privacy, and clear guidelines so that AI becomes a reliable partner instead of an uncontrolled variable.`

**Term 5**
- term: `Analytics (Engineering & Product Analytics)`
- definition: `In the context of software engineering and product development, analytics refers to the systematic collection and analysis of data about user behavior, system performance, and team activity. Product analytics tools track how users navigate an application, which features they adopt, and where they drop off, enabling teams to make evidence‑based decisions about what to build next. Engineering analytics focus on metrics like deployment frequency, lead time for changes, incident rates, and team throughput. Together, these analytics help organizations understand whether they are delivering value effectively and identify bottlenecks—insights that are especially important when coordinating multiple teams across regions.`

**Term 6**
- term: `Angular`
- definition: `Angular is a comprehensive frontend framework maintained by Google for building large‑scale web applications. Unlike React, which focuses primarily on the view layer, Angular provides a full framework that includes routing, dependency injection, form handling, and more out of the box. It uses TypeScript as its primary language and encourages a structured architecture suitable for larger, enterprise-grade projects. Teams that choose Angular often do so for its batteries‑included nature and strong conventions, which can be attractive in organizations that value standardization. For nearshore teams, Angular can provide a clear framework within which engineers can contribute consistently across multiple applications or modules.`

**Term 7**
- term: `API (Application Programming Interface)`
- definition: `An API (Application Programming Interface) defines how different software components or systems communicate with each other. APIs specify the methods, data formats, and rules for requesting and exchanging information, allowing independent systems to integrate without tightly coupling their internal implementations. In modern web applications, APIs are used for everything from mobile apps talking to backends to backends integrating with payment providers, CRMs, or AI services. Well‑designed APIs are versioned, documented, secure, and consistent, enabling engineering teams across onshore and nearshore locations to build features on top of stable contracts.`

**Term 8**
- term: `Application Frameworks`
- definition: `Application frameworks are structured platforms and libraries that provide a foundation for building software applications. They encapsulate common patterns and capabilities, such as routing, state management, templating, authentication, and database access, so that engineers don't have to reinvent from scratch. Examples include frontend frameworks like React and Angular, backend frameworks like Django, Ruby on Rails, and Spring Boot, and full‑stack frameworks like Next.js. Using a well‑established framework can significantly reduce development time, improve maintainability, and enforce architectural consistency across teams, including nearshore collaborators.`

**Term 9**
- term: `Artificial Intelligence (AI)`
- definition: `Artificial Intelligence (AI) is a broad field focused on building systems that can perform tasks requiring human‑like intelligence, such as perception, reasoning, learning, and language understanding. In software engineering, AI appears in many forms: from recommendation engines and anomaly detection embedded in products to AI‑driven tools that help developers write, test, and review code. Rather than replacing engineers, AI increasingly augments them, automating repetitive tasks and surfacing insights that would be difficult or time‑consuming for humans to produce manually.`

**Term 10**
- term: `AWS (Amazon Web Services)`
- definition: `Amazon Web Services (AWS) is a leading cloud computing platform that provides a broad range of managed services, including compute (EC2, Lambda), storage (S3), databases (RDS, DynamoDB), networking, analytics, and AI offerings. Engineering teams use AWS to build scalable, resilient applications without managing physical hardware. AWS's global infrastructure and rich service catalog allow organizations to design architectures that meet stringent requirements for availability, latency, and compliance. For companies working with nearshore engineering teams, standardizing on AWS as a common platform simplifies environment setup, deployments, and access control across geographies.`

> **No terms beginning with the letter B.** Confirmed explicitly by a dedicated extraction pass and by the full heading enumeration. The list jumps from `AWS (Amazon Web Services)` straight to `Cloud Computing Platforms`. Flagged in Migration Notes.

**Term 11**
- term: `Cloud Computing Platforms`
- definition: `Cloud computing platforms, such as Amazon Web Services (AWS), Google Cloud Platform (GCP), and Microsoft Azure, provide on‑demand access to computing resources over the internet. Instead of managing physical servers, companies can provision virtual machines, containers, managed databases, object storage, and specialized AI services in minutes. These platforms operate on a pay‑as‑you‑go model and support different service layers, including Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS). For modern engineering teams, cloud platforms are the default foundation for building scalable, resilient, and globally accessible applications.`

**Term 12**
- term: `Cloud‑Native`
- definition: `Cloud‑native applications are designed from the ground up to leverage cloud infrastructure and managed services. Rather than treating the cloud as a remote data center, cloud‑native systems embrace practices like containerization, microservices, managed databases, serverless functions, and autoscaling. This approach allows teams to focus more on business logic and less on undifferentiated infrastructure work. For companies scaling with nearshore teams, a cloud‑native foundation provides a consistent environment for all engineers, regardless of where they are located.`

**Term 13**
- term: `CMS (Content Management System)`
- definition: `A Content Management System (CMS) is a platform that allows non‑technical users to create, edit, and publish website or app content without writing code. Engineers often set up and customize CMSs, integrate them with frontends (including headless architectures), and ensure that content changes propagate reliably and securely. For product companies with marketing sites, documentation portals, or in‑app content, a well‑implemented CMS balances flexibility for content teams with maintainability and performance for engineering.`

**Term 14**
- term: `Collaboration Tools`
- definition: `Collaboration tools are the software platforms that enable distributed teams to communicate and coordinate their work. For engineering organizations, this often includes Slack or Microsoft Teams for messaging, Zoom or Google Meet for video calls, Jira or Linear for issue tracking, Notion or Confluence for documentation, and GitHub or GitLab for code collaboration. The right combination of tools and shared norms for how to use them creates a digital workspace where onshore and nearshore engineers can work together as if they were in the same room.`

**Term 15**
- term: `Cypress`
- definition: `Cypress is a modern JavaScript‑based testing framework focused on end‑to‑end testing of web applications. Unlike traditional tools that run outside the browser, Cypress runs inside the browser where the application runs, offering faster feedback, better debugging tools, and a more developer‑friendly experience. It provides features like time travel debugging, automatic waiting, and an interactive GUI for watching tests run in real time. Frontend and full‑stack engineers often prefer Cypress for its tight integration with modern JavaScript stacks and its ease of setup in CI pipelines. For nearshore teams building or maintaining React, Angular, or other modern frontends, Cypress can be a key part of the testing strategy.`

**Term 16**
- term: `Data Engineer`
- definition: `A data engineer builds and maintains the data infrastructure that powers analytics, reporting, and AI initiatives. They design data pipelines to ingest, transform, and store data from various sources into warehouses, data lakes, or real‑time streaming systems. Typical technologies include ETL/ELT frameworks, SQL and NoSQL databases, and tools like Airflow, dbt, Kafka, or cloud‑native data services. Data engineers care deeply about data quality, schema design, performance, and cost, ensuring that downstream stakeholders (such as data scientists, analysts, and product teams) can trust and effectively use the data. In companies that rely on metrics and experimentation, data engineers are essential partners in turning raw logs and events into reliable insights.`

**Term 17**
- term: `Data Processing & Management`
- definition: `Data processing and management refer to the end‑to‑end handling of data as it flows through an organization. This includes collecting raw data from various sources (applications, logs, third‑party services), cleaning and transforming it, and storing it in structures suitable for analytics, reporting, or AI workloads. Good data management ensures data quality, consistency, security, and compliance with regulations. For engineering organizations, robust data processing pipelines are essential for powering dashboards, experimentation frameworks, and machine learning models that inform strategic decisions.`

**Term 18**
- term: `Data Science Engineer`
- definition: `A Data Science Engineer (often called a Data Scientist or Data Science Engineer, depending on the organization) sits at the intersection of statistics, programming, and business problem‑solving. Their core responsibility is to extract insight and value from data: they explore datasets, build models, and help translate raw information into actionable recommendations. On a day‑to‑day basis, they may clean and transform data, design experiments, apply statistical methods, and prototype predictive models in tools like Python and Jupyter Notebooks. In a product organization, Data Science Engineers partner with product managers, analysts, and engineers to answer questions such as: Which user segments are most engaged? Which features drive retention? Where is churn highest and why? They also support decision‑making around pricing, A/B tests, and growth experiments. When embedded in a nearshore or distributed team, a Data Science Engineer benefits from close collaboration with backend and data engineers who maintain the underlying data pipelines and infrastructure.`

**Term 19**
- term: `Database Technologies`
- definition: `Database technologies encompass the systems engineers use to store, query, and manage application data. Relational databases like PostgreSQL, MySQL, and SQL Server organize data into tables with strict schemas and support powerful queries with SQL. NoSQL databases, such as MongoDB, Cassandra, and DynamoDB, offer more flexible schema models, horizontal scalability, or specialized data handling for documents, key‑value pairs, wide‑column data, or graphs. Time‑series databases and analytical warehouses support specific workloads like monitoring or large‑scale analytics. Choosing the right database technology is a core architectural decision that impacts performance, scalability, and developer productivity.`

**Term 20**
- term: `Dedicated Team / Dedicated Team Model`
- definition: `A dedicated team (or dedicated team model) is an engagement model in which a partner assembles a group of engineers that work exclusively for a single client over an extended period of time. The client effectively "rents" a full team, often including developers, QA, and sometimes a tech lead or delivery manager, that operates as a stable, long‑term extension of the internal organization. The dedicated team is aligned with the client's product roadmap, shares the same goals and KPIs, and participates regularly in planning and review ceremonies. This approach is well‑suited for ongoing product development, where continuity, domain knowledge, and team cohesion matter more than one‑off deliveries.`

**Term 21**
- term: `DevOps Engineer`
- definition: `A DevOps engineer sits at the intersection of software development and operations. Their core mandate is to automate and streamline the processes that take code from a developer's laptop into production safely and repeatedly. This typically includes setting up and maintaining continuous integration and continuous delivery (CI/CD) pipelines, managing infrastructure (often in the cloud), configuring observability tools (logs, metrics, traces), and building internal tooling that makes deployments and rollbacks predictable. DevOps engineers champion practices like infrastructure as code, automated testing, and monitoring so that teams can ship more frequently without sacrificing stability.`

**Term 22**
- term: `Distributed Engineering Team`
- definition: `A distributed engineering team is one in which team members are spread across different cities, countries, or continents, often working remotely from wherever they live. There may be no single central office or headquarters; instead, the team's collaboration happens through digital tools and well‑defined processes. Distributed teams can tap into global talent and provide flexibility and autonomy to engineers, but they must be intentional about communication, documentation, and decision‑making to avoid silos and misalignment.`

**Term 23**
- term: `Docker`
- definition: `Docker is a platform for building, packaging, and running applications in lightweight, portable containers. A Docker container bundles an application with its dependencies (libraries, runtime, configuration), ensuring that it runs consistently across different environments, from a developer's laptop to staging and production. Containers help solve the classic "it works on my machine" problem and are foundational to modern DevOps and cloud‑native architectures. Teams that adopt Docker can standardize how services are built and deployed, which is especially valuable in distributed setups where engineers across time zones must share a predictable environment.`

**Term 24**
- term: `Engineering Manager`
- definition: `An engineering manager is responsible for the people, processes, and outcomes of an engineering team. Their role combines leadership, coaching, and organizational design: they support engineers' growth, manage performance, and create an environment where the team can deliver reliably. Engineering managers spend their time on hiring, feedback, career development, and process improvements, while partnering with product managers to align work with business goals. They may still have technical context and occasionally contribute to design discussions, but their primary responsibility is to enable the team, resolve blockers, and ensure that collaboration across locations remains smooth and effective.`

**Term 25**
- term: `Engineering Pod / Product Development Team`
- definition: `An engineering pod (sometimes called a cross‑functional squad or product development team) is a small, focused group of people, typically including engineers, a product manager, and sometimes a designer, who own a specific part of the product or customer journey. Pods are designed to be autonomous and outcome‑oriented: they have a clear mission, manage their own backlog, and are empowered to ship features end‑to‑end. This structure works particularly well when combining in‑house and nearshore engineers because it creates stable, long‑lived units that build domain knowledge and accountability over time.`

**Term 26**
- term: `Engineering Talent Marketplace`
- definition: `An engineering talent marketplace is a platform that connects companies with software engineers who are available for contract, staff augmentation, or full‑time roles. These marketplaces often vet candidates for technical skills, language proficiency, and soft skills, and then match them with clients based on project requirements, tech stacks, and cultural fit. For companies that need to scale engineering quickly, a talent marketplace focused on nearshore or regional talent can dramatically shorten time‑to‑hire and improve the quality of matches.`

**Term 27**
- term: `Extended Development Team`
- definition: `The extended team model describes a hybrid setup in which external engineers are integrated directly into the client's existing squads, workflows, and communication channels. Rather than operating as a separate unit, these engineers join daily stand‑ups, use the same repositories and tools, and follow the same coding standards as the in‑house team. The goal is to make the location invisible: nearshore engineers feel like colleagues rather than vendors. This model works best when there is clear technical leadership on the client side and a willingness to include external engineers fully in planning, decision‑making, and knowledge sharing.`

**Term 28**
- term: `Frontend Engineer`
- definition: `A frontend engineer builds the user‑facing parts of web and mobile applications, the layouts, interactions, and experiences that end users interact with directly. They work primarily with technologies like HTML, CSS, and JavaScript, along with frameworks such as React, Angular, or Vue. Their work involves translating design concepts into responsive, accessible interfaces that perform well across devices and browsers. Frontend engineers balance aesthetics with usability and performance, making choices that affect how intuitive an application feels and how quickly it responds to user input. They work closely with designers, product managers, and backend engineers to ensure the interface accurately reflects business requirements while delivering a seamless user experience.`

**Term 29**
- term: `Full‑Stack Engineer`
- definition: `A full‑stack engineer is comfortable working across both the frontend and backend layers of an application. Rather than specializing in a single tier, they understand how data flows from the database all the way to the browser, and can contribute to system design, API development, and user interface implementation. Full‑stack engineers are particularly valuable in smaller or fast‑moving teams where flexibility and ownership matter: they can take a feature from concept to production, connecting the dots between product requirements, technical constraints, and user experience. While they may still have deeper expertise in one area (frontend or backend), their breadth allows them to collaborate effectively across disciplines and reduce handoff friction.`

**Term 30**
- term: `Generative AI`
- definition: `Generative AI refers to AI systems that can create new content, such as text, images, audio, video, or code, based on patterns learned from training data. In the context of engineering, generative AI tools help developers draft code, refactor existing codebases, generate test cases, write documentation, and even propose architectural patterns. These tools can significantly speed up development and reduce boilerplate work, but they work best when paired with human judgment: engineers must review, adapt, and validate generated content to ensure it meets quality, security, and performance standards.`

**Term 31**
- term: `GitLab CI`
- definition: GitLab CI is the continuous integration and delivery system built into GitLab, a popular platform for hosting Git repositories and managing DevOps workflows. Using a `.gitlab-ci.yml` file, teams define pipelines that run on each push or merge request, building artifacts, running tests, scanning for security issues, and deploying to environments. GitLab CI's integration with source control, code review, and issue tracking creates a unified, end‑to‑end flow for software delivery. For organizations using nearshore teams, GitLab CI provides a single, shared automation layer where every contribution, regardless of origin, is validated and deployed using the same rules.

Note: this is the only definition whose backticks are meaningful — `.gitlab-ci.yml` renders as inline code/monospace on the legacy page, so this entry is shown without the surrounding verbatim backticks used elsewhere in Section 2. The literal copy is: `Using a .gitlab-ci.yml file, teams define pipelines that run on each push or merge request...`

**Term 32**
- term: `Google Cloud Platform (GCP)`
- definition: `Google Cloud Platform (GCP) is Google's cloud offering, known for its strengths in data analytics, machine learning, and Kubernetes‑based workloads. Services like BigQuery, Cloud Storage, and Vertex AI are frequently used in data‑intensive applications. GCP's origins inside Google's own infrastructure practices appeal to teams that prioritize containers, microservices, and AI/ML capabilities. For organizations running data‑heavy or AI‑driven products, GCP can offer a compelling combination of performance and specialized tooling. Nearshore teams familiar with GCP can quickly integrate into such environments and leverage Google's managed services to accelerate delivery.`

**Term 33**
- term: `GraphQL`
- definition: `GraphQL is a query language and runtime for APIs that allows clients to request exactly the data they need in a single request. Instead of multiple REST endpoints, GraphQL exposes a type system and a single endpoint through which clients specify their data requirements. This can reduce over‑fetching and under‑fetching, improve performance on slow networks, and give frontend teams more flexibility. GraphQL is increasingly popular in modern product engineering, especially in applications with complex, nested data requirements.`

**Term 34**
- term: `Hadoop`
- definition: `Hadoop is an open‑source framework for distributed storage and processing of large datasets across clusters of commodity hardware. Its core components, such as HDFS (Hadoop Distributed File System) and MapReduce, were early enablers of big data processing in batch mode. While newer systems and cloud‑native data platforms have evolved beyond classic Hadoop, the ecosystem (including tools like Hive, Pig, and related technologies) has had a lasting influence on modern data architectures. Organizations with legacy or large‑scale on‑premise data systems may still rely on Hadoop for high‑volume data processing. Engineers and data specialists working in such environments need to understand both Hadoop and newer paradigms to design migrations and hybrid solutions.`

**Term 35**
- term: `HTML`
- definition: `HTML (HyperText Markup Language) is the standard markup language used to structure content on the web. Frontend engineers use HTML to define elements such as headings, paragraphs, links, images, and forms, which browsers then render into pages. While HTML itself is not a programming language, it is a foundational technology for web development, working in tandem with CSS for styling and JavaScript for interactivity. A strong understanding of semantic HTML is important for accessibility, SEO, and maintainable frontend code.`

**Term 36**
- term: `Infrastructure as Code (IaC)`
- definition: `Infrastructure as Code (IaC) is the practice of managing and provisioning infrastructure, such as servers, networks, and databases, using machine‑readable configuration files instead of manual processes. Tools like Terraform, CloudFormation, or Pulumi allow teams to define their infrastructure in code, version it, review it, and apply it via automated pipelines. IaC improves reproducibility, reduces configuration drift, and enables rapid environment creation and teardown. For distributed teams, IaC is crucial because it encodes infrastructure decisions in a shared, auditable format rather than in someone's memory or on an undocumented server.`

**Term 37**
- term: `Java`
- definition: `Java is a mature, object‑oriented programming language widely used in enterprise systems, Android development, and large‑scale backend services. Its strong typing, extensive ecosystem, and long‑term backward compatibility make it a safe choice for systems that must be reliable and maintainable for many years. Java powers many financial systems, telco platforms, and high‑throughput web services. Engineering teams that adopt Java often value performance, stability, and a deep pool of experienced developers worldwide, including in nearshore regions. The Java Virtual Machine (JVM) also supports other languages like Kotlin and Scala, giving teams flexibility while leveraging the same underlying platform.`

**Term 38**
- term: `JavaScript`
- definition: `JavaScript is a versatile, high‑level programming language that started as a way to add interactivity to web pages and has since expanded to power full‑stack development. In the browser, JavaScript runs client‑side code; on the server, runtimes like Node.js allow engineers to build backend services in the same language. JavaScript is dynamic, prototype‑based, and event‑driven, making it well‑suited to asynchronous, interactive applications. Because JavaScript is virtually universal in frontend development and increasingly common on the backend, it's a key skill for many modern engineering teams and a central anchor for hiring across regions, including nearshore talent.`

**Term 39**
- term: `Jenkins`
- definition: `Jenkins is an open‑source automation server that has long been a cornerstone of CI/CD practices. It allows teams to define jobs and pipelines that automatically build, test, and deploy code whenever changes are pushed to a repository. Jenkins' plugin ecosystem supports integration with many tools, version control systems, testing frameworks, cloud providers, making it highly extensible. While newer CI systems have emerged, Jenkins remains widely used, especially in organizations with complex, lengthy histories of internal tooling. Distributed teams using Jenkins can standardize on pipeline definitions so that builds and deployments behave identically regardless of where engineers are located.`

**Term 40**
- term: `Jupyter Notebooks`
- definition: `Jupyter Notebooks are interactive, document‑like environments that allow engineers and data scientists to mix executable code, visualizations, and narrative text in a single place. They are widely used for data exploration, model prototyping, experiment tracking, and reporting. A typical notebook might load data, clean it, run analyses, visualize results, and document observations in Markdown, making the analysis both reproducible and understandable. While notebooks are excellent for exploratory work and communication, productionizing models and pipelines generally requires refactoring code into modules or services. In teams that blend product engineering and data science—across onshore and nearshore contributors—Jupyter Notebooks often serve as the bridge between exploration and engineering implementation.`

**Term 41**
- term: `Kanban`
- definition: `Kanban is a visual workflow management method that focuses on continuously improving flow rather than working in fixed‑length sprints. Teams using Kanban visualize their work on a board with columns such as "To Do," "In Progress," and "Done," and may set work‑in‑progress (WIP) limits to reduce bottlenecks and multitasking. Progress is managed by pulling tasks into the next stage only when there is capacity. Kanban is particularly useful for teams handling a steady stream of incoming requests or operational work, and it integrates well with remote and nearshore setups because the board provides a shared, always‑up‑to‑date view of the team's workload.`

**Term 42**
- term: `Kotlin`
- definition: `Kotlin is a modern, statically typed language that runs on the Java Virtual Machine (JVM) and is fully interoperable with Java. It is officially supported for Android development and increasingly used for backend services as well. Kotlin improves on Java's ergonomics with features like null‑safety, extension functions, data classes, and coroutines for asynchronous programming. For teams with existing Java ecosystems, Kotlin offers a way to modernize codebases incrementally and improve developer productivity without discarding existing investments. In nearshore contexts, Kotlin‑skilled engineers can contribute to both Android clients and backend systems.`

**Term 43**
- term: `Kubernetes`
- definition: `Kubernetes is an open‑source container orchestration platform that automates the deployment, scaling, and management of containerized applications. Rather than manually starting and stopping containers, teams define their desired state (replicas, resource limits, networking, storage), and Kubernetes continuously works to maintain that state, automatically restarting containers, balancing load, and rolling out updates. Kubernetes has become the de facto standard for running microservices at scale, particularly in cloud environments. For organizations using nearshore teams, Kubernetes provides a consistent infrastructure abstraction across regions, making it easier for distributed engineers to deploy and operate services reliably.`

**Term 44**
- term: `Large Language Model (LLM)`
- definition: `A Large Language Model (LLM) is a type of machine learning model trained on large amounts of text data to understand and generate human‑like language. Examples include models that can answer questions, summarize documents, translate languages, generate code, or act as conversational agents. In software engineering, LLMs underpin AI code assistants, documentation copilots, and support bots that help developers and users navigate complex systems. LLMs are powerful but must be used thoughtfully, with attention to accuracy, security, and responsible use of data.`

**Term 45**
- term: `Linux`
- definition: `Linux is a family of open‑source operating systems that power a large percentage of servers, cloud instances, containers, and development environments worldwide. Most backend services, databases, and infrastructure components that engineers work with run on some flavor of Linux. Familiarity with Linux—command‑line tools, file permissions, networking, process management—is essential for many engineering roles, particularly backend, DevOps, and SRE. In nearshore environments, Linux literacy is often a baseline expectation for engineers who operate or debug production systems.`

**Term 46**
- term: `Machine Learning Engineer`
- definition: `A machine learning engineer is responsible for taking machine learning models from experimentation into robust, scalable production systems. They work at the intersection of data science and software engineering, partnering with data scientists to translate models into performant code, integrate them into applications, and monitor their behavior in the real world. Their work includes feature engineering, model deployment, building APIs for inference, and setting up monitoring to detect model drift and performance issues. Machine learning engineers often use specialized frameworks (like TensorFlow or PyTorch), as well as MLOps tools for experiment tracking, model registry, and automated retraining. In an AI‑enabled engineering organization, they play a key role in transforming prototypes into products.`

**Term 47**
- term: `MLOps Engineer`
- definition: `An MLOps engineer focuses on the operational side of machine learning systems, similar to how DevOps engineers focus on application systems. They design and implement the workflows that move models from development to production and keep them healthy over time. This includes managing feature stores, orchestrating training and deployment pipelines, setting up CI/CD for models, and tracking model versions and lineage. MLOps engineers build the infrastructure and automation that allows multiple teams to experiment, deploy, and iterate on models safely and efficiently. As companies introduce more AI into their products, MLOps becomes critical for ensuring that models remain accurate, explainable, and compliant with internal and external requirements.`

**Term 48**
- term: `Mobile Engineer`
- definition (lead-in): `A Mobile Engineer builds applications that run natively on mobile devices, such as smartphones and tablets. They typically specialize in one or more ecosystems:`
- list item: `iOS Engineers use Swift (and sometimes Objective‑C) to build apps for Apple devices, leveraging frameworks like UIKit or SwiftUI and integrating with the broader Apple ecosystem.`
- list item: `Android Engineers use Kotlin (and sometimes Java) to build apps for Android devices, working with Android SDKs, Jetpack libraries, and Google Play distribution.`
- list item: `Cross‑platform Mobile Engineers use frameworks like React Native to build apps that share large portions of code across iOS and Android while still delivering near‑native experiences.`
- definition (closing): `Mobile Engineers must consider constraints like device performance, network variability, app store guidelines, and user expectations for responsiveness and polish. In distributed or nearshore teams, mobile engineers often work closely with backend engineers to design APIs tailored to mobile needs and with designers to ensure interfaces feel intuitive on smaller screens.`

This is the **only** glossary entry containing a bulleted sub-list. Every other entry is a single prose paragraph.

**Term 49**
- term: `MVP (Minimum Viable Product)`
- definition: `A Minimum Viable Product (MVP) is the simplest version of a product that can be released to validate key assumptions and gather meaningful user feedback with minimal effort. Rather than building every feature on the roadmap, teams focus on a core set of functionalities that solve the primary user problem and allow them to measure real‑world behavior. The MVP concept encourages experimentation and learning, helping companies avoid over‑investing in ideas that don't resonate. Nearshore and distributed teams often play a central role in delivering MVPs quickly while maintaining enough technical quality to support iteration.`

**Term 50**
- term: `Nearshore Development Team`
- definition: `A nearshore development team is a group of engineers based in a nearby region who work closely with a client's in‑house team to build and maintain software products. Unlike traditional outsourcing arrangements that deliver work in a more transactional way, nearshore teams typically adopt the client's tools, workflows, and agile practices. They join the same stand‑ups, planning sessions, and retrospectives, effectively functioning as an extension of the existing engineering organization. This setup combines the advantages of geographic proximity, cultural alignment, and cost effectiveness with the flexibility to quickly scale or reconfigure capacity.`

**Term 51**
- term: `NLP Tools (Natural Language Processing Tools)`
- definition: `Natural Language Processing (NLP) tools are libraries and services that allow engineers to analyze, understand, and generate human language. They support tasks such as sentiment analysis, entity recognition, text classification, summarization, and machine translation. In modern products, NLP powers features like intelligent search, chatbots, support ticket triage, and content moderation. With the rise of LLMs, NLP tools are increasingly integrated into general‑purpose AI platforms that support a wide range of language‑based workflows.`

**Term 52**
- term: `Node.js (Node)`
- definition: `Node.js is a JavaScript runtime built on Chrome's V8 engine that allows engineers to run JavaScript outside the browser, most commonly on servers. With Node.js, teams can use a single language (JavaScript or TypeScript) for both frontend and backend development. Node's non‑blocking, event‑driven architecture makes it well‑suited for I/O‑heavy applications like APIs, real‑time chat, and streaming services. The Node ecosystem—centered around npm (Node Package Manager)—offers a vast library of open‑source modules, making it quick to assemble common backend capabilities. For organizations that want fast iteration and a unified tooling stack across web and API layers, Node.js is often a natural choice.`

> **No terms beginning with the letter O.** Confirmed by a dedicated extraction pass and by the full heading enumeration. The list jumps from `Node.js (Node)` to `Product Engineer`.

**Term 53**
- term: `Product Engineer`
- definition: `A product engineer is a software engineer who works very closely with product managers, designers, and users to deliver features that directly impact business outcomes. Instead of focusing solely on technical elegance, product engineers are deeply interested in user problems, product metrics, and feedback loops. They often participate in discovery, help refine requirements, and propose solutions that balance feasibility, impact, and time‑to‑market. Product engineers are comfortable moving quickly, experimenting, and iterating based on data, and they thrive in cross‑functional squads that own a specific part of the product surface area end‑to‑end.`

**Term 54**
- term: `Prompt Engineering`
- definition: `Prompt engineering is the practice of crafting and refining inputs to AI models, particularly LLMs, to elicit useful, reliable outputs. Because these models respond differently depending on how a request is phrased and structured, prompt engineering involves experimentation with instructions, examples, and context to achieve consistent results. For engineering teams using AI code assistants or chat‑based tools, good prompt engineering can significantly improve the quality of suggestions, reduce back‑and‑forth, and align outputs with the team's style and standards.`

**Term 55**
- term: `Python`
- definition: `Python is a high‑level, general‑purpose programming language known for its readability, concise syntax, and rich ecosystem. It is heavily used in data science, machine learning, automation, scripting, and backend web development (via frameworks like Django and Flask). Python's extensive standard library and third‑party packages make it a powerful tool for quickly building prototypes and production systems alike. In AI and data‑driven engineering organizations, Python is often the lingua franca for data scientists and ML engineers. For nearshore teams, strong Python skills can bridge data engineering, ML, and application development efforts.`

**Term 56**
- term: `QA Engineer (Quality Assurance Engineer)`
- definition: **CONTENT BUG — the definition rendered under this heading is a verbatim copy of the Python definition (Term 55).** Two independent extraction passes returned the same result: the text under `QA Engineer (Quality Assurance Engineer)` reads `Python is a high‑level, general‑purpose programming language known for its readability, concise syntax, and rich ecosystem. It is heavily used in data science, machine learning, automation, scripting, and backend web development (via frameworks like Django and Flask). Python's extensive standard library and third‑party packages make it a powerful tool for quickly building prototypes and production systems alike. In AI and data‑driven engineering organizations, Python is often the lingua franca for data scientists and ML engineers. For nearshore teams, strong Python skills can bridge data engineering, ML, and application development efforts.`
- **The real QA Engineer definition is missing from the live page.** Preserved as found per the verbatim rule. See Migration Notes — this needs a browser check and then new copy written before rebuild. **Do not ship the page with Python's text under the QA heading.**

**Term 57**
- term: `React`
- definition: `React is a popular JavaScript library for building user interfaces, originally developed by Meta (Facebook). It focuses on building UI components that manage their own state and compose together to form complex applications. React introduced concepts like the virtual DOM and declarative UI, which simplify reasoning about how the interface should look as data changes. For engineering teams, React has become a default choice for modern web frontends due to its strong ecosystem (hooks, context, React Router), broad community, and compatibility with tooling like TypeScript, Next.js, and modern build systems. In a nearshore or distributed environment, React's ubiquity makes it easier to find engineers who can be productive quickly and share reusable UI components across teams.`

**Term 58**
- term: `SaaS (Software as a Service)`
- definition: `Software as a Service (SaaS) is a software delivery model where applications are hosted in the cloud and accessed by customers over the internet, typically via subscription. Instead of installing and maintaining software on their own hardware, customers log into a web or mobile interface, while the provider manages infrastructure, updates, and security. SaaS products are often built using multi‑tenant architectures, continuous delivery, and usage‑based analytics. For engineering teams working on SaaS products, considerations like uptime, data privacy, and smooth onboarding are central to success.`

**Term 59**
- term: `Selenium WebDriver`
- definition: `Selenium WebDriver is a widely used open‑source tool for automating web browsers. It allows engineers and QA specialists to write scripts, typically in languages like Java, Python, or JavaScript, that control a browser and interact with web pages as a user would: clicking buttons, filling forms, navigating between pages, and asserting expected outcomes. Selenium is commonly used for end‑to‑end testing of web applications, ensuring that key user flows work correctly across browsers. In distributed teams, shared Selenium test suites become part of the CI pipeline, catching regressions automatically whenever new code is deployed.`

**Term 60**
- term: `Site Reliability Engineer (SRE)`
- definition: `A Site Reliability Engineer (SRE) applies software engineering principles to operations and reliability. Originating at Google, the SRE discipline focuses on building systems that meet explicit reliability targets (such as uptime and latency) while still allowing fast product development. SREs typically define service level indicators (SLIs) and service level objectives (SLOs), create error budgets, and build tooling that automates incident detection, mitigation, and root‑cause analysis. They often write code to improve system reliability, such as auto‑scaling mechanisms, self‑healing scripts, or load‑testing tools, rather than manually operating systems. SREs are especially valuable for complex, cloud‑native architectures where the cost of downtime is high and reliability must be engineered into the system from the start.`

**Term 61**
- term: `Software Architect`
- definition: `A software architect is a senior engineer responsible for defining the high‑level technical structure of a system. They make foundational decisions about architecture, technology stacks, integration patterns, and non‑functional requirements such as scalability, reliability, and security. Instead of focusing solely on day‑to‑day coding tasks, a software architect looks at the system as a whole: how different services interact, where data lives, how failures are handled, and how the system will evolve over time as requirements change. They often create architectural diagrams, technical standards, and guidelines to help engineering teams build consistently and avoid fragmented, hard‑to‑maintain solutions. In distributed or nearshore setups, architects also play a key role in aligning multiple teams across locations on a common technical vision.`

**Term 62**
- term: `SQL`
- definition: `SQL (Structured Query Language) is the standard language for managing and querying data in relational databases. Engineers and data professionals use SQL to define tables, insert and update records, and write queries that filter, aggregate, and join data across multiple tables. Despite its age, SQL remains one of the most critical skills in data‑driven organizations: it underpins reporting, analytics, and many application features that rely on structured data. For distributed teams, SQL forms a shared foundation between backend engineers, data engineers, analysts, and data scientists, enabling cross‑functional collaboration around the same datasets and schemas.`

**Term 63**
- term: `Staff Augmentation`
- definition: `Staff augmentation is a flexible hiring model in which a company extends its internal engineering team with external developers who work as integrated members of the team. Instead of outsourcing an entire project to a third party, the client retains control over the roadmap, priorities, and daily workflow, while the augmentation partner supplies vetted talent that plugs into existing processes and tools. This model allows organizations to scale capacity quickly, access specialized skills, and adjust team size as needs change, without committing to the overhead of permanent hires in every market.`

**Term 64**
- term: `Talent Pipeline`
- definition: `A talent pipeline is a curated pool of candidates who have already been vetted and are ready to be matched to open roles. A mature pipeline includes engineers with different skill sets, seniority levels, and language capabilities, allowing companies to move quickly when new needs arise. For partners specializing in nearshore staff augmentation, maintaining a strong pipeline in target regions backed by ongoing sourcing and evaluation is a core part of their value proposition.`

**Term 65**
- term: `Technical Lead (Tech Lead)`
- definition: `A technical lead (tech lead) is an experienced engineer who guides the technical execution of a team. They are hands‑on with the code but also responsible for reviewing designs, making trade‑off decisions, and ensuring that the team's work aligns with the broader architectural vision. Tech leads often mentor other engineers, facilitate technical discussions, and serve as the main technical point of contact for product managers and stakeholders. Their role is not purely managerial; instead, they blend deep technical expertise with leadership skills to keep projects moving in the right direction and ensure that delivered solutions are robust, maintainable, and scalable.`

**Term 66**
- term: `TensorFlow`
- definition: `TensorFlow is an open‑source machine learning framework originally developed by Google. It provides tools for building, training, and deploying machine learning and deep learning models, including neural networks for tasks like image recognition, text analysis, and time‑series forecasting. TensorFlow supports both high‑level APIs (such as Keras) for rapid development and lower‑level control for custom model architectures. Engineering and AI teams use TensorFlow to move from experimentation to production, leveraging its support for distributed training, hardware acceleration (GPUs/TPUs), and deployment targets that include servers, mobile devices, and edge hardware. Nearshore AI Engineers familiar with TensorFlow can seamlessly integrate with teams using this stack.`

**Term 67**
- term: `TypeScript`
- definition: `TypeScript is a typed superset of JavaScript that adds optional static types and compiles down to plain JavaScript. By introducing types (interfaces, enums, generics), TypeScript helps engineers catch many classes of errors at compile time rather than at runtime. It improves tooling support (autocompletion, refactoring, navigation), documentation, and long‑term maintainability of codebases, especially as teams and applications grow. Adopting TypeScript is particularly impactful in distributed or nearshore environments, where clear contracts and strong tooling reduce ambiguity between teams and make it easier for new engineers to onboard to existing projects.`

**Term 68**
- term: `Vector Database`
- definition: `A vector database is a specialized type of database optimized for storing and querying vector embeddings, high‑dimensional numeric representations of data such as text, images, or audio. In AI applications, embeddings allow models to measure similarity between items and power features like semantic search, recommendations, and retrieval‑augmented generation (RAG). Vector databases support operations like nearest‑neighbor search at scale, making them essential infrastructure for advanced AI features integrated into products.`

**Term 69**
- term: `Version Control`
- definition: `Version control systems, such as Git, track and manage changes to source code over time. They allow multiple developers to work on the same project concurrently, branch and experiment safely, and roll back to previous versions if necessary. Version control provides a detailed history of changes (who changed what, when, and why), which is invaluable for debugging, auditing, and collaboration. In modern teams, platforms like GitHub, GitLab, or Bitbucket combine version control with code review, CI/CD, and collaboration tools, forming the backbone of a distributed development workflow.`

**Term 70**
- term: `Vanilla JavaScript`
- definition: `Vanilla JavaScript refers to using JavaScript in its raw form, without additional frameworks or libraries. It's the core language that browsers and many runtime environments (like Node.js) understand. Even when engineers use frameworks like React or Angular, a solid understanding of vanilla JavaScript is critical: it underpins how the language works, how the event loop behaves, and how to debug core issues. For engineering leaders, investing in strong JavaScript fundamentals (rather than framework‑only knowledge) makes teams more resilient to tool churn and better able to evaluate new frontend technologies as they emerge.`

**Alphabetical-order defect:** `Vanilla JavaScript` appears AFTER `Vector Database` and `Version Control`. Confirmed by a dedicated verification pass. Correct alphabetical position is before `Vector Database`. Preserved verbatim in source order; flagged in Migration Notes.

**Term 71**
- term: `WebDriver (Selenium WebDriver)`
- definition: `Selenium WebDriver is a widely used open‑source tool for automating web browsers. It allows engineers and QA specialists to write scripts, typically in languages like Java, Python, or JavaScript, that control a browser and interact with web pages as a user would: clicking buttons, filling forms, navigating between pages, and asserting expected outcomes. Selenium is commonly used for end‑to‑end testing of web applications, ensuring that key user flows work correctly across browsers. In distributed teams, shared Selenium test suites become part of the CI pipeline, catching regressions automatically whenever new code is deployed.`

**Duplicate entry:** this is a word-for-word duplicate of Term 59 (`Selenium WebDriver`) under a different heading. Confirmed by a dedicated verification pass. Preserved verbatim; flagged in Migration Notes.

### Section 3 — Closing CTA band

- h2: `Want to build something great together?`
- body: `It's not just about filling jobs. It's about creating a better ecosystem for talent and innovation. At BetterEngineer, you'll find solutions for both your employees and your business.`
- CTA label: `Find Better Talent Today`

### Section 4 — Global footer (site chrome, not page content)

Identical to the footer captured on `/latamengineer`. Reproduced for completeness.

- body: `Lets build better teams together`
- CTA label: `Contact Us`
- CTA label: `Schedule a Call`
- column heading: `Follow Us`
- column heading: `Our Services`
  - list item: `Staff Augmentation`
  - list item: `AI Readiness Assessment`
  - list item: `Hiring Dashboard`
  - list item: `Browse Roles`
  - list item: `Browse by Technology`
- column heading: `About Us`
  - list item: `Who We Are`
  - list item: `Why Nearshore`
- column heading: `Industries`
  - list item: `FinTech`
  - list item: `MarTech`
  - list item: `HealthTech`
- column heading: `Careers`
  - list item: `See All Job Opportunities`
  - list item: `Join Us`
  - list item: `Sign Up`
- column heading: `In-Demand Jobs`
  - list item: `Full-Stack Engineer`
  - list item: `Front-end Engineer`
  - list item: `Python Engineer`
  - list item: `DevOps Engineer`
  - list item: `Java Engineer`
  - list item: `Data Science Engineer`
  - list item: `QA Automation Engineer`
  - list item: `Typescript Engineer`
- column heading: `Resources`
  - list item: `Blog`
  - list item: `FAQs`
  - list item: `Ebooks`
  - list item: `Podcast`
  - list item: `Technical Glossary`
- column heading: `Case Studies`
  - list item: `Live CGI`
  - list item: `Wasteplace`
- legal: `Copyright © 2026 BetterEngineer`
- legal link: `Privacy Policy`
- legal link: `Terms of Service`

## 3. Assets

Proposed local paths follow the existing repo convention (`/images/pages/<slug>/`), so this page slug is `technical-glossary`.

| Source URL | Proposed local filename | Alt text | Usage | Notes |
| --- | --- | --- | --- | --- |
| `https://www.googletagmanager.com/ns.html?id=GTM-WT77L8JF` | n/a | (none) | GTM noscript iframe | SKIP - do not download. Tracking pixel. Re-implement GTM via the site's standard analytics include. |
| `https://www.betterengineer.com/hubfs/raw_assets/public/betterengineer/images/Icons/hamburger-icon-white.svg` | n/a | `Menu` | Mobile nav toggle | SKIP - do not download. HubSpot chrome; the rebuilt site has its own header component. Note this page's hamburger DOES have alt text (`Menu`) whereas `/latamengineer` returned none for the same asset. |
| `https://www.betterengineer.com/hubfs/AI-readiness-strategy%20%E2%80%93%201.png` | `/images/pages/technical-glossary/ai-readiness-strategy-1.png` | `AI-readiness-strategy – 1` | Hero illustration | Filename and alt are an Illustrator export name containing an en dash. Asset is borrowed from the AI Readiness page family. Check whether the repo already ships it under `/images/pages/hire-ai-ready-engineers/` and reuse rather than duplicating. Rewrite alt on rebuild. |
| `https://www.betterengineer.com/hubfs/Website%202024%20Update/Home/betterengineer-team-group-photo-full.png` | `/images/pages/technical-glossary/team-group-photo-full.png` | `betterengineer-team-group-photo-full` | Closing CTA band, desktop | Asset is borrowed from the Home page directory (`/hubfs/Website 2024 Update/Home/`). Almost certainly already in the repo from the index page build. **Reuse, do not duplicate.** Alt text is a filename, not alt text. |
| `https://www.betterengineer.com/hubfs/Website%202024%20Update/Home/betterengineer-team-group-photo-full-mobile.png` | `/images/pages/technical-glossary/team-group-photo-full-mobile.png` | `betterengineer-team-group-photo-full-mobile` | Closing CTA band, mobile | SKIP if the rebuild uses responsive `srcset` / `<picture>`. Legacy page ships two separate `<img>` elements toggled by CSS. Same borrowing note as above. |

Total page-specific downloadable assets: **3** (one hero illustration, two group-photo variants), and **all three are borrowed from other page directories**, so the true net-new asset count for this page is likely **0**. Verify against `data/migration-assets.js` before adding any download entries.

**The glossary body carries no images at all.** 71 terms, zero icons, zero diagrams. The page is pure text between the hero and the closing CTA.

## 4. Links

| Anchor text | Href | Type | Migration note |
| --- | --- | --- | --- |
| BetterEngineer logo | `https://www.betterengineer.com` | internal-www | Header. Becomes `/`. |
| Staff Augmentation | `https://www.betterengineer.com/staff-augmentation` | internal-www | Header nav. Becomes `/staff-augmentation`. |
| AI Readiness | `https://www.betterengineer.com/ai-readiness` | internal-www | Header nav. Becomes `/ai-readiness`. |
| Platform | `https://www.betterengineer.com/hiring-dashboard` | internal-www | Header nav. Label and slug disagree. |
| Browse Roles | `https://discover.betterengineer.com/roles/` | internal-discover | Header nav. Keep absolute. |
| Browse by Technologies | `https://discover.betterengineer.com/technologies/` | internal-discover | Header nav. Keep absolute. |
| AI Fluency | `https://discover.betterengineer.com/ai-fluent-engineers/` | internal-discover | Header nav. Keep absolute. |
| Who We Are | `https://www.betterengineer.com/about` | internal-www | Header nav. |
| Why Nearshore | `https://www.betterengineer.com/latamengineer` | internal-www | Header nav. |
| Blog | `https://blog.betterengineer.com/resource-center` | external (blog subdomain) | Header nav. |
| FAQs | `https://www.betterengineer.com/faqs-nearshore-software-engineers-staff-augmentation-ai-talent` | internal-www | Header nav. Phase 2 page. |
| Podcast | `https://www.betterengineer.com/podcast` | internal-www | Header nav. Phase 2 page. |
| Join Us | `https://www.betterengineer.com/join` | internal-www | Header nav. |
| Hire Engineers | `https://www.betterengineer.com/multi-step-contact-form` | CTA (internal-www) | Header CTA. |
| Login | `https://app.betterengineer.com/sign-in?redirect_url=https%3A%2F%2Fapp.betterengineer.com%2F` | app | Header. Keep absolute with query string intact. |
| Hire Better Engineers | `https://www.betterengineer.com/multi-step-contact-form` | CTA (internal-www) | **Top-of-page body CTA.** Note this goes to `/multi-step-contact-form`, matching the header CTA. |
| Find Better Talent Today | `https://www.betterengineer.com/contact` | CTA (internal-www) | **Closing CTA band.** Goes to `/contact`, NOT `/multi-step-contact-form`. The page's two body CTAs point at two different forms; flagged in Migration Notes. |
| betterengineer | `https://www.betterengineer.com` | internal-www | Footer logo. |
| Contact Us | `https://www.betterengineer.com/contact` | CTA (internal-www) | Footer. |
| Schedule a Call | `https://calendly.com/tim-salsamobi/30min` | external | Footer. Personal handle on the legacy SalsaMobi brand. Already tracked as a site-wide follow-up. |
| (LinkedIn icon) | `https://www.linkedin.com/company/salsamobi` | external | Footer social. SalsaMobi company page. Already tracked. |
| (Facebook icon) | `https://www.facebook.com/BetterEngineerbySalsaMobi` | external | Footer social. |
| (Instagram icon) | `https://www.instagram.com/betterengineer_/` | external | Footer social. |
| Staff Augmentation | `https://www.betterengineer.com/staff-augmentation` | internal-www | Footer. |
| AI Readiness Assessment | `https://www.betterengineer.com/ai-readiness` | internal-www | Footer. Label differs from header. |
| Hiring Dashboard | `https://www.betterengineer.com/hiring-dashboard` | internal-www | Footer. Label differs from header ("Platform"). |
| Browse Roles | `https://discover.betterengineer.com/roles/` | internal-discover | Footer. |
| Browse by Technology | `https://discover.betterengineer.com/technologies/` | internal-discover | Footer. Singular here, plural in header. |
| Who We Are | `https://www.betterengineer.com/about` | internal-www | Footer. |
| Why Nearshore | `https://www.betterengineer.com/latamengineer` | internal-www | Footer. |
| FinTech | `https://www.betterengineer.com/fintech` | internal-www | Footer. |
| MarTech | `https://www.betterengineer.com/martech` | internal-www | Footer. |
| HealthTech | `https://www.betterengineer.com/healthtech` | internal-www | Footer. |
| See All Job Opportunities | `https://www.betterengineer.com/careers` | internal-www | Footer. |
| Join Us | `https://www.betterengineer.com/join` | internal-www | Footer. |
| Sign Up | `https://app.betterengineer.com/sign-up/candidate` | app | Footer. |
| Full-Stack Engineer | `https://www.betterengineer.com/careers/full-stack-javascript-engineer` | internal-www | Footer. Label and slug disagree. |
| Front-end Engineer | `https://www.betterengineer.com/careers/front-end-engineer` | internal-www | Footer. |
| Python Engineer | `https://www.betterengineer.com/careers/python-engineer` | internal-www | Footer. |
| DevOps Engineer | `https://www.betterengineer.com/careers/devops-engineer` | internal-www | Footer. |
| Java Engineer | `https://www.betterengineer.com/careers/java-engineer` | internal-www | Footer. |
| Data Science Engineer | `https://www.betterengineer.com/careers/data-science-engineer` | internal-www | Footer. |
| QA Automation Engineer | `https://www.betterengineer.com/careers/qa-automation-engineer` | internal-www | Footer. |
| Typescript Engineer | `https://www.betterengineer.com/careers/typescript-engineer` | internal-www | Footer. |
| Blog | `https://blog.betterengineer.com/resource-center` | external (blog subdomain) | Footer. |
| FAQs | `https://www.betterengineer.com/faqs-nearshore-software-engineers-staff-augmentation-ai-talent` | internal-www | Footer. |
| Ebooks | `https://www.betterengineer.com/ebooks` | internal-www | Footer. |
| Podcast | `https://www.betterengineer.com/podcast` | internal-www | Footer. |
| Technical Glossary | `https://www.betterengineer.com/technical-glossary` | internal-www | Footer. **Self-link: this is the current page.** Also note `docs/site-migration/seo-followups.md` SEO-17 and `content-followups.md` CF-42: the local `footer-full.html` is currently MISSING this link. Adding it is part of shipping this page. |
| Live CGI | `https://www.betterengineer.com/case-studies/livecgi` | internal-www | Footer. |
| Wasteplace | `https://www.betterengineer.com/case-studies/wasteplace` | internal-www | Footer. |
| Privacy Policy | `https://www.betterengineer.com/resource-center/wpautoterms/privacy-policy` | internal-www | Footer. `wpautoterms` residue. Already tracked. |
| Terms of Service | `https://www.betterengineer.com/terms-of-service` | internal-www | Footer. |

Total links: **53** (2 in-page body CTA links plus 51 header, footer, and social chrome links).

**Critically: zero links inside the glossary itself.** No term heading is a link, no definition contains an inline link, and there is no anchor/permalink per term. 71 terms of high-intent technical content with no internal linking at all. This is the single biggest missed opportunity on the page (see Migration Notes).

## 5. Forms

**No form on this page.**

No HubSpot form embed, no newsletter signup, no search box, no A-Z filter control, no chat widget, and no cookie banner were detected. All conversion intent is routed through two CTAs.

CTA destinations that stand in for a form:

| CTA | Destination | Location |
| --- | --- | --- |
| `Hire Better Engineers` | `/multi-step-contact-form` | Top of page, under the intro |
| `Find Better Talent Today` | `/contact` | Closing CTA band |
| `Hire Engineers` | `/multi-step-contact-form` | Header nav CTA |
| `Contact Us` | `/contact` | Footer |
| `Schedule a Call` | `https://calendly.com/tim-salsamobi/30min` | Footer |

Required integrations for the rebuild: none for this page itself. GTM container `GTM-WT77L8JF` must still fire so CTA clicks continue to attribute.

Note that the two body CTAs on this single page point at **two different form experiences** (`/multi-step-contact-form` at the top, `/contact` at the bottom). Confirm which is intended.

## 6. Page structure (logical, layout-independent)

1. **Hero / intro** — Purpose: name the resource and set the reading contract. Content: H1, one intro paragraph, one CTA, one illustration. Component: simple text hero with a single primary button and a supporting image. Very light; no stat blocks, no eyebrow.
2. **Glossary list** — Purpose: define 71 terms for buyers and hiring managers evaluating engineering vocabulary. Content: 71 repetitions of `H2 term` + `definition paragraph`, alphabetically ordered, ungrouped, unlinked, unanchored. One entry (Mobile Engineer) adds a three-item bulleted sub-list. Component: **a single repeating definition-entry component.** This is a data-shaped section rendered as flat prose. **No letter-group headings, no jump nav, no per-term anchors, no back-to-top control.** At 71 entries this is a very long scroll with no wayfinding.
3. **Closing CTA band** — Purpose: final conversion. Content: H2 question, one paragraph, one CTA, one photo (desktop + mobile variants). Component: full-width CTA band with image.

Site chrome (header nav, footer) is shared and belongs to the global layout, not to this page's structure.

The page has essentially two content components and one of them repeats 71 times. That shape is the core input to the data-file recommendation below.

## 7. Migration notes

### Term count and how it was verified

**Exact total: 71 glossary terms.**

Verification method, since the naive "how many terms are there?" question returned unreliable answers:

1. **Pass 1 (heading enumeration).** Asked for every heading in document order with its level. Returned 73 headings: 1 H1 (`Technical Glossary`), 71 term H2s, and 1 closing CTA H2 (`Want to build something great together?`). This enumeration is the authoritative count because it lists each term by name rather than reporting a number.
2. **Passes 3-7 (range enumerations).** Split the alphabet and enumerated terms by name within each range: A = 10, C = 5, D = 8, E-J = 17, K-P = 15, Q-W = 16. **10 + 5 + 8 + 17 + 15 + 16 = 71.** Every name returned by the range passes matched a name in the Pass 1 enumeration, with no extras and no omissions once the truncated first E-L attempt was re-run.
3. **Negative checks.** Two dedicated passes confirmed **no B terms** and **no O terms**, which explains why a casual scan of the alphabet looks incomplete. There are also no U, X, Y, or Z terms.
4. **Endpoint checks.** Two passes independently confirmed the first term is `AI Cloud Services` and the last is `WebDriver (Selenium WebDriver)`.

**Counts that should be ignored.** Three passes were asked for a bare total and returned "approximately 90-95", "87", and "94". These are unreliable: the "94" response's own per-letter breakdown sums to 67, contradicting its stated total, and the "90-95" response was explicitly an estimate. The extraction model cannot count reliably, but it can enumerate reliably. **Trust the enumeration (71), not the totals.**

Per-letter distribution: A 10, B 0, C 5, D 8, E 4, F 2, G 4, H 2, I 1, J 4, K 3, L 2, M 4, N 3, O 0, P 3, Q 1, R 1, S 6, T 4, U 0, V 3, W 1, X 0, Y 0, Z 0.

Confidence: **high.** The one residual uncertainty is whether a term could exist in the DOM but be hidden or collapsed and therefore absent from all text extractions. Nothing suggests this, but it can only be ruled out in a browser.

### Grouping, index, and outbound linking (as asked)

- **Terms are NOT grouped by letter.** There are no letter-group headings. The 71 terms run as one flat alphabetical sequence of H2s.
- **There is NO in-page index and NO alphabetical jump nav.** No A-Z letter row, no table of contents, no search, no filter, no back-to-top.
- **No term links out to another page.** Zero links in the entire glossary section. Terms are not anchored either, so there is no way to deep-link to a definition.

### Content issues (flag, do not fix)

- **CRITICAL: the QA Engineer definition is Python's definition.** Under the heading `QA Engineer (Quality Assurance Engineer)`, the rendered body text is a word-for-word copy of the `Python` definition immediately above it. Two independent extraction passes returned this identically. The genuine QA Engineer definition does not exist on the live page. **This must be verified in a browser and then newly written before rebuild.** Do not ship the duplicated text. This is a visible, embarrassing defect on a public SEO page.
- **CRITICAL: `Selenium WebDriver` and `WebDriver (Selenium WebDriver)` are two entries with byte-identical definitions.** Terms 59 and 71. A verification pass confirmed both headings exist and both definitions match. Recommend collapsing to one entry (`Selenium WebDriver`) with `WebDriver` recorded as an alternate name, but this needs sign-off, not a silent fix.
- **`Vanilla JavaScript` is out of alphabetical order.** It appears after `Vector Database` and `Version Control` rather than before them. Preserved in source order. A data-driven rebuild would sort this automatically, which is an argument for the data-file approach.
- **Two terms cover overlapping ground with no cross-reference:** `Cloud Computing Platforms` and `AWS` / `Google Cloud Platform (GCP)`; `Selenium WebDriver` and `WebDriver`; `Application Frameworks` and `Angular` / `React`. Not errors, but the flat list gives the reader no way to see the relationships.
- **Non-breaking hyphens in three headings.** `AI‑Enhanced Development Workflow`, `Cloud‑Native`, `Full‑Stack Engineer` use U+2011 (non-breaking hyphen) rather than a plain ASCII hyphen. Definition bodies use U+2011 extensively too (`cloud‑hosted`, `pre‑built`, `context‑switching`, `end‑to‑end`, and dozens more). This will break naive slug generation and string matching. Preserved verbatim; **normalise deliberately during the data-file conversion, and record the decision.**
- **Em dash characters are present in the body copy.** At least: `a developer's workflow—often directly into the IDE—to suggest`, `identify bottlenecks—insights that are especially important`, `Familiarity with Linux—command‑line tools, file permissions...—is essential`, `The Node ecosystem—centered around npm (Node Package Manager)—offers`, `across onshore and nearshore contributors—Jupyter Notebooks often serve`. **The repo forbids the em dash character.** These are source copy, preserved verbatim here, but they must be rewritten (not silently swapped) before this page is built, or the build will violate house style. This is the largest copy-editing task on the page.
- **Three names for one page.** Title tag says "Tech Glossary", H1 says "Technical Glossary", intro copy says "The BetterEngineer Glossary". Pick one.
- **Grammar slip in the Jenkins definition.** `Jenkins' plugin ecosystem supports integration with many tools, version control systems, testing frameworks, cloud providers, making it highly extensible.` A list item series that never gets its conjunction; reads as a missing "and". Preserved verbatim.
- **Awkward phrasing in the Jenkins definition:** `organizations with complex, lengthy histories of internal tooling.` Preserved verbatim.
- **Comma splice in the Frontend Engineer definition:** `the user‑facing parts of web and mobile applications, the layouts, interactions, and experiences that end users interact with directly.` Should probably be a colon or dash. Preserved verbatim.
- **Inconsistent capitalization of role names across definitions.** Some definitions capitalize the role (`A Mobile Engineer builds...`, `An AI Engineer focuses...`, `A Data Science Engineer...`) and others lowercase it (`A data engineer builds...`, `A machine learning engineer is responsible...`, `A software architect is a senior engineer...`, `A technical lead (tech lead) is...`). The headings are all title-case. Preserved verbatim; needs one convention.
- **Inconsistent hyphenation of "frontend/backend".** Definitions use `frontend`, `front-end` is absent, but `full‑stack` and `Full‑Stack` both appear, and `cross‑functional` / `Cross‑platform` mix. Preserved verbatim.
- **"Angular" definition mixes hyphen styles in one sentence:** `enterprise-grade projects` uses a plain ASCII hyphen while `large‑scale` and `batteries‑included` in the same paragraph use U+2011. Evidence the copy was assembled from multiple sources.
- **Definition length is wildly uneven.** `Vector Database` and `GraphQL` are 3-4 sentences; `Data Science Engineer` runs to 6 long sentences including three rhetorical questions. Not an error, but it will make a card-based layout ragged.
- **Missing apostrophe in footer.** `Lets build better teams together` should be `Let's`. Site-wide footer issue, already tracked.

### Recommendation: data file plus generator, not a static page

**Recommendation: convert the glossary to `data/glossary.js` plus a `build-glossary.js` generator, following the exact pattern already proven by `data/technologies.js` + `build-tech-pages.js`.** Reasoning:

- **Volume justifies it.** 71 entries is well past the threshold where hand-maintained HTML rots. It is comparable in scale to the existing 58-page technology family, which the team already decided to generate rather than hand-write. Applying a different standard to a larger dataset would be inconsistent.
- **The content is already perfectly regular.** Every entry is exactly `{ term, definition }`. Only one entry (Mobile Engineer) deviates, needing an optional `bullets` array. That is a trivially small schema.
- **A generator fixes three of the recorded defects for free.** Sorting is done by the build, so `Vanilla JavaScript` lands in the right place automatically. Duplicate detection catches `Selenium WebDriver` / `WebDriver` at build time. A `tools/verify-glossary-data.js` check (mirroring the existing `tools/verify-tech-data.js` that `tools/preflight.js` already invokes) can assert unique slugs, non-empty definitions, no em dash characters, and no accidental copy-paste duplication between adjacent definitions. The QA-Engineer-is-Python bug is exactly the class of error such a check would have caught.
- **Letter grouping and jump nav become nearly free.** Once the terms are data, grouping into letter sections and emitting an A-Z jump nav (with the empty letters B, O, U, X, Y, Z rendered disabled rather than omitted) is a few lines of template code. Hand-maintaining that same nav in static HTML across 71 anchors is exactly the kind of thing that drifts.
- **`DefinedTermSet` / `DefinedTerm` schema applies cleanly and should be added.** The page is a textbook `DefinedTermSet`: emit one `DefinedTermSet` with `name`, `description`, and `url`, containing 71 `hasDefinedTerm` entries, each a `DefinedTerm` with `name`, `description`, `inDefinedTermSet`, and `@id` / `url` set to the per-term fragment (`/technical-glossary/#kubernetes`). This is only practical to keep accurate if the schema is generated from the same data as the markup, which is precisely how `build-pages.js` already handles technology-page schema (see the comment at `build-pages.js:221` about generating markup and schema together). Doing it by hand for 71 terms guarantees drift.

**On whether terms warrant their own URLs: no, not initially.** Keep all 71 on the single `/technical-glossary/` page with stable `id` anchors per term. Reasons: the definitions are 3-6 sentences, which is too thin to rank as standalone pages and would read as doorway content; the term set overlaps heavily with the existing technology pages, which already own the commercial intent for `Kubernetes`, `React`, `Python`, etc., so separate glossary URLs would cannibalise them. Anchors give deep-linkability without the thin-content risk. Design the data file so promoting a term to its own page later is a per-entry flag (`hasOwnPage: true`) rather than a rewrite.

**Internal linking is the biggest win and the main reason to make this data.** Today the glossary has zero outbound links. Once it is data, add an optional `relatedTech` / `relatedRole` field per entry and let the generator emit links automatically. High-value pairings visible in the term list:

- Technology-page candidates (verify against `data/technologies.js`; that file is not present in this checkout, so this list is inferred from term names, not confirmed against slugs): `Angular`, `AWS (Amazon Web Services)`, `Cypress`, `Docker`, `GitLab CI`, `Google Cloud Platform (GCP)`, `GraphQL`, `Hadoop`, `HTML`, `Java`, `JavaScript`, `Jenkins`, `Jupyter Notebooks`, `Kotlin`, `Kubernetes`, `Linux`, `Node.js (Node)`, `Python`, `React`, `Selenium WebDriver`, `SQL`, `TensorFlow`, `TypeScript`, `Vanilla JavaScript`, `WebDriver (Selenium WebDriver)`. That is roughly 25 of 71 terms, over a third of the glossary, sitting on top of an existing page family with no link between them.
- Role-page candidates (`discover.betterengineer.com/roles/`): `AI Engineer`, `Data Engineer`, `Data Science Engineer`, `DevOps Engineer`, `Engineering Manager`, `Frontend Engineer`, `Full‑Stack Engineer`, `Machine Learning Engineer`, `MLOps Engineer`, `Mobile Engineer`, `Product Engineer`, `QA Engineer`, `Site Reliability Engineer (SRE)`, `Software Architect`, `Technical Lead (Tech Lead)`. Roughly 15 more terms.
- Existing www pages: `Staff Augmentation` maps to `/staff-augmentation`, `Nearshore Development Team` and `Distributed Engineering Team` map to `/latamengineer`, `Artificial Intelligence (AI)` and `AI‑Enhanced Development Workflow` map to `/ai-readiness`, `Engineering Talent Marketplace` and `Talent Pipeline` map to `/hiring-dashboard`.

**Terms that duplicate or overlap an existing technology page slug:** the ~25 technology terms listed above. `data/technologies.js` is not present in this repo checkout (only `live-url-inventory.js`, `migration-assets.js`, and `pages.js` are), so this overlap list is inferred from term names and **must be diffed against the real slug list before wiring links.** The important decision that falls out of it: the glossary entry and the technology page must not compete for the same query. Recommended rule — the glossary definition stays short and educational, carries `rel` nothing special, and links out to the technology page as the commercial destination; the technology page does not link back into the glossary anchor. That makes the glossary a funnel into the tech pages rather than a competitor.

**Counter-argument for staying static, and why it loses.** A single static `main-technical-glossary.html` is simpler and this content changes rarely. But it is roughly 71 hand-maintained heading/paragraph pairs plus 71 anchor IDs plus a 26-letter nav plus a 71-entry JSON-LD block, all of which must stay in sync by hand. The two defects already found on the live page (a wrong definition and a duplicate entry) are direct evidence that hand-maintenance has already failed once at this scale.

### Missing assets or broken links

- **No `og:image`.** og:title, og:description, and og:url are present; no og:image was found, and twitter:card is `summary` rather than `summary_large_image`. Same defect as `/latamengineer`. Fix on rebuild.
- **No `og:type`.** Not found in extraction. Should be `website`.
- **Alt text is a filename on every page-specific image.** `AI-readiness-strategy – 1`, `betterengineer-team-group-photo-full`, `betterengineer-team-group-photo-full-mobile`. The first also contains an en dash. All three need real alt text or explicit decorative marking.
- **All three page images are borrowed from other page directories** (`/hubfs/AI-readiness-strategy...` and `/hubfs/Website 2024 Update/Home/...`). Check `data/migration-assets.js` and reuse the existing local copies rather than adding duplicate download entries.
- **`footer-full.html` is missing the "Technical Glossary" link** that the live footer has. Already tracked as CF-42 (`content-followups.md:73`) and SEO-17 (`seo-followups.md:50`). **Shipping this page is the trigger to close both.**
- **No broken links detected.** Two destinations linked from chrome remain unbuilt and are Phase 2 siblings of this page: `/podcast`, `/ebooks`, and the long-slug `/faqs-...` page.

### Questionable information needing business review

- **The QA Engineer entry is publishing the wrong definition right now.** This is live on a public page and should be treated as a content incident, not a migration nicety. Confirm in the HubSpot CMS whether the correct copy exists but is not rendering, or whether it was never written.
- **`Selenium WebDriver` vs `WebDriver (Selenium WebDriver)`** — confirm with the content owner that this is an authoring duplicate and not a deliberate double-entry for search coverage.
- **Term set scope.** The glossary mixes three unrelated vocabularies: technologies (`Kubernetes`, `React`), engineering roles (`Data Engineer`, `SRE`), and BetterEngineer commercial models (`Staff Augmentation`, `Dedicated Team`, `Extended Development Team`, `Engineering Talent Marketplace`, `Talent Pipeline`, `Nearshore Development Team`). Confirm whether that mixing is intentional. If it is, a `category` field in the data file would let the rebuilt page offer category filtering in addition to alphabetical order.
- **Definitions repeatedly editorialize toward nearshore.** At least 20 definitions end with a sentence tying the term back to nearshore or distributed teams (`For nearshore teams, strong Python skills can bridge...`, `In nearshore contexts, Kotlin‑skilled engineers...`). Confirm this is the intended voice for a reference resource; it may read as promotional in a glossary and could affect how the page is judged for informational search intent.
- **Calendly, LinkedIn, and Privacy Policy issues** are site-wide chrome defects already recorded against `/latamengineer`. No new instances here.

### Special interactions

- **None.** No accordion, no carousel, no tabs, no search, no filter, no jump nav, no video, no animation, no chat widget, no cookie banner. The page is static prose top to bottom.
- **Responsive image swap** in the closing CTA band: the group photo ships as two separate `<img>` elements (desktop and mobile) toggled by CSS. Prefer a single `<picture>`/`srcset` on rebuild.
- **The absence of interaction is itself the finding.** A 71-entry alphabetical list with no jump nav, no anchors, and no back-to-top is a usability problem on mobile. The rebuild should add an A-Z jump nav and per-term anchors even though the legacy page has neither. **This is an addition, not a migration of existing behaviour — call it out in the rebuild PR so it is not mistaken for extracted content.**

### Implementation considerations

- **Add `DefinedTermSet` / `DefinedTerm` JSON-LD**, generated from the data file. 71 defined terms with zero structured data is the largest schema gap in Phase 2. Register it in `docs/site-migration/structured-data-inventory.md`, which already flags "Resource and glossary term research for Phase 2" at line 344.
- **Add `og:image` and switch `twitter:card` to `summary_large_image`.**
- **Rewrite the em dashes out of the body copy** before building. This is required by house style and affects at least five definitions. Do not do a blind character swap; rephrase.
- **Decide and document the U+2011 non-breaking-hyphen policy.** Recommend normalising to ASCII hyphens in the data file and recording that as a deliberate, logged deviation from verbatim, since it affects slug generation and search matching.
- **Heading hierarchy.** 71 sibling H2s under one H1 is flat but valid. If letter grouping is added, the letters should become H2 and the terms should drop to H3, which is a cleaner outline and better for assistive tech.
- **Anchor IDs.** Generate from the term name, but handle the parenthetical suffixes carefully (`API (Application Programming Interface)` should yield `#api`, not `#api-application-programming-interface`). Store an explicit `slug` per entry in the data file rather than deriving it, so anchors are stable if a term is renamed.
- **Follow the repo build workflow.** Create the `main-technical-glossary.html` fragment (or a generator template), reuse `footer-full.html`, add page styles to `styles/*.css`, then `npm run build`, `node build-discover-dist.js`, `npm run verify`. Add a `tools/verify-glossary-data.js` and register it in `tools/preflight.js` alongside the existing `['technology data', 'node tools/verify-tech-data.js']` entry.
- **Use root-relative asset paths** (`/images/pages/technical-glossary/...`) per CLAUDE.md.
- **Update `data/live-url-inventory.js`**: `/technical-glossary` is currently `{ status: 'pending', phase: 2 }`. Flip to `status: 'built'` with `localPath: 'technical-glossary/index.html'` when shipped.
- **Update `docs/site-migration/migration-status.md` line 68**, which currently reads `NOT STARTED | Candidate for alphabetical index pattern`. That prior assessment is confirmed correct by this extraction.
- **Add the "Technical Glossary" link to `footer-full.html`** and close CF-42 and SEO-17.
- **Preserve GTM `GTM-WT77L8JF`.**
- **No redirect needed** if the path stays `/technical-glossary`.

### Anything the extraction could not confirm

- **`og:image` and `og:type`** — not returned by the metadata pass. Cannot distinguish "absent" from "not surfaced by the fetch". Verify in the raw HTML head.
- **Whether the QA Engineer definition exists in the CMS but fails to render.** Two passes agree the rendered text is Python's. Whether the correct copy exists behind the scenes can only be answered in HubSpot.
- **Whether any term is present in the DOM but hidden.** All extractions are text-based. A hidden or collapsed 72nd term would not appear. Nothing suggests one exists, but only a browser check can rule it out.
- **Exact inline formatting inside definitions.** The extraction returned prose. Bold spans, italics, and inline code (beyond the `.gitlab-ci.yml` monospace noted at Term 31) were not reliably distinguishable. Verify visually before finalising the data file.
- **Whether the term H2s carry `id` attributes.** No anchors were surfaced, and no jump nav references any, so the working assumption is that they do not. Confirm in the raw HTML; if IDs already exist, preserve them so any existing inbound deep links survive.
- **Exact image-to-section mapping.** The hero illustration and the group photo placements are inferred from document order. Confirm visually.
- **Social icon accessible names** — the three footer social links were returned by href with no anchor text. Same open question as `/latamengineer`.
- **The technology-page slug overlap list is inferred, not verified.** `data/technologies.js` is not present in this checkout. Diff the ~25 inferred technology terms against the real slug list before wiring internal links.
- **Extraction pass agreement:** eight passes were run. All passes agreed on term names, term ordering, and all definition wording that they returned. Two conflicts required resolution: (a) an early E-L pass returned truncated single-clause definitions and silently omitted Jenkins, Jupyter Notebooks, Kanban, and Kubernetes — resolved by re-running that range as two narrower passes, which returned complete multi-sentence definitions matching the Pass 1 heading list exactly; (b) three passes returned mutually contradictory bare term totals (90-95, 87, 94, the last of which contradicted its own per-letter breakdown) — resolved in favour of the name-by-name enumeration, which is internally consistent across every pass at **71**.
