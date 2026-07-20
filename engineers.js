/**
 * engineers.js
 *
 * Central registry of all BetterEngineer engineer personas.
 *
 * HOW TO ADD AN ENGINEER
 * ----------------------
 * 1. Rename their photo to lowercase-firstname-lastinitial.png  (e.g. sarah-m.png)
 *    Compound first names use hyphens: joao-carlos-s.png
 * 2. Drop the photo into /images/engineers/
 * 3. Add an entry to the ENGINEERS array below following the existing pattern.
 *
 * HOW ENGINEERS ARE REUSED ACROSS PAGES
 * --------------------------------------
 * - `roles`        : role page slugs this engineer appears on
 *                    (matches folder names under /roles/)
 * - `technologies` : technology page slugs this engineer appears on
 *                    (matches folder names under /technologies/, "{tech}-developers"
 *                    convention)
 *
 * Build scripts call getEngineersForRole() or getEngineersForTech() to pull
 * the right engineers for each page. The same person and photo are reused so
 * visitors who visit both a role page and a technology page see a consistent
 * roster. build-tech-pages.js additionally falls back to skill/primaryStack
 * overlap (with repetition balancing) when `technologies[]` alone would not
 * produce 3 matches for a given tech page.
 *
 * ROLE SLUGS
 * ----------
 *   front-end-engineers | back-end-engineers | full-stack-engineers
 *   mobile-engineers    | devops-engineers   | data-engineers
 *   data-science-engineers | ai-engineers    | qa-engineers
 *   blockchain-engineers
 *
 * TECHNOLOGY SLUGS
 * ----------------
 *   {tech}-developers, e.g. python-developers, react-developers, aws-developers
 *   (add more as technology pages are created)
 */

