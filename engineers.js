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
 *                    (matches folder names under /technologies/)
 *
 * Build scripts call getEngineersForRole() or getEngineersForTech() to pull
 * the right engineers for each page. The same person and photo are reused so
 * visitors who visit both a role page and a technology page see a consistent
 * roster.
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
 *   react | react-fintech   (add more as technology pages are created)
 */

const ENGINEERS = [

  // ─── FRONT-END ──────────────────────────────────────────────────────────────
  {
    id: "agustin-c",
    firstName: "Agustin",
    lastInitial: "C",
    roleTitle: "Front-End Engineer",
    roles: ["front-end-engineers", "full-stack-engineers"],
    technologies: ["react", "react-fintech"],
    skills: ["React", "TypeScript", "Next.js", "CSS", "Accessibility"],
  },
  {
    id: "carolina-m",
    firstName: "Carolina",
    lastInitial: "M",
    roleTitle: "Front-End Engineer",
    roles: ["front-end-engineers"],
    technologies: ["react"],
    skills: ["React", "TypeScript", "Responsive Design", "UX Patterns", "Design Systems"],
  },
  {
    id: "mateo-f",
    firstName: "Mateo",
    lastInitial: "F",
    roleTitle: "Front-End Engineer",
    roles: ["front-end-engineers", "mobile-engineers"],
    technologies: ["react"],
    skills: ["Vue.js", "TypeScript", "Node.js", "GraphQL", "Tailwind CSS"],
  },

  // ─── BACK-END ───────────────────────────────────────────────────────────────
  {
    id: "andres-v",
    firstName: "Andres",
    lastInitial: "V",
    roleTitle: "Back-End Engineer",
    roles: ["back-end-engineers", "full-stack-engineers"],
    technologies: [],
    skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "AWS", "Docker"],
  },
  {
    id: "camilo-h",
    firstName: "Camilo",
    lastInitial: "H",
    roleTitle: "Back-End Engineer",
    roles: ["back-end-engineers"],
    technologies: [],
    skills: ["Node.js", "TypeScript", "GraphQL", "MongoDB", "Kafka", "GCP"],
  },
  {
    id: "martin-s",
    firstName: "Martin",
    lastInitial: "S",
    roleTitle: "Back-End Engineer",
    roles: ["back-end-engineers", "data-engineers"],
    technologies: [],
    skills: ["Java", "Spring Boot", "MySQL", "RabbitMQ", "Kubernetes", "REST"],
  },

  // ─── FULL-STACK ─────────────────────────────────────────────────────────────
  {
    id: "lucas-f",
    firstName: "Lucas",
    lastInitial: "F",
    roleTitle: "Full-Stack Engineer",
    roles: ["full-stack-engineers"],
    technologies: ["react"],
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"],
  },
  {
    id: "marina-g",
    firstName: "Marina",
    lastInitial: "G",
    roleTitle: "Full-Stack Engineer",
    roles: ["full-stack-engineers"],
    technologies: [],
    skills: ["Next.js", "GraphQL", "MongoDB", "Tailwind CSS", "Vercel"],
  },
  {
    id: "jorge-c",
    firstName: "Jorge",
    lastInitial: "C",
    roleTitle: "Full-Stack Engineer",
    roles: ["full-stack-engineers", "back-end-engineers"],
    technologies: [],
    skills: ["React", "Python", "Django", "PostgreSQL", "Redis", "GCP"],
  },

  // ─── MOBILE ─────────────────────────────────────────────────────────────────
  {
    id: "camila-c",
    firstName: "Camila",
    lastInitial: "C",
    roleTitle: "Mobile Engineer",
    roles: ["mobile-engineers"],
    technologies: [],
    skills: ["React Native", "TypeScript", "iOS", "Android", "Expo", "Redux"],
  },
  {
    id: "david-r",
    firstName: "David",
    lastInitial: "R",
    roleTitle: "Mobile Engineer",
    roles: ["mobile-engineers"],
    technologies: [],
    skills: ["Swift", "iOS", "Xcode", "REST APIs", "Core Data", "CI/CD"],
  },
  {
    id: "sofia-j",
    firstName: "Sofia",
    lastInitial: "J",
    roleTitle: "Mobile Engineer",
    roles: ["mobile-engineers", "front-end-engineers"],
    technologies: [],
    skills: ["Flutter", "Dart", "Firebase", "iOS", "Android", "Figma"],
  },

  // ─── DEVOPS ─────────────────────────────────────────────────────────────────
  {
    id: "nicolas-r",
    firstName: "Nicolas",
    lastInitial: "R",
    roleTitle: "DevOps Engineer",
    roles: ["devops-engineers"],
    technologies: [],
    skills: ["Kubernetes", "Terraform", "AWS", "Docker", "CI/CD", "Helm"],
  },
  {
    id: "mariano-l",
    firstName: "Mariano",
    lastInitial: "L",
    roleTitle: "DevOps Engineer",
    roles: ["devops-engineers"],
    technologies: [],
    skills: ["GCP", "Ansible", "GitHub Actions", "Docker", "Prometheus", "Grafana"],
  },
  {
    id: "victor-m",
    firstName: "Victor",
    lastInitial: "M",
    roleTitle: "DevOps Engineer",
    roles: ["devops-engineers", "back-end-engineers"],
    technologies: [],
    skills: ["Azure", "Terraform", "Kubernetes", "Python", "Bash", "Datadog"],
  },

  // ─── DATA ENGINEERS ─────────────────────────────────────────────────────────
  {
    id: "joao-carlos-s",
    firstName: "Joao Carlos",
    lastInitial: "S",
    roleTitle: "Data Engineer",
    roles: ["data-engineers", "data-science-engineers"],
    technologies: [],
    skills: ["Python", "Spark", "Airflow", "Snowflake", "dbt", "AWS Glue"],
  },
  {
    id: "paulo-g",
    firstName: "Paulo",
    lastInitial: "G",
    roleTitle: "Data Engineer",
    roles: ["data-engineers"],
    technologies: [],
    skills: ["SQL", "BigQuery", "Kafka", "dbt", "Looker", "Terraform"],
  },
  {
    id: "matias-d",
    firstName: "Matias",
    lastInitial: "D",
    roleTitle: "Data Engineer",
    roles: ["data-engineers", "ai-engineers"],
    technologies: [],
    skills: ["Python", "Databricks", "PySpark", "Azure", "Delta Lake", "MLflow"],
  },

  // ─── DATA SCIENCE ───────────────────────────────────────────────────────────
  {
    id: "maria-y",
    firstName: "Maria",
    lastInitial: "Y",
    roleTitle: "Data Science Engineer",
    roles: ["data-science-engineers", "ai-engineers"],
    technologies: [],
    skills: ["Python", "Pandas", "Scikit-learn", "TensorFlow", "SQL", "Tableau"],
  },
  {
    id: "samuel-h",
    firstName: "Samuel",
    lastInitial: "H",
    roleTitle: "Data Science Engineer",
    roles: ["data-science-engineers"],
    technologies: [],
    skills: ["R", "Python", "PyTorch", "NLP", "Statistics", "AWS SageMaker"],
  },
  {
    id: "agustin-g",
    firstName: "Agustin",
    lastInitial: "G",
    roleTitle: "Data Science Engineer",
    roles: ["data-science-engineers", "data-engineers"],
    technologies: [],
    skills: ["Python", "LangChain", "OpenAI API", "RAG", "Vector DBs", "Kafka"],
  },

  // ─── AI ENGINEERS ───────────────────────────────────────────────────────────
  {
    id: "javier-f",
    firstName: "Javier",
    lastInitial: "F",
    roleTitle: "AI Engineer",
    roles: ["ai-engineers"],
    technologies: [],
    skills: ["Python", "LangChain", "OpenAI API", "Pinecone", "FastAPI", "AWS"],
  },
  {
    id: "sofia-r",
    firstName: "Sofia",
    lastInitial: "R",
    roleTitle: "AI Engineer",
    roles: ["ai-engineers", "data-science-engineers"],
    technologies: [],
    skills: ["PyTorch", "Transformers", "RAG", "LLM Fine-tuning", "MLflow", "GCP"],
  },
  {
    id: "ethan-c",
    firstName: "Ethan",
    lastInitial: "C",
    roleTitle: "AI Engineer",
    roles: ["ai-engineers", "back-end-engineers"],
    technologies: [],
    skills: ["Python", "OpenAI API", "LangGraph", "Docker", "PostgreSQL", "Redis"],
  },

  // ─── QA ENGINEERS ───────────────────────────────────────────────────────────
  {
    id: "camilo-r",
    firstName: "Camilo",
    lastInitial: "R",
    roleTitle: "QA Engineer",
    roles: ["qa-engineers"],
    technologies: [],
    skills: ["Cypress", "Playwright", "TypeScript", "CI/CD", "Jest", "API Testing"],
  },
  {
    id: "jose-f",
    firstName: "Jose",
    lastInitial: "F",
    roleTitle: "QA Engineer",
    roles: ["qa-engineers"],
    technologies: [],
    skills: ["Selenium", "Python", "BDD", "JIRA", "Performance Testing", "Postman"],
  },
  {
    id: "hugo-j",
    firstName: "Hugo",
    lastInitial: "J",
    roleTitle: "QA Engineer",
    roles: ["qa-engineers", "devops-engineers"],
    technologies: [],
    skills: ["Playwright", "GitHub Actions", "Docker", "Load Testing", "Monitoring"],
  },

  // ─── BLOCKCHAIN ─────────────────────────────────────────────────────────────
  {
    id: "renato-c",
    firstName: "Renato",
    lastInitial: "C",
    roleTitle: "Blockchain Engineer",
    roles: ["blockchain-engineers"],
    technologies: [],
    skills: ["Solidity", "Ethereum", "Hardhat", "TypeScript", "Web3.js", "IPFS"],
  },
  {
    id: "juan-cruz-m",
    firstName: "Juan Cruz",
    lastInitial: "M",
    roleTitle: "Blockchain Engineer",
    roles: ["blockchain-engineers", "back-end-engineers"],
    technologies: [],
    skills: ["Rust", "Solana", "Anchor", "TypeScript", "Node.js", "AWS"],
  },
  {
    id: "diego-r",
    firstName: "Diego",
    lastInitial: "R",
    roleTitle: "Blockchain Engineer",
    roles: ["blockchain-engineers"],
    technologies: [],
    skills: ["Solidity", "DeFi", "Smart Contracts", "Foundry", "React", "GraphQL"],
  },

  // ─── UNASSIGNED (available for new pages) ───────────────────────────────────
  {
    id: "santiago-f",
    firstName: "Santiago",
    lastInitial: "F",
    roleTitle: "Full-Stack Engineer",
    roles: [],
    technologies: [],
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
 * @param {string} techSlug  e.g. "react"
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
