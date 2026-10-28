'use strict';

/**
 * Technical glossary terms.
 *
 * Migrated verbatim from https://www.betterengineer.com/technical-glossary
 * See docs/site-migration/pages/technical-glossary.md for the extraction record.
 *
 * `build-glossary.js` turns this into main-technical-glossary.html.
 *
 * Source order is preserved (the live page is alphabetical apart from one
 * defect, noted on the affected entry). The generator sorts.
 *
 * @typedef {Object} GlossaryTerm
 * @property {string}  term        Display name, verbatim from the source
 * @property {string}  slug        kebab-case anchor id, unique
 * @property {string}  definition  Verbatim definition. Plain text, no HTML.
 * @property {string}  [techSlug]  Matching technology page slug, if one exists
 * @property {string}  [roleSlug]  Matching role page slug, if one exists
 * @property {string}  [note]      Migration note for a term that needs review
 */

module.exports = {
  terms: [
    {
      term: 'AI Cloud Services',
      slug: 'ai-cloud-services',
      definition:
        'AI Cloud Services are cloud‑hosted platforms and APIs that provide pre‑built AI capabilities and infrastructure. Examples include managed services for natural language processing, speech recognition, image classification, translation, and custom model training. Instead of building and maintaining their own ML infrastructure from scratch, engineering teams can leverage AI cloud services to accelerate development, experiment with new ideas, and scale AI features as demand grows. These services lower the barrier to entry for AI, especially for product teams that want to focus on user experience and business logic.',
    },
    {
      term: 'AI Code Assistant',
      slug: 'ai-code-assistant',
      definition:
        'An AI code assistant is a tool that integrates into a developer\'s workflow, often directly into the IDE, to suggest code completions, generate snippets, or explain existing code. Powered by LLMs or other AI models, these assistants can accelerate common tasks, help engineers navigate unfamiliar codebases, and reduce context‑switching. They are particularly useful for repetitive patterns, boilerplate, and discovering idiomatic usage of frameworks. Effective use of AI code assistants involves setting clear expectations: they are helpers, not authorities, and their suggestions must be reviewed and tested like any other code.',
      note:
        'Source copy used an em dash here; replaced with a comma. Every word is preserved verbatim.',
    },
    {
      term: 'AI Engineer',
      slug: 'ai-engineer',
      definition:
        'An AI Engineer focuses on designing, implementing, and integrating artificial intelligence capabilities into products and internal systems. While Data Science Engineers often concentrate on exploratory analysis and experimentation, AI Engineers are more oriented toward building production‑ready systems that apply machine learning and related techniques at scale. Their work may include selecting appropriate models and frameworks (e.g., TensorFlow, PyTorch), implementing APIs for model inference, optimizing performance and latency, and ensuring that AI features are robust and observable in production.',
      roleSlug: 'ai-engineers',
    },
    {
      term: 'AI‑Enhanced Development Workflow',
      slug: 'ai-enhanced-development-workflow',
      definition:
        'An AI‑enhanced development workflow is a software engineering process that incorporates AI tools across the development lifecycle. This may include AI assistance for requirements clarification, code generation, test case creation, bug triage, documentation, and incident analysis. Rather than relying on AI at a single touchpoint, an AI‑enhanced workflow intentionally weaves AI into multiple stages, aiming to improve speed, quality, and consistency. Teams adopting this approach must pay attention to governance, data privacy, and clear guidelines so that AI becomes a reliable partner instead of an uncontrolled variable.',
    },
    {
      term: 'Analytics (Engineering & Product Analytics)',
      slug: 'analytics',
      definition:
        'In the context of software engineering and product development, analytics refers to the systematic collection and analysis of data about user behavior, system performance, and team activity. Product analytics tools track how users navigate an application, which features they adopt, and where they drop off, enabling teams to make evidence‑based decisions about what to build next. Engineering analytics focus on metrics like deployment frequency, lead time for changes, incident rates, and team throughput. Together, these analytics help organizations understand whether they are delivering value effectively and identify bottlenecks, insights that are especially important when coordinating multiple teams across regions.',
      note:
        'Source copy used an em dash here; replaced with a comma. Every word is preserved verbatim.',
    },
    {
      term: 'Angular',
      slug: 'angular',
      definition:
        'Angular is a comprehensive frontend framework maintained by Google for building large‑scale web applications. Unlike React, which focuses primarily on the view layer, Angular provides a full framework that includes routing, dependency injection, form handling, and more out of the box. It uses TypeScript as its primary language and encourages a structured architecture suitable for larger, enterprise-grade projects. Teams that choose Angular often do so for its batteries‑included nature and strong conventions, which can be attractive in organizations that value standardization. For nearshore teams, Angular can provide a clear framework within which engineers can contribute consistently across multiple applications or modules.',
      techSlug: 'angular-developers',
    },
    {
      term: 'API (Application Programming Interface)',
      slug: 'api',
      definition:
        'An API (Application Programming Interface) defines how different software components or systems communicate with each other. APIs specify the methods, data formats, and rules for requesting and exchanging information, allowing independent systems to integrate without tightly coupling their internal implementations. In modern web applications, APIs are used for everything from mobile apps talking to backends to backends integrating with payment providers, CRMs, or AI services. Well‑designed APIs are versioned, documented, secure, and consistent, enabling engineering teams across onshore and nearshore locations to build features on top of stable contracts.',
    },
    {
      term: 'Application Frameworks',
      slug: 'application-frameworks',
      definition:
        'Application frameworks are structured platforms and libraries that provide a foundation for building software applications. They encapsulate common patterns and capabilities, such as routing, state management, templating, authentication, and database access, so that engineers don\'t have to reinvent from scratch. Examples include frontend frameworks like React and Angular, backend frameworks like Django, Ruby on Rails, and Spring Boot, and full‑stack frameworks like Next.js. Using a well‑established framework can significantly reduce development time, improve maintainability, and enforce architectural consistency across teams, including nearshore collaborators.',
    },
    {
      term: 'Artificial Intelligence (AI)',
      slug: 'artificial-intelligence',
      definition:
        'Artificial Intelligence (AI) is a broad field focused on building systems that can perform tasks requiring human‑like intelligence, such as perception, reasoning, learning, and language understanding. In software engineering, AI appears in many forms: from recommendation engines and anomaly detection embedded in products to AI‑driven tools that help developers write, test, and review code. Rather than replacing engineers, AI increasingly augments them, automating repetitive tasks and surfacing insights that would be difficult or time‑consuming for humans to produce manually.',
    },
    {
      term: 'AWS (Amazon Web Services)',
      slug: 'aws',
      definition:
        'Amazon Web Services (AWS) is a leading cloud computing platform that provides a broad range of managed services, including compute (EC2, Lambda), storage (S3), databases (RDS, DynamoDB), networking, analytics, and AI offerings. Engineering teams use AWS to build scalable, resilient applications without managing physical hardware. AWS\'s global infrastructure and rich service catalog allow organizations to design architectures that meet stringent requirements for availability, latency, and compliance. For companies working with nearshore engineering teams, standardizing on AWS as a common platform simplifies environment setup, deployments, and access control across geographies.',
      techSlug: 'aws-developers',
    },
    {
      term: 'Cloud Computing Platforms',
      slug: 'cloud-computing-platforms',
      definition:
        'Cloud computing platforms, such as Amazon Web Services (AWS), Google Cloud Platform (GCP), and Microsoft Azure, provide on‑demand access to computing resources over the internet. Instead of managing physical servers, companies can provision virtual machines, containers, managed databases, object storage, and specialized AI services in minutes. These platforms operate on a pay‑as‑you‑go model and support different service layers, including Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS). For modern engineering teams, cloud platforms are the default foundation for building scalable, resilient, and globally accessible applications.',
    },
    {
      term: 'Cloud‑Native',
      slug: 'cloud-native',
      definition:
        'Cloud‑native applications are designed from the ground up to leverage cloud infrastructure and managed services. Rather than treating the cloud as a remote data center, cloud‑native systems embrace practices like containerization, microservices, managed databases, serverless functions, and autoscaling. This approach allows teams to focus more on business logic and less on undifferentiated infrastructure work. For companies scaling with nearshore teams, a cloud‑native foundation provides a consistent environment for all engineers, regardless of where they are located.',
    },
    {
      term: 'CMS (Content Management System)',
      slug: 'cms',
      definition:
        'A Content Management System (CMS) is a platform that allows non‑technical users to create, edit, and publish website or app content without writing code. Engineers often set up and customize CMSs, integrate them with frontends (including headless architectures), and ensure that content changes propagate reliably and securely. For product companies with marketing sites, documentation portals, or in‑app content, a well‑implemented CMS balances flexibility for content teams with maintainability and performance for engineering.',
    },
    {
      term: 'Collaboration Tools',
      slug: 'collaboration-tools',
      definition:
        'Collaboration tools are the software platforms that enable distributed teams to communicate and coordinate their work. For engineering organizations, this often includes Slack or Microsoft Teams for messaging, Zoom or Google Meet for video calls, Jira or Linear for issue tracking, Notion or Confluence for documentation, and GitHub or GitLab for code collaboration. The right combination of tools and shared norms for how to use them creates a digital workspace where onshore and nearshore engineers can work together as if they were in the same room.',
    },
    {
      term: 'Cypress',
      slug: 'cypress',
      definition:
        'Cypress is a modern JavaScript‑based testing framework focused on end‑to‑end testing of web applications. Unlike traditional tools that run outside the browser, Cypress runs inside the browser where the application runs, offering faster feedback, better debugging tools, and a more developer‑friendly experience. It provides features like time travel debugging, automatic waiting, and an interactive GUI for watching tests run in real time. Frontend and full‑stack engineers often prefer Cypress for its tight integration with modern JavaScript stacks and its ease of setup in CI pipelines. For nearshore teams building or maintaining React, Angular, or other modern frontends, Cypress can be a key part of the testing strategy.',
    },
    {
      term: 'Data Engineer',
      slug: 'data-engineer',
      definition:
        'A data engineer builds and maintains the data infrastructure that powers analytics, reporting, and AI initiatives. They design data pipelines to ingest, transform, and store data from various sources into warehouses, data lakes, or real‑time streaming systems. Typical technologies include ETL/ELT frameworks, SQL and NoSQL databases, and tools like Airflow, dbt, Kafka, or cloud‑native data services. Data engineers care deeply about data quality, schema design, performance, and cost, ensuring that downstream stakeholders (such as data scientists, analysts, and product teams) can trust and effectively use the data. In companies that rely on metrics and experimentation, data engineers are essential partners in turning raw logs and events into reliable insights.',
      roleSlug: 'data-engineers',
    },
    {
      term: 'Data Processing & Management',
      slug: 'data-processing-management',
      definition:
        'Data processing and management refer to the end‑to‑end handling of data as it flows through an organization. This includes collecting raw data from various sources (applications, logs, third‑party services), cleaning and transforming it, and storing it in structures suitable for analytics, reporting, or AI workloads. Good data management ensures data quality, consistency, security, and compliance with regulations. For engineering organizations, robust data processing pipelines are essential for powering dashboards, experimentation frameworks, and machine learning models that inform strategic decisions.',
    },
    {
      term: 'Data Science Engineer',
      slug: 'data-science-engineer',
      definition:
        'A Data Science Engineer (often called a Data Scientist or Data Science Engineer, depending on the organization) sits at the intersection of statistics, programming, and business problem‑solving. Their core responsibility is to extract insight and value from data: they explore datasets, build models, and help translate raw information into actionable recommendations. On a day‑to‑day basis, they may clean and transform data, design experiments, apply statistical methods, and prototype predictive models in tools like Python and Jupyter Notebooks. In a product organization, Data Science Engineers partner with product managers, analysts, and engineers to answer questions such as: Which user segments are most engaged? Which features drive retention? Where is churn highest and why? They also support decision‑making around pricing, A/B tests, and growth experiments. When embedded in a nearshore or distributed team, a Data Science Engineer benefits from close collaboration with backend and data engineers who maintain the underlying data pipelines and infrastructure.',
      roleSlug: 'data-science-engineers',
    },
    {
      term: 'Database Technologies',
      slug: 'database-technologies',
      definition:
        'Database technologies encompass the systems engineers use to store, query, and manage application data. Relational databases like PostgreSQL, MySQL, and SQL Server organize data into tables with strict schemas and support powerful queries with SQL. NoSQL databases, such as MongoDB, Cassandra, and DynamoDB, offer more flexible schema models, horizontal scalability, or specialized data handling for documents, key‑value pairs, wide‑column data, or graphs. Time‑series databases and analytical warehouses support specific workloads like monitoring or large‑scale analytics. Choosing the right database technology is a core architectural decision that impacts performance, scalability, and developer productivity.',
    },
    {
      term: 'Dedicated Team / Dedicated Team Model',
      slug: 'dedicated-team',
      definition:
        'A dedicated team (or dedicated team model) is an engagement model in which a partner assembles a group of engineers that work exclusively for a single client over an extended period of time. The client effectively "rents" a full team, often including developers, QA, and sometimes a tech lead or delivery manager, that operates as a stable, long‑term extension of the internal organization. The dedicated team is aligned with the client\'s product roadmap, shares the same goals and KPIs, and participates regularly in planning and review ceremonies. This approach is well‑suited for ongoing product development, where continuity, domain knowledge, and team cohesion matter more than one‑off deliveries.',
    },
    {
      term: 'DevOps Engineer',
      slug: 'devops-engineer',
      definition:
        'A DevOps engineer sits at the intersection of software development and operations. Their core mandate is to automate and streamline the processes that take code from a developer\'s laptop into production safely and repeatedly. This typically includes setting up and maintaining continuous integration and continuous delivery (CI/CD) pipelines, managing infrastructure (often in the cloud), configuring observability tools (logs, metrics, traces), and building internal tooling that makes deployments and rollbacks predictable. DevOps engineers champion practices like infrastructure as code, automated testing, and monitoring so that teams can ship more frequently without sacrificing stability.',
      roleSlug: 'devops-engineers',
    },
    {
      term: 'Distributed Engineering Team',
      slug: 'distributed-engineering-team',
      definition:
        'A distributed engineering team is one in which team members are spread across different cities, countries, or continents, often working remotely from wherever they live. There may be no single central office or headquarters; instead, the team\'s collaboration happens through digital tools and well‑defined processes. Distributed teams can tap into global talent and provide flexibility and autonomy to engineers, but they must be intentional about communication, documentation, and decision‑making to avoid silos and misalignment.',
    },
    {
      term: 'Docker',
      slug: 'docker',
      definition:
        'Docker is a platform for building, packaging, and running applications in lightweight, portable containers. A Docker container bundles an application with its dependencies (libraries, runtime, configuration), ensuring that it runs consistently across different environments, from a developer\'s laptop to staging and production. Containers help solve the classic "it works on my machine" problem and are foundational to modern DevOps and cloud‑native architectures. Teams that adopt Docker can standardize how services are built and deployed, which is especially valuable in distributed setups where engineers across time zones must share a predictable environment.',
      techSlug: 'docker-developers',
    },
    {
      term: 'Engineering Manager',
      slug: 'engineering-manager',
      definition:
        'An engineering manager is responsible for the people, processes, and outcomes of an engineering team. Their role combines leadership, coaching, and organizational design: they support engineers\' growth, manage performance, and create an environment where the team can deliver reliably. Engineering managers spend their time on hiring, feedback, career development, and process improvements, while partnering with product managers to align work with business goals. They may still have technical context and occasionally contribute to design discussions, but their primary responsibility is to enable the team, resolve blockers, and ensure that collaboration across locations remains smooth and effective.',
    },
    {
      term: 'Engineering Pod / Product Development Team',
      slug: 'engineering-pod',
      definition:
        'An engineering pod (sometimes called a cross‑functional squad or product development team) is a small, focused group of people, typically including engineers, a product manager, and sometimes a designer, who own a specific part of the product or customer journey. Pods are designed to be autonomous and outcome‑oriented: they have a clear mission, manage their own backlog, and are empowered to ship features end‑to‑end. This structure works particularly well when combining in‑house and nearshore engineers because it creates stable, long‑lived units that build domain knowledge and accountability over time.',
    },
    {
      term: 'Engineering Talent Marketplace',
      slug: 'engineering-talent-marketplace',
      definition:
        'An engineering talent marketplace is a platform that connects companies with software engineers who are available for contract, staff augmentation, or full‑time roles. These marketplaces often vet candidates for technical skills, language proficiency, and soft skills, and then match them with clients based on project requirements, tech stacks, and cultural fit. For companies that need to scale engineering quickly, a talent marketplace focused on nearshore or regional talent can dramatically shorten time‑to‑hire and improve the quality of matches.',
    },
    {
      term: 'Extended Development Team',
      slug: 'extended-development-team',
      definition:
        'The extended team model describes a hybrid setup in which external engineers are integrated directly into the client\'s existing squads, workflows, and communication channels. Rather than operating as a separate unit, these engineers join daily stand‑ups, use the same repositories and tools, and follow the same coding standards as the in‑house team. The goal is to make the location invisible: nearshore engineers feel like colleagues rather than vendors. This model works best when there is clear technical leadership on the client side and a willingness to include external engineers fully in planning, decision‑making, and knowledge sharing.',
    },
    {
      term: 'Frontend Engineer',
      slug: 'frontend-engineer',
      definition:
        'A frontend engineer builds the user‑facing parts of web and mobile applications, the layouts, interactions, and experiences that end users interact with directly. They work primarily with technologies like HTML, CSS, and JavaScript, along with frameworks such as React, Angular, or Vue. Their work involves translating design concepts into responsive, accessible interfaces that perform well across devices and browsers. Frontend engineers balance aesthetics with usability and performance, making choices that affect how intuitive an application feels and how quickly it responds to user input. They work closely with designers, product managers, and backend engineers to ensure the interface accurately reflects business requirements while delivering a seamless user experience.',
      roleSlug: 'front-end-engineers',
    },
    {
      term: 'Full‑Stack Engineer',
      slug: 'full-stack-engineer',
      definition:
        'A full‑stack engineer is comfortable working across both the frontend and backend layers of an application. Rather than specializing in a single tier, they understand how data flows from the database all the way to the browser, and can contribute to system design, API development, and user interface implementation. Full‑stack engineers are particularly valuable in smaller or fast‑moving teams where flexibility and ownership matter: they can take a feature from concept to production, connecting the dots between product requirements, technical constraints, and user experience. While they may still have deeper expertise in one area (frontend or backend), their breadth allows them to collaborate effectively across disciplines and reduce handoff friction.',
      roleSlug: 'full-stack-engineers',
    },
    {
      term: 'Generative AI',
      slug: 'generative-ai',
      definition:
        'Generative AI refers to AI systems that can create new content, such as text, images, audio, video, or code, based on patterns learned from training data. In the context of engineering, generative AI tools help developers draft code, refactor existing codebases, generate test cases, write documentation, and even propose architectural patterns. These tools can significantly speed up development and reduce boilerplate work, but they work best when paired with human judgment: engineers must review, adapt, and validate generated content to ensure it meets quality, security, and performance standards.',
    },
    {
      term: 'GitLab CI',
      slug: 'gitlab-ci',
      definition:
        'GitLab CI is the continuous integration and delivery system built into GitLab, a popular platform for hosting Git repositories and managing DevOps workflows. Using a .gitlab-ci.yml file, teams define pipelines that run on each push or merge request, building artifacts, running tests, scanning for security issues, and deploying to environments. GitLab CI\'s integration with source control, code review, and issue tracking creates a unified, end‑to‑end flow for software delivery. For organizations using nearshore teams, GitLab CI provides a single, shared automation layer where every contribution, regardless of origin, is validated and deployed using the same rules.',
      note:
        'On the live page ".gitlab-ci.yml" renders as inline code. Stored as plain text here; restore the code formatting in the template if desired.',
    },
    {
      term: 'Google Cloud Platform (GCP)',
      slug: 'google-cloud-platform',
      definition:
        'Google Cloud Platform (GCP) is Google\'s cloud offering, known for its strengths in data analytics, machine learning, and Kubernetes‑based workloads. Services like BigQuery, Cloud Storage, and Vertex AI are frequently used in data‑intensive applications. GCP\'s origins inside Google\'s own infrastructure practices appeal to teams that prioritize containers, microservices, and AI/ML capabilities. For organizations running data‑heavy or AI‑driven products, GCP can offer a compelling combination of performance and specialized tooling. Nearshore teams familiar with GCP can quickly integrate into such environments and leverage Google\'s managed services to accelerate delivery.',
      techSlug: 'google-cloud-developers',
    },
    {
      term: 'GraphQL',
      slug: 'graphql',
      definition:
        'GraphQL is a query language and runtime for APIs that allows clients to request exactly the data they need in a single request. Instead of multiple REST endpoints, GraphQL exposes a type system and a single endpoint through which clients specify their data requirements. This can reduce over‑fetching and under‑fetching, improve performance on slow networks, and give frontend teams more flexibility. GraphQL is increasingly popular in modern product engineering, especially in applications with complex, nested data requirements.',
      techSlug: 'graphql-developers',
    },
    {
      term: 'Hadoop',
      slug: 'hadoop',
      definition:
        'Hadoop is an open‑source framework for distributed storage and processing of large datasets across clusters of commodity hardware. Its core components, such as HDFS (Hadoop Distributed File System) and MapReduce, were early enablers of big data processing in batch mode. While newer systems and cloud‑native data platforms have evolved beyond classic Hadoop, the ecosystem (including tools like Hive, Pig, and related technologies) has had a lasting influence on modern data architectures. Organizations with legacy or large‑scale on‑premise data systems may still rely on Hadoop for high‑volume data processing. Engineers and data specialists working in such environments need to understand both Hadoop and newer paradigms to design migrations and hybrid solutions.',
    },
    {
      term: 'HTML',
      slug: 'html',
      definition:
        'HTML (HyperText Markup Language) is the standard markup language used to structure content on the web. Frontend engineers use HTML to define elements such as headings, paragraphs, links, images, and forms, which browsers then render into pages. While HTML itself is not a programming language, it is a foundational technology for web development, working in tandem with CSS for styling and JavaScript for interactivity. A strong understanding of semantic HTML is important for accessibility, SEO, and maintainable frontend code.',
    },
    {
      term: 'Infrastructure as Code (IaC)',
      slug: 'infrastructure-as-code',
      definition:
        'Infrastructure as Code (IaC) is the practice of managing and provisioning infrastructure, such as servers, networks, and databases, using machine‑readable configuration files instead of manual processes. Tools like Terraform, CloudFormation, or Pulumi allow teams to define their infrastructure in code, version it, review it, and apply it via automated pipelines. IaC improves reproducibility, reduces configuration drift, and enables rapid environment creation and teardown. For distributed teams, IaC is crucial because it encodes infrastructure decisions in a shared, auditable format rather than in someone\'s memory or on an undocumented server.',
    },
    {
      term: 'Java',
      slug: 'java',
      definition:
        'Java is a mature, object‑oriented programming language widely used in enterprise systems, Android development, and large‑scale backend services. Its strong typing, extensive ecosystem, and long‑term backward compatibility make it a safe choice for systems that must be reliable and maintainable for many years. Java powers many financial systems, telco platforms, and high‑throughput web services. Engineering teams that adopt Java often value performance, stability, and a deep pool of experienced developers worldwide, including in nearshore regions. The Java Virtual Machine (JVM) also supports other languages like Kotlin and Scala, giving teams flexibility while leveraging the same underlying platform.',
      techSlug: 'java-developers',
    },
    {
      term: 'JavaScript',
      slug: 'javascript',
      definition:
        'JavaScript is a versatile, high‑level programming language that started as a way to add interactivity to web pages and has since expanded to power full‑stack development. In the browser, JavaScript runs client‑side code; on the server, runtimes like Node.js allow engineers to build backend services in the same language. JavaScript is dynamic, prototype‑based, and event‑driven, making it well‑suited to asynchronous, interactive applications. Because JavaScript is virtually universal in frontend development and increasingly common on the backend, it\'s a key skill for many modern engineering teams and a central anchor for hiring across regions, including nearshore talent.',
      techSlug: 'javascript-developers',
    },
    {
      term: 'Jenkins',
      slug: 'jenkins',
      definition:
        'Jenkins is an open‑source automation server that has long been a cornerstone of CI/CD practices. It allows teams to define jobs and pipelines that automatically build, test, and deploy code whenever changes are pushed to a repository. Jenkins\' plugin ecosystem supports integration with many tools, version control systems, testing frameworks, cloud providers, making it highly extensible. While newer CI systems have emerged, Jenkins remains widely used, especially in organizations with complex, lengthy histories of internal tooling. Distributed teams using Jenkins can standardize on pipeline definitions so that builds and deployments behave identically regardless of where engineers are located.',
      techSlug: 'jenkins-developers',
    },
    {
      term: 'Jupyter Notebooks',
      slug: 'jupyter-notebooks',
      definition:
        'Jupyter Notebooks are interactive, document‑like environments that allow engineers and data scientists to mix executable code, visualizations, and narrative text in a single place. They are widely used for data exploration, model prototyping, experiment tracking, and reporting. A typical notebook might load data, clean it, run analyses, visualize results, and document observations in Markdown, making the analysis both reproducible and understandable. While notebooks are excellent for exploratory work and communication, productionizing models and pipelines generally requires refactoring code into modules or services. In teams that blend product engineering and data science, across onshore and nearshore contributors, Jupyter Notebooks often serve as the bridge between exploration and engineering implementation.',
      note:
        'Source copy used an em dash here; replaced with a comma. Every word is preserved verbatim.',
    },
    {
      term: 'Kanban',
      slug: 'kanban',
      definition:
        'Kanban is a visual workflow management method that focuses on continuously improving flow rather than working in fixed‑length sprints. Teams using Kanban visualize their work on a board with columns such as "To Do," "In Progress," and "Done," and may set work‑in‑progress (WIP) limits to reduce bottlenecks and multitasking. Progress is managed by pulling tasks into the next stage only when there is capacity. Kanban is particularly useful for teams handling a steady stream of incoming requests or operational work, and it integrates well with remote and nearshore setups because the board provides a shared, always‑up‑to‑date view of the team\'s workload.',
    },
    {
      term: 'Kotlin',
      slug: 'kotlin',
      definition:
        'Kotlin is a modern, statically typed language that runs on the Java Virtual Machine (JVM) and is fully interoperable with Java. It is officially supported for Android development and increasingly used for backend services as well. Kotlin improves on Java\'s ergonomics with features like null‑safety, extension functions, data classes, and coroutines for asynchronous programming. For teams with existing Java ecosystems, Kotlin offers a way to modernize codebases incrementally and improve developer productivity without discarding existing investments. In nearshore contexts, Kotlin‑skilled engineers can contribute to both Android clients and backend systems.',
      techSlug: 'kotlin-developers',
    },
    {
      term: 'Kubernetes',
      slug: 'kubernetes',
      definition:
        'Kubernetes is an open‑source container orchestration platform that automates the deployment, scaling, and management of containerized applications. Rather than manually starting and stopping containers, teams define their desired state (replicas, resource limits, networking, storage), and Kubernetes continuously works to maintain that state, automatically restarting containers, balancing load, and rolling out updates. Kubernetes has become the de facto standard for running microservices at scale, particularly in cloud environments. For organizations using nearshore teams, Kubernetes provides a consistent infrastructure abstraction across regions, making it easier for distributed engineers to deploy and operate services reliably.',
      techSlug: 'kubernetes-developers',
    },
    {
      term: 'Large Language Model (LLM)',
      slug: 'large-language-model',
      definition:
        'A Large Language Model (LLM) is a type of machine learning model trained on large amounts of text data to understand and generate human‑like language. Examples include models that can answer questions, summarize documents, translate languages, generate code, or act as conversational agents. In software engineering, LLMs underpin AI code assistants, documentation copilots, and support bots that help developers and users navigate complex systems. LLMs are powerful but must be used thoughtfully, with attention to accuracy, security, and responsible use of data.',
    },
    {
      term: 'Linux',
      slug: 'linux',
      definition:
        'Linux is a family of open‑source operating systems that power a large percentage of servers, cloud instances, containers, and development environments worldwide. Most backend services, databases, and infrastructure components that engineers work with run on some flavor of Linux. Familiarity with Linux: command‑line tools, file permissions, networking, process management, is essential for many engineering roles, particularly backend, DevOps, and SRE. In nearshore environments, Linux literacy is often a baseline expectation for engineers who operate or debug production systems.',
      note:
        'Source copy used a pair of em dashes here; the opening one became a colon (a comma would have been ungrammatical inside the following comma-separated list) and the closing one became a comma. Every word is preserved verbatim.',
    },
    {
      term: 'Machine Learning Engineer',
      slug: 'machine-learning-engineer',
      definition:
        'A machine learning engineer is responsible for taking machine learning models from experimentation into robust, scalable production systems. They work at the intersection of data science and software engineering, partnering with data scientists to translate models into performant code, integrate them into applications, and monitor their behavior in the real world. Their work includes feature engineering, model deployment, building APIs for inference, and setting up monitoring to detect model drift and performance issues. Machine learning engineers often use specialized frameworks (like TensorFlow or PyTorch), as well as MLOps tools for experiment tracking, model registry, and automated retraining. In an AI‑enabled engineering organization, they play a key role in transforming prototypes into products.',
    },
    {
      term: 'MLOps Engineer',
      slug: 'mlops-engineer',
      definition:
        'An MLOps engineer focuses on the operational side of machine learning systems, similar to how DevOps engineers focus on application systems. They design and implement the workflows that move models from development to production and keep them healthy over time. This includes managing feature stores, orchestrating training and deployment pipelines, setting up CI/CD for models, and tracking model versions and lineage. MLOps engineers build the infrastructure and automation that allows multiple teams to experiment, deploy, and iterate on models safely and efficiently. As companies introduce more AI into their products, MLOps becomes critical for ensuring that models remain accurate, explainable, and compliant with internal and external requirements.',
    },
    {
      term: 'Mobile Engineer',
      slug: 'mobile-engineer',
      definition:
        'A Mobile Engineer builds applications that run natively on mobile devices, such as smartphones and tablets. They typically specialize in one or more ecosystems: iOS Engineers use Swift (and sometimes Objective‑C) to build apps for Apple devices, leveraging frameworks like UIKit or SwiftUI and integrating with the broader Apple ecosystem. Android Engineers use Kotlin (and sometimes Java) to build apps for Android devices, working with Android SDKs, Jetpack libraries, and Google Play distribution. Cross‑platform Mobile Engineers use frameworks like React Native to build apps that share large portions of code across iOS and Android while still delivering near‑native experiences. Mobile Engineers must consider constraints like device performance, network variability, app store guidelines, and user expectations for responsiveness and polish. In distributed or nearshore teams, mobile engineers often work closely with backend engineers to design APIs tailored to mobile needs and with designers to ensure interfaces feel intuitive on smaller screens.',
      roleSlug: 'mobile-engineers',
      note:
        'The only entry with a bulleted sub-list on the live page (the three iOS / Android / cross-platform items). Flattened to prose here because definitions are plain text; all wording is verbatim and in source order.',
    },
    {
      term: 'MVP (Minimum Viable Product)',
      slug: 'mvp',
      definition:
        'A Minimum Viable Product (MVP) is the simplest version of a product that can be released to validate key assumptions and gather meaningful user feedback with minimal effort. Rather than building every feature on the roadmap, teams focus on a core set of functionalities that solve the primary user problem and allow them to measure real‑world behavior. The MVP concept encourages experimentation and learning, helping companies avoid over‑investing in ideas that don\'t resonate. Nearshore and distributed teams often play a central role in delivering MVPs quickly while maintaining enough technical quality to support iteration.',
    },
    {
      term: 'Nearshore Development Team',
      slug: 'nearshore-development-team',
      definition:
        'A nearshore development team is a group of engineers based in a nearby region who work closely with a client\'s in‑house team to build and maintain software products. Unlike traditional outsourcing arrangements that deliver work in a more transactional way, nearshore teams typically adopt the client\'s tools, workflows, and agile practices. They join the same stand‑ups, planning sessions, and retrospectives, effectively functioning as an extension of the existing engineering organization. This setup combines the advantages of geographic proximity, cultural alignment, and cost effectiveness with the flexibility to quickly scale or reconfigure capacity.',
    },
    {
      term: 'NLP Tools (Natural Language Processing Tools)',
      slug: 'nlp-tools',
      definition:
        'Natural Language Processing (NLP) tools are libraries and services that allow engineers to analyze, understand, and generate human language. They support tasks such as sentiment analysis, entity recognition, text classification, summarization, and machine translation. In modern products, NLP powers features like intelligent search, chatbots, support ticket triage, and content moderation. With the rise of LLMs, NLP tools are increasingly integrated into general‑purpose AI platforms that support a wide range of language‑based workflows.',
    },
    {
      term: 'Node.js (Node)',
      slug: 'nodejs',
      definition:
        'Node.js is a JavaScript runtime built on Chrome\'s V8 engine that allows engineers to run JavaScript outside the browser, most commonly on servers. With Node.js, teams can use a single language (JavaScript or TypeScript) for both frontend and backend development. Node\'s non‑blocking, event‑driven architecture makes it well‑suited for I/O‑heavy applications like APIs, real‑time chat, and streaming services. The Node ecosystem, centered around npm (Node Package Manager), offers a vast library of open‑source modules, making it quick to assemble common backend capabilities. For organizations that want fast iteration and a unified tooling stack across web and API layers, Node.js is often a natural choice.',
      techSlug: 'nodejs-developers',
      note:
        'Source copy used an em dash here; replaced with a comma. Every word is preserved verbatim.',
    },
    {
      term: 'Product Engineer',
      slug: 'product-engineer',
      definition:
        'A product engineer is a software engineer who works very closely with product managers, designers, and users to deliver features that directly impact business outcomes. Instead of focusing solely on technical elegance, product engineers are deeply interested in user problems, product metrics, and feedback loops. They often participate in discovery, help refine requirements, and propose solutions that balance feasibility, impact, and time‑to‑market. Product engineers are comfortable moving quickly, experimenting, and iterating based on data, and they thrive in cross‑functional squads that own a specific part of the product surface area end‑to‑end.',
    },
    {
      term: 'Prompt Engineering',
      slug: 'prompt-engineering',
      definition:
        'Prompt engineering is the practice of crafting and refining inputs to AI models, particularly LLMs, to elicit useful, reliable outputs. Because these models respond differently depending on how a request is phrased and structured, prompt engineering involves experimentation with instructions, examples, and context to achieve consistent results. For engineering teams using AI code assistants or chat‑based tools, good prompt engineering can significantly improve the quality of suggestions, reduce back‑and‑forth, and align outputs with the team\'s style and standards.',
    },
    {
      term: 'Python',
      slug: 'python',
      definition:
        'Python is a high‑level, general‑purpose programming language known for its readability, concise syntax, and rich ecosystem. It is heavily used in data science, machine learning, automation, scripting, and backend web development (via frameworks like Django and Flask). Python\'s extensive standard library and third‑party packages make it a powerful tool for quickly building prototypes and production systems alike. In AI and data‑driven engineering organizations, Python is often the lingua franca for data scientists and ML engineers. For nearshore teams, strong Python skills can bridge data engineering, ML, and application development efforts.',
      techSlug: 'python-developers',
    },
    {
      term: 'QA Engineer (Quality Assurance Engineer)',
      slug: 'qa-engineer',
      definition:
        'A QA Engineer, or Quality Assurance Engineer, is responsible for verifying that software behaves as intended before it reaches users. The role spans exploratory and manual testing, writing and maintaining automated test suites with tools such as Cypress, Playwright, and Selenium, and validating APIs and integrations. Strong QA Engineers do more than find defects: they shape acceptance criteria, build regression coverage that lets teams ship faster with confidence, and feed quality signals back into the development process. On distributed teams they are often the clearest voice on release readiness.',
      roleSlug: 'qa-engineers',
      note:
        'CF-63: the live page publishes Python\'s definition here by mistake. This definition was written for the migration, not migrated. Needs sign-off before cutover.',
    },
    {
      term: 'React',
      slug: 'react',
      definition:
        'React is a popular JavaScript library for building user interfaces, originally developed by Meta (Facebook). It focuses on building UI components that manage their own state and compose together to form complex applications. React introduced concepts like the virtual DOM and declarative UI, which simplify reasoning about how the interface should look as data changes. For engineering teams, React has become a default choice for modern web frontends due to its strong ecosystem (hooks, context, React Router), broad community, and compatibility with tooling like TypeScript, Next.js, and modern build systems. In a nearshore or distributed environment, React\'s ubiquity makes it easier to find engineers who can be productive quickly and share reusable UI components across teams.',
      techSlug: 'react-developers',
    },
    {
      term: 'SaaS (Software as a Service)',
      slug: 'saas',
      definition:
        'Software as a Service (SaaS) is a software delivery model where applications are hosted in the cloud and accessed by customers over the internet, typically via subscription. Instead of installing and maintaining software on their own hardware, customers log into a web or mobile interface, while the provider manages infrastructure, updates, and security. SaaS products are often built using multi‑tenant architectures, continuous delivery, and usage‑based analytics. For engineering teams working on SaaS products, considerations like uptime, data privacy, and smooth onboarding are central to success.',
    },
    {
      term: 'Selenium WebDriver',
      slug: 'selenium-webdriver',
      definition:
        'Selenium WebDriver is a widely used open‑source tool for automating web browsers. It allows engineers and QA specialists to write scripts, typically in languages like Java, Python, or JavaScript, that control a browser and interact with web pages as a user would: clicking buttons, filling forms, navigating between pages, and asserting expected outcomes. Selenium is commonly used for end‑to‑end testing of web applications, ensuring that key user flows work correctly across browsers. In distributed teams, shared Selenium test suites become part of the CI pipeline, catching regressions automatically whenever new code is deployed.',
      note:
        'CONTENT DEFECT, preserved as found: this definition is byte-identical to the one under "WebDriver (Selenium WebDriver)". The live page carries both entries. Needs content-owner sign-off to collapse into one.',
    },
    {
      term: 'Site Reliability Engineer (SRE)',
      slug: 'site-reliability-engineer',
      definition:
        'A Site Reliability Engineer (SRE) applies software engineering principles to operations and reliability. Originating at Google, the SRE discipline focuses on building systems that meet explicit reliability targets (such as uptime and latency) while still allowing fast product development. SREs typically define service level indicators (SLIs) and service level objectives (SLOs), create error budgets, and build tooling that automates incident detection, mitigation, and root‑cause analysis. They often write code to improve system reliability, such as auto‑scaling mechanisms, self‑healing scripts, or load‑testing tools, rather than manually operating systems. SREs are especially valuable for complex, cloud‑native architectures where the cost of downtime is high and reliability must be engineered into the system from the start.',
    },
    {
      term: 'Software Architect',
      slug: 'software-architect',
      definition:
        'A software architect is a senior engineer responsible for defining the high‑level technical structure of a system. They make foundational decisions about architecture, technology stacks, integration patterns, and non‑functional requirements such as scalability, reliability, and security. Instead of focusing solely on day‑to‑day coding tasks, a software architect looks at the system as a whole: how different services interact, where data lives, how failures are handled, and how the system will evolve over time as requirements change. They often create architectural diagrams, technical standards, and guidelines to help engineering teams build consistently and avoid fragmented, hard‑to‑maintain solutions. In distributed or nearshore setups, architects also play a key role in aligning multiple teams across locations on a common technical vision.',
    },
    {
      term: 'SQL',
      slug: 'sql',
      definition:
        'SQL (Structured Query Language) is the standard language for managing and querying data in relational databases. Engineers and data professionals use SQL to define tables, insert and update records, and write queries that filter, aggregate, and join data across multiple tables. Despite its age, SQL remains one of the most critical skills in data‑driven organizations: it underpins reporting, analytics, and many application features that rely on structured data. For distributed teams, SQL forms a shared foundation between backend engineers, data engineers, analysts, and data scientists, enabling cross‑functional collaboration around the same datasets and schemas.',
    },
    {
      term: 'Staff Augmentation',
      slug: 'staff-augmentation',
      definition:
        'Staff augmentation is a flexible hiring model in which a company extends its internal engineering team with external developers who work as integrated members of the team. Instead of outsourcing an entire project to a third party, the client retains control over the roadmap, priorities, and daily workflow, while the augmentation partner supplies vetted talent that plugs into existing processes and tools. This model allows organizations to scale capacity quickly, access specialized skills, and adjust team size as needs change, without committing to the overhead of permanent hires in every market.',
    },
    {
      term: 'Talent Pipeline',
      slug: 'talent-pipeline',
      definition:
        'A talent pipeline is a curated pool of candidates who have already been vetted and are ready to be matched to open roles. A mature pipeline includes engineers with different skill sets, seniority levels, and language capabilities, allowing companies to move quickly when new needs arise. For partners specializing in nearshore staff augmentation, maintaining a strong pipeline in target regions backed by ongoing sourcing and evaluation is a core part of their value proposition.',
    },
    {
      term: 'Technical Lead (Tech Lead)',
      slug: 'technical-lead',
      definition:
        'A technical lead (tech lead) is an experienced engineer who guides the technical execution of a team. They are hands‑on with the code but also responsible for reviewing designs, making trade‑off decisions, and ensuring that the team\'s work aligns with the broader architectural vision. Tech leads often mentor other engineers, facilitate technical discussions, and serve as the main technical point of contact for product managers and stakeholders. Their role is not purely managerial; instead, they blend deep technical expertise with leadership skills to keep projects moving in the right direction and ensure that delivered solutions are robust, maintainable, and scalable.',
    },
    {
      term: 'TensorFlow',
      slug: 'tensorflow',
      definition:
        'TensorFlow is an open‑source machine learning framework originally developed by Google. It provides tools for building, training, and deploying machine learning and deep learning models, including neural networks for tasks like image recognition, text analysis, and time‑series forecasting. TensorFlow supports both high‑level APIs (such as Keras) for rapid development and lower‑level control for custom model architectures. Engineering and AI teams use TensorFlow to move from experimentation to production, leveraging its support for distributed training, hardware acceleration (GPUs/TPUs), and deployment targets that include servers, mobile devices, and edge hardware. Nearshore AI Engineers familiar with TensorFlow can seamlessly integrate with teams using this stack.',
      techSlug: 'tensorflow-developers',
    },
    {
      term: 'TypeScript',
      slug: 'typescript',
      definition:
        'TypeScript is a typed superset of JavaScript that adds optional static types and compiles down to plain JavaScript. By introducing types (interfaces, enums, generics), TypeScript helps engineers catch many classes of errors at compile time rather than at runtime. It improves tooling support (autocompletion, refactoring, navigation), documentation, and long‑term maintainability of codebases, especially as teams and applications grow. Adopting TypeScript is particularly impactful in distributed or nearshore environments, where clear contracts and strong tooling reduce ambiguity between teams and make it easier for new engineers to onboard to existing projects.',
      techSlug: 'typescript-developers',
    },
    {
      term: 'Vector Database',
      slug: 'vector-database',
      definition:
        'A vector database is a specialized type of database optimized for storing and querying vector embeddings, high‑dimensional numeric representations of data such as text, images, or audio. In AI applications, embeddings allow models to measure similarity between items and power features like semantic search, recommendations, and retrieval‑augmented generation (RAG). Vector databases support operations like nearest‑neighbor search at scale, making them essential infrastructure for advanced AI features integrated into products.',
    },
    {
      term: 'Version Control',
      slug: 'version-control',
      definition:
        'Version control systems, such as Git, track and manage changes to source code over time. They allow multiple developers to work on the same project concurrently, branch and experiment safely, and roll back to previous versions if necessary. Version control provides a detailed history of changes (who changed what, when, and why), which is invaluable for debugging, auditing, and collaboration. In modern teams, platforms like GitHub, GitLab, or Bitbucket combine version control with code review, CI/CD, and collaboration tools, forming the backbone of a distributed development workflow.',
    },
    {
      term: 'Vanilla JavaScript',
      slug: 'vanilla-javascript',
      definition:
        'Vanilla JavaScript refers to using JavaScript in its raw form, without additional frameworks or libraries. It\'s the core language that browsers and many runtime environments (like Node.js) understand. Even when engineers use frameworks like React or Angular, a solid understanding of vanilla JavaScript is critical: it underpins how the language works, how the event loop behaves, and how to debug core issues. For engineering leaders, investing in strong JavaScript fundamentals (rather than framework‑only knowledge) makes teams more resilient to tool churn and better able to evaluate new frontend technologies as they emerge.',
      techSlug: 'javascript-developers',
      note:
        'Out of alphabetical order on the live page: it appears after "Vector Database" and "Version Control". Source order is preserved here; the generator sorts, which fixes it.',
    },
  ],
};