const ENGINEERS = [

  // ─── FRONT-END ──────────────────────────────────────────────────────────────
  {
    id: "agustin-c",
    firstName: "Agustin",
    lastInitial: "C",
    roleTitle: "Front-End Engineer",
    seniority: "Senior",
    yearsExperience: 8,
    verified: true,
    roles: ["front-end-engineers", "full-stack-engineers"],
    technologies: ["react-developers", "nextjs-developers", "typescript-developers"],
    primaryStack: ["React", "TypeScript", "Next.js"],
    skills: ["React", "TypeScript", "Next.js", "CSS", "Accessibility"],
  },
  {
    id: "carolina-m",
    firstName: "Carolina",
    lastInitial: "M",
    roleTitle: "Front-End Engineer",
    seniority: "Senior",
    yearsExperience: 7,
    verified: true,
    roles: ["front-end-engineers"],
    technologies: ["react-developers", "typescript-developers"],
    primaryStack: ["React", "TypeScript", "Design Systems"],
    skills: ["React", "TypeScript", "Responsive Design", "UX Patterns", "Design Systems"],
  },
  {
    id: "mateo-f",
    firstName: "Mateo",
    lastInitial: "F",
    roleTitle: "Front-End Engineer",
    seniority: "Senior",
    yearsExperience: 6,
    verified: true,
    roles: ["front-end-engineers", "mobile-engineers"],
    technologies: ["vuejs-developers", "typescript-developers", "nodejs-developers"],
    primaryStack: ["Vue.js", "TypeScript", "Node.js"],
    skills: ["Vue.js", "TypeScript", "Node.js", "GraphQL", "Tailwind CSS"],
  },

  // ─── BACK-END ───────────────────────────────────────────────────────────────
  {
    id: "andres-v",
    firstName: "Andres",
    lastInitial: "V",
    roleTitle: "Back-End Engineer",
    seniority: "Senior",
    yearsExperience: 8,
    verified: true,
    roles: ["back-end-engineers", "full-stack-engineers"],
    technologies: ["python-developers", "fastapi-developers", "postgresql-developers", "aws-developers"],
    primaryStack: ["Python", "FastAPI", "PostgreSQL"],
    skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "AWS", "Docker"],
  },
  {
    id: "camilo-h",
    firstName: "Camilo",
    lastInitial: "H",
    roleTitle: "Back-End Engineer",
    seniority: "Senior",
    yearsExperience: 7,
    verified: true,
    roles: ["back-end-engineers"],
    technologies: ["nodejs-developers", "typescript-developers", "mongodb-developers", "google-cloud-developers"],
    primaryStack: ["Node.js", "TypeScript", "MongoDB"],
    skills: ["Node.js", "TypeScript", "GraphQL", "MongoDB", "Kafka", "GCP"],
  },
  {
    id: "martin-s",
    firstName: "Martin",
    lastInitial: "S",
    roleTitle: "Back-End Engineer",
    seniority: "Senior",
    yearsExperience: 9,
    verified: true,
    roles: ["back-end-engineers", "data-engineers"],
    technologies: ["java-developers", "spring-boot-developers", "mysql-developers", "kubernetes-developers"],
    primaryStack: ["Java", "Spring Boot", "MySQL"],
    skills: ["Java", "Spring Boot", "MySQL", "RabbitMQ", "Kubernetes", "REST"],
  },

  // ─── FULL-STACK ─────────────────────────────────────────────────────────────
  {
    id: "lucas-f",
    firstName: "Lucas",
    lastInitial: "F",
    roleTitle: "Full-Stack Engineer",
    seniority: "Senior",
    yearsExperience: 8,
    verified: true,
    roles: ["full-stack-engineers"],
    technologies: ["react-developers", "nodejs-developers", "typescript-developers", "postgresql-developers", "aws-developers"],
    primaryStack: ["React", "Node.js", "TypeScript"],
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"],
  },
  {
    id: "marina-g",
    firstName: "Marina",
    lastInitial: "G",
    roleTitle: "Full-Stack Engineer",
    seniority: "Senior",
    yearsExperience: 6,
    verified: true,
    roles: ["full-stack-engineers"],
    technologies: ["nextjs-developers", "mongodb-developers"],
    primaryStack: ["Next.js", "GraphQL", "MongoDB"],
    skills: ["Next.js", "GraphQL", "MongoDB", "Tailwind CSS", "Vercel"],
  },
  {
    id: "jorge-c",
    firstName: "Jorge",
    lastInitial: "C",
    roleTitle: "Full-Stack Engineer",
    seniority: "Senior",
    yearsExperience: 9,
    verified: true,
    roles: ["full-stack-engineers", "back-end-engineers"],
    technologies: ["react-developers", "python-developers", "django-developers", "postgresql-developers", "google-cloud-developers"],
    primaryStack: ["Python", "Django", "React"],
    skills: ["React", "Python", "Django", "PostgreSQL", "Redis", "GCP"],
  },

  // ─── MOBILE ─────────────────────────────────────────────────────────────────
  {
    id: "camila-c",
    firstName: "Camila",
    lastInitial: "C",
    roleTitle: "Mobile Engineer",
    seniority: "Senior",
    yearsExperience: 7,
    verified: true,
    roles: ["mobile-engineers"],
    technologies: ["react-native-developers", "typescript-developers", "ios-developers", "android-developers"],
    primaryStack: ["React Native", "TypeScript", "Redux"],
    skills: ["React Native", "TypeScript", "iOS", "Android", "Expo", "Redux"],
  },
  {
    id: "david-r",
    firstName: "David",
    lastInitial: "R",
    roleTitle: "Mobile Engineer",
    seniority: "Senior",
    yearsExperience: 8,
    verified: true,
    roles: ["mobile-engineers"],
    technologies: ["swift-developers", "ios-developers"],
    primaryStack: ["Swift", "iOS", "Xcode"],
    skills: ["Swift", "iOS", "Xcode", "REST APIs", "Core Data", "CI/CD"],
  },
  {
    id: "sofia-j",
    firstName: "Sofia",
    lastInitial: "J",
    roleTitle: "Mobile Engineer",
    seniority: "Senior",
    yearsExperience: 6,
    verified: true,
    roles: ["mobile-engineers", "front-end-engineers"],
    technologies: ["flutter-developers", "ios-developers", "android-developers"],
    primaryStack: ["Flutter", "Dart", "Firebase"],
    skills: ["Flutter", "Dart", "Firebase", "iOS", "Android", "Figma"],
  },

  // ─── DEVOPS ─────────────────────────────────────────────────────────────────
  {
    id: "nicolas-r",
    firstName: "Nicolas",
    lastInitial: "R",
    roleTitle: "DevOps Engineer",
    seniority: "Senior",
    yearsExperience: 9,
    verified: true,
    roles: ["devops-engineers"],
    technologies: ["kubernetes-developers", "terraform-developers", "aws-developers"],
    primaryStack: ["Kubernetes", "Terraform", "AWS"],
    skills: ["Kubernetes", "Terraform", "AWS", "Docker", "CI/CD", "Helm"],
  },
  {
    id: "mariano-l",
    firstName: "Mariano",
    lastInitial: "L",
    roleTitle: "DevOps Engineer",
    seniority: "Senior",
    yearsExperience: 7,
    verified: true,
    roles: ["devops-engineers"],
    technologies: ["google-cloud-developers"],
    primaryStack: ["Google Cloud", "Docker", "Ansible"],
    skills: ["GCP", "Ansible", "GitHub Actions", "Docker", "Prometheus", "Grafana"],
  },
  {
    id: "victor-m",
    firstName: "Victor",
    lastInitial: "M",
    roleTitle: "DevOps Engineer",
    seniority: "Senior",
    yearsExperience: 10,
    verified: true,
    roles: ["devops-engineers", "back-end-engineers"],
    technologies: ["azure-developers", "terraform-developers", "kubernetes-developers", "python-developers"],
    primaryStack: ["Azure", "Terraform", "Kubernetes"],
    skills: ["Azure", "Terraform", "Kubernetes", "Python", "Bash", "Datadog"],
  },

  // ─── DATA ENGINEERS ─────────────────────────────────────────────────────────
  {
    id: "joao-carlos-s",
    firstName: "Joao Carlos",
    lastInitial: "S",
    roleTitle: "Data Engineer",
    seniority: "Senior",
    yearsExperience: 8,
    verified: true,
    roles: ["data-engineers", "data-science-engineers"],
    technologies: ["python-developers", "apache-spark-developers", "snowflake-developers", "aws-developers"],
    primaryStack: ["Python", "Spark", "Airflow"],
    skills: ["Python", "Spark", "Airflow", "Snowflake", "dbt", "AWS Glue"],
  },
  {
    id: "paulo-g",
    firstName: "Paulo",
    lastInitial: "G",
    roleTitle: "Data Engineer",
    seniority: "Senior",
    yearsExperience: 6,
    verified: true,
    roles: ["data-engineers"],
    technologies: ["apache-kafka-developers", "terraform-developers"],
    primaryStack: ["SQL", "BigQuery", "Kafka"],
    skills: ["SQL", "BigQuery", "Kafka", "dbt", "Looker", "Terraform"],
  },
  {
    id: "matias-d",
    firstName: "Matias",
    lastInitial: "D",
    roleTitle: "Data Engineer",
    seniority: "Senior",
    yearsExperience: 7,
    verified: true,
    roles: ["data-engineers", "ai-engineers"],
    technologies: ["python-developers", "databricks-developers", "azure-developers", "apache-spark-developers"],
    primaryStack: ["Python", "Databricks", "PySpark"],
    skills: ["Python", "Databricks", "PySpark", "Azure", "Delta Lake", "MLflow"],
  },

  // ─── DATA SCIENCE ───────────────────────────────────────────────────────────
  {
    id: "maria-y",
    firstName: "Maria",
    lastInitial: "Y",
    roleTitle: "Data Science Engineer",
    seniority: "Senior",
    yearsExperience: 7,
    verified: true,
    roles: ["data-science-engineers", "ai-engineers"],
    technologies: ["python-developers", "scikit-learn-developers", "tensorflow-developers"],
    primaryStack: ["Python", "TensorFlow", "Scikit-learn"],
    skills: ["Python", "Pandas", "Scikit-learn", "TensorFlow", "SQL", "Tableau"],
  },
  {
    id: "samuel-h",
    firstName: "Samuel",
    lastInitial: "H",
    roleTitle: "Data Science Engineer",
    seniority: "Senior",
    yearsExperience: 8,
    verified: true,
    roles: ["data-science-engineers"],
    technologies: ["python-developers", "pytorch-developers", "aws-developers"],
    primaryStack: ["Python", "PyTorch", "AWS"],
    skills: ["R", "Python", "PyTorch", "NLP", "Statistics", "AWS SageMaker"],
  },
  {
    id: "agustin-g",
    firstName: "Agustin",
    lastInitial: "G",
    roleTitle: "Data Science Engineer",
    seniority: "Senior",
    yearsExperience: 6,
    verified: true,
    roles: ["data-science-engineers", "data-engineers"],
    technologies: ["python-developers", "langchain-developers", "openai-api-developers", "apache-kafka-developers"],
    primaryStack: ["Python", "LangChain", "OpenAI API"],
    skills: ["Python", "LangChain", "OpenAI API", "RAG", "Vector DBs", "Kafka"],
  },

  // ─── AI ENGINEERS ───────────────────────────────────────────────────────────
  {
    id: "javier-f",
    firstName: "Javier",
    lastInitial: "F",
    roleTitle: "AI Engineer",
    seniority: "Senior",
    yearsExperience: 7,
    verified: true,
    roles: ["ai-engineers"],
    technologies: ["python-developers", "langchain-developers", "openai-api-developers", "fastapi-developers", "aws-developers"],
    primaryStack: ["Python", "LangChain", "FastAPI"],
    skills: ["Python", "LangChain", "OpenAI API", "Pinecone", "FastAPI", "AWS"],
  },
  {
    id: "sofia-r",
    firstName: "Sofia",
    lastInitial: "R",
    roleTitle: "AI Engineer",
    seniority: "Senior",
    yearsExperience: 8,
    verified: true,
    roles: ["ai-engineers", "data-science-engineers"],
    technologies: ["pytorch-developers", "google-cloud-developers"],
    primaryStack: ["PyTorch", "Transformers", "GCP"],
    skills: ["PyTorch", "Transformers", "RAG", "LLM Fine-tuning", "MLflow", "GCP"],
  },
  {
    id: "ethan-c",
    firstName: "Ethan",
    lastInitial: "C",
    roleTitle: "AI Engineer",
    seniority: "Senior",
    yearsExperience: 6,
    verified: true,
    roles: ["ai-engineers", "back-end-engineers"],
    technologies: ["python-developers", "openai-api-developers", "postgresql-developers"],
    primaryStack: ["Python", "OpenAI API", "PostgreSQL"],
    skills: ["Python", "OpenAI API", "LangGraph", "Docker", "PostgreSQL", "Redis"],
  },

  // ─── QA ENGINEERS ───────────────────────────────────────────────────────────
  {
    id: "camilo-r",
    firstName: "Camilo",
    lastInitial: "R",
    roleTitle: "QA Engineer",
    seniority: "Senior",
    yearsExperience: 6,
    verified: true,
    roles: ["qa-engineers"],
    technologies: ["typescript-developers"],
    primaryStack: ["Cypress", "Playwright", "TypeScript"],
    skills: ["Cypress", "Playwright", "TypeScript", "CI/CD", "Jest", "API Testing"],
  },
  {
    id: "jose-f",
    firstName: "Jose",
    lastInitial: "F",
    roleTitle: "QA Engineer",
    seniority: "Senior",
    yearsExperience: 7,
    verified: true,
    roles: ["qa-engineers"],
    technologies: ["python-developers"],
    primaryStack: ["Python", "Selenium", "BDD"],
    skills: ["Selenium", "Python", "BDD", "JIRA", "Performance Testing", "Postman"],
  },
  {
    id: "hugo-j",
    firstName: "Hugo",
    lastInitial: "J",
    roleTitle: "QA Engineer",
    seniority: "Senior",
    yearsExperience: 6,
    verified: true,
    roles: ["qa-engineers", "devops-engineers"],
    technologies: [],
    primaryStack: ["Playwright", "Docker", "GitHub Actions"],
    skills: ["Playwright", "GitHub Actions", "Docker", "Load Testing", "Monitoring"],
  },

  // ─── BLOCKCHAIN ─────────────────────────────────────────────────────────────
  {
    id: "renato-c",
    firstName: "Renato",
    lastInitial: "C",
    roleTitle: "Blockchain Engineer",
    seniority: "Senior",
    yearsExperience: 6,
    verified: true,
    roles: ["blockchain-engineers"],
    technologies: ["typescript-developers"],
    primaryStack: ["Solidity", "Ethereum", "Web3.js"],
    skills: ["Solidity", "Ethereum", "Hardhat", "TypeScript", "Web3.js", "IPFS"],
  },
  {
    id: "juan-cruz-m",
    firstName: "Juan Cruz",
    lastInitial: "M",
    roleTitle: "Blockchain Engineer",
    seniority: "Senior",
    yearsExperience: 7,
    verified: true,
    roles: ["blockchain-engineers", "back-end-engineers"],
    technologies: ["rust-developers", "typescript-developers", "nodejs-developers", "aws-developers"],
    primaryStack: ["Rust", "Solana", "TypeScript"],
    skills: ["Rust", "Solana", "Anchor", "TypeScript", "Node.js", "AWS"],
  },
  {
    id: "diego-r",
    firstName: "Diego",
    lastInitial: "R",
    roleTitle: "Blockchain Engineer",
    seniority: "Senior",
    yearsExperience: 8,
    verified: true,
    roles: ["blockchain-engineers"],
    technologies: ["react-developers"],
    primaryStack: ["Solidity", "Smart Contracts", "React"],
    skills: ["Solidity", "DeFi", "Smart Contracts", "Foundry", "React", "GraphQL"],
  },

  // ─── UNASSIGNED (available for new pages) ───────────────────────────────────
  {
    id: "santiago-f",
    firstName: "Santiago",
    lastInitial: "F",
    roleTitle: "Full-Stack Engineer",
    seniority: "Senior",
    yearsExperience: 7,
    verified: true,
    roles: [],
    technologies: ["react-developers", "nodejs-developers", "typescript-developers", "postgresql-developers", "aws-developers"],
    primaryStack: ["React", "Node.js", "TypeScript"],
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS"],
  },

];

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────

/**
 * Returns engineers assigned to a given role page slug.
 * @param {string} roleSlug  e.g. "front-end-engineers"
 * @returns {object[]}
 */
function getEngineersForRole(roleSlug) {
  return ENGINEERS.filter(e => e.roles.includes(roleSlug));
}

/**
 * Returns engineers assigned to a given technology page slug.
 * @param {string} techSlug  e.g. "python-developers"
 * @returns {object[]}
 */
function getEngineersForTech(techSlug) {
  return ENGINEERS.filter(e => e.technologies && e.technologies.includes(techSlug));
}

/**
 * Returns the resolved photo path for an engineer.
 * @param {object} engineer
 * @returns {string}
 */
function getEngineerPhoto(engineer) {
  return `/images/engineers/${engineer.id}.png`;
}

/**
 * Returns the display name shown on cards: "First L."
 * @param {object} engineer
 * @returns {string}
 */
function getEngineerDisplayName(engineer) {
  return `${engineer.firstName} ${engineer.lastInitial}.`;
}

module.exports = {
  ENGINEERS,
  getEngineersForRole,
  getEngineersForTech,
  getEngineerPhoto,
  getEngineerDisplayName,
};
