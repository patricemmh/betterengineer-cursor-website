/**
 * Role, skill, seniority, AI fluency, and company-stage taxonomy
 * for the find-an-engineer prototype.
 *
 * Roles are derived from engineers.js role slugs and the technologies
 * BetterEngineer already publishes. Add a role here to extend search
 * and the wizard without touching the UI.
 */
(function (root) {
  "use strict";

  var SKILLS = [
    { id: "react", label: "React", aliases: ["reactjs", "react.js"] },
    { id: "nodejs", label: "Node.js", aliases: ["node", "node.js", "nodejs"] },
    { id: "typescript", label: "TypeScript", aliases: ["ts"] },
    { id: "javascript", label: "JavaScript", aliases: ["js"] },
    { id: "nextjs", label: "Next.js", aliases: ["next", "next.js", "nextjs"] },
    { id: "postgresql", label: "PostgreSQL", aliases: ["postgres", "postgre", "psql"] },
    { id: "rest", label: "REST APIs", aliases: ["rest", "rest api", "rest apis", "restful"] },
    { id: "graphql", label: "GraphQL", aliases: ["graph ql"] },
    { id: "aws", label: "AWS", aliases: ["amazon web services"] },
    { id: "python", label: "Python", aliases: [] },
    { id: "django", label: "Django", aliases: [] },
    { id: "fastapi", label: "FastAPI", aliases: ["fast api"] },
    { id: "mongodb", label: "MongoDB", aliases: ["mongo"] },
    { id: "docker", label: "Docker", aliases: [] },
    { id: "kubernetes", label: "Kubernetes", aliases: ["k8s"] },
    { id: "java", label: "Java", aliases: [] },
    { id: "spring", label: "Spring Boot", aliases: ["spring", "springboot", "spring boot"] },
    { id: "dotnet", label: ".NET", aliases: ["dotnet", "c#", "csharp", ".net", "c sharp"] },
    { id: "azure", label: "Azure", aliases: ["microsoft azure"] },
    { id: "sqlserver", label: "SQL Server", aliases: ["mssql", "sql server", "ms sql"] },
    { id: "sql", label: "SQL", aliases: [] },
    { id: "reactnative", label: "React Native", aliases: ["react-native", "react native"] },
    { id: "swift", label: "Swift", aliases: [] },
    { id: "ios", label: "iOS", aliases: ["ios"] },
    { id: "android", label: "Android", aliases: [] },
    { id: "kotlin", label: "Kotlin", aliases: [] },
    { id: "flutter", label: "Flutter", aliases: [] },
    { id: "dart", label: "Dart", aliases: [] },
    { id: "terraform", label: "Terraform", aliases: [] },
    { id: "gcp", label: "Google Cloud", aliases: ["gcp", "google cloud", "google cloud platform"] },
    { id: "spark", label: "Spark", aliases: ["pyspark", "apache spark"] },
    { id: "airflow", label: "Airflow", aliases: [] },
    { id: "snowflake", label: "Snowflake", aliases: [] },
    { id: "dbt", label: "dbt", aliases: [] },
    { id: "pytorch", label: "PyTorch", aliases: ["pytorch"] },
    { id: "tensorflow", label: "TensorFlow", aliases: ["tensorflow"] },
    { id: "langchain", label: "LangChain", aliases: ["langchain"] },
    { id: "openai", label: "OpenAI API", aliases: ["openai", "openai api"] },
    { id: "cypress", label: "Cypress", aliases: [] },
    { id: "playwright", label: "Playwright", aliases: [] },
    { id: "solidity", label: "Solidity", aliases: [] },
    { id: "ethereum", label: "Ethereum", aliases: [] },
    { id: "rust", label: "Rust", aliases: [] },
    { id: "solana", label: "Solana", aliases: [] },
    { id: "vue", label: "Vue.js", aliases: ["vue", "vuejs", "vue.js"] },
    { id: "css", label: "CSS", aliases: ["css3"] },
    { id: "redis", label: "Redis", aliases: [] },
    { id: "kafka", label: "Kafka", aliases: ["apache kafka"] },
    { id: "pandas", label: "Pandas", aliases: [] },
    { id: "bigquery", label: "BigQuery", aliases: ["big query"] },
    { id: "cicd", label: "CI/CD", aliases: ["ci/cd", "cicd", "github actions"] },
    { id: "selenium", label: "Selenium", aliases: [] },
    { id: "tailwind", label: "Tailwind CSS", aliases: ["tailwind", "tailwindcss"] },
    { id: "mysql", label: "MySQL", aliases: ["my sql"] },
    { id: "machinelearning", label: "Machine Learning", aliases: ["ml", "machine learning"] },
    { id: "accessibility", label: "Accessibility", aliases: ["a11y"] },
    { id: "redux", label: "Redux", aliases: [] },
    { id: "firebase", label: "Firebase", aliases: [] },
    { id: "figma", label: "Figma", aliases: [] },
    { id: "rag", label: "RAG", aliases: [] }
  ];

  var ROLES = [
    { id: "full-stack-developer", label: "Full Stack Developer", category: "full-stack-engineers", alsoCategories: [], anchor: null, aliases: ["full stack", "fullstack", "full-stack", "full stack engineer", "full-stack engineer", "mern", "mern developer"], searchTerms: ["react", "node", "javascript", "typescript", "next.js", "graphql", "postgres"], skills: ["react", "nodejs", "typescript", "javascript", "nextjs", "postgresql", "rest", "graphql", "aws"] },
    { id: "frontend-developer", label: "Frontend Developer", category: "front-end-engineers", alsoCategories: [], anchor: null, aliases: ["front end", "front-end", "frontend", "front end developer", "front-end engineer", "ui engineer"], searchTerms: ["react", "vue", "css", "typescript", "javascript", "next.js"], skills: ["react", "typescript", "javascript", "nextjs", "css", "vue", "graphql"] },
    { id: "backend-developer", label: "Backend Developer", category: "back-end-engineers", alsoCategories: [], anchor: null, aliases: ["back end", "back-end", "backend", "backend engineer", "back end developer", "api developer"], searchTerms: ["node", "python", "java", "postgres", "django", "api"], skills: ["nodejs", "python", "java", "postgresql", "rest", "graphql", "aws", "docker"] },
    { id: "react-developer", label: "React Developer", category: "front-end-engineers", alsoCategories: ["full-stack-engineers"], anchor: "react", aliases: ["react", "react.js", "reactjs", "react engineer", "react developer"], searchTerms: ["react", "frontend", "javascript"], skills: ["react", "typescript", "javascript", "nextjs", "css", "graphql"] },
    { id: "nodejs-developer", label: "Node.js Developer", category: "back-end-engineers", alsoCategories: ["full-stack-engineers"], anchor: "nodejs", aliases: ["node", "node.js", "nodejs", "node developer", "node.js developer", "node engineer"], searchTerms: ["node", "javascript", "backend"], skills: ["nodejs", "typescript", "javascript", "postgresql", "rest", "graphql", "aws", "docker"] },
    { id: "python-developer", label: "Python Developer", category: "back-end-engineers", alsoCategories: ["data-engineers", "ai-engineers", "data-science-engineers"], anchor: "python", aliases: ["python", "python engineer", "python developer"], searchTerms: ["python", "django", "fastapi"], skills: ["python", "django", "fastapi", "postgresql", "aws", "docker"] },
    { id: "dotnet-developer", label: ".NET Developer", category: "back-end-engineers", alsoCategories: [], anchor: "dotnet", aliases: [".net", "dotnet", "c#", "c# developer", "csharp", ".net developer", ".net engineer"], searchTerms: [".net", "c#", "azure", "sql server"], skills: ["dotnet", "azure", "sqlserver", "sql", "rest"] },
    { id: "java-developer", label: "Java Developer", category: "back-end-engineers", alsoCategories: [], anchor: "java", aliases: ["java", "java engineer", "spring", "spring boot", "spring boot developer"], searchTerms: ["java", "spring"], skills: ["java", "spring", "sql", "rest", "kubernetes"] },
    { id: "django-developer", label: "Django Developer", category: "back-end-engineers", alsoCategories: ["full-stack-engineers"], anchor: "django", aliases: ["django", "django developer"], searchTerms: ["django", "python"], skills: ["python", "django", "postgresql", "react", "redis"] },
    { id: "nextjs-developer", label: "Next.js Developer", category: "front-end-engineers", alsoCategories: ["full-stack-engineers"], anchor: "nextjs", aliases: ["next", "next.js", "nextjs", "next.js developer", "next developer"], searchTerms: ["next", "react"], skills: ["nextjs", "react", "typescript", "graphql"] },
    { id: "typescript-developer", label: "TypeScript Developer", category: "front-end-engineers", alsoCategories: ["full-stack-engineers", "back-end-engineers"], anchor: "typescript", aliases: ["typescript", "ts developer", "typescript developer", "typescript engineer"], searchTerms: ["typescript", "javascript"], skills: ["typescript", "javascript", "react", "nodejs"] },
    { id: "vue-developer", label: "Vue.js Developer", category: "front-end-engineers", alsoCategories: [], anchor: "vue", aliases: ["vue", "vue.js", "vuejs", "vue developer"], searchTerms: ["vue"], skills: ["vue", "typescript", "javascript", "nodejs", "graphql"] },
    { id: "mobile-developer", label: "Mobile Developer", category: "mobile-engineers", alsoCategories: [], anchor: null, aliases: ["mobile", "mobile engineer", "mobile developer", "app developer"], searchTerms: ["ios", "android", "react native", "flutter", "swift"], skills: ["reactnative", "swift", "ios", "android", "flutter", "kotlin"] },
    { id: "react-native-developer", label: "React Native Developer", category: "mobile-engineers", alsoCategories: ["front-end-engineers"], anchor: "reactnative", aliases: ["react native", "react-native", "react native developer", "react native engineer"], searchTerms: ["react native", "mobile"], skills: ["reactnative", "typescript", "ios", "android", "react"] },
    { id: "ios-developer", label: "iOS Developer", category: "mobile-engineers", alsoCategories: [], anchor: "ios", aliases: ["ios", "ios developer", "swift", "swift developer", "iphone developer"], searchTerms: ["ios", "swift"], skills: ["swift", "ios", "rest"] },
    { id: "android-developer", label: "Android Developer", category: "mobile-engineers", alsoCategories: [], anchor: "android", aliases: ["android", "android developer", "kotlin", "kotlin developer"], searchTerms: ["android", "kotlin"], skills: ["android", "kotlin", "java", "rest"] },
    { id: "flutter-developer", label: "Flutter Developer", category: "mobile-engineers", alsoCategories: [], anchor: "flutter", aliases: ["flutter", "flutter developer", "dart", "dart developer"], searchTerms: ["flutter", "dart"], skills: ["flutter", "dart", "ios", "android"] },
    { id: "devops-engineer", label: "DevOps Engineer", category: "devops-engineers", alsoCategories: [], anchor: null, aliases: ["devops", "devops engineer", "sre", "site reliability", "platform engineer", "cloud engineer"], searchTerms: ["kubernetes", "aws", "terraform", "docker", "azure", "gcp"], skills: ["kubernetes", "terraform", "aws", "docker", "azure", "gcp", "cicd"] },
    { id: "data-engineer", label: "Data Engineer", category: "data-engineers", alsoCategories: [], anchor: null, aliases: ["data engineer", "analytics engineer", "etl developer"], searchTerms: ["spark", "sql", "snowflake", "airflow", "dbt", "kafka"], skills: ["python", "sql", "spark", "airflow", "snowflake", "dbt", "aws"] },
    { id: "ai-engineer", label: "AI Engineer", category: "ai-engineers", alsoCategories: ["data-science-engineers"], anchor: null, aliases: ["ai engineer", "ai developer", "llm engineer", "genai", "generative ai"], searchTerms: ["langchain", "openai", "python", "pytorch", "llm"], skills: ["python", "langchain", "openai", "pytorch", "fastapi", "aws"] },
    { id: "machine-learning-engineer", label: "Machine Learning Engineer", category: "ai-engineers", alsoCategories: ["data-science-engineers"], anchor: "machinelearning", aliases: ["machine learning", "machine learning engineer", "ml engineer", "mle"], searchTerms: ["pytorch", "tensorflow", "python", "ml"], skills: ["python", "pytorch", "tensorflow", "machinelearning", "sql", "aws"] },
    { id: "data-scientist", label: "Data Scientist", category: "data-science-engineers", alsoCategories: ["ai-engineers"], anchor: null, aliases: ["data scientist", "data science", "data science engineer"], searchTerms: ["pandas", "python", "statistics"], skills: ["python", "pandas", "sql", "pytorch", "tensorflow"] },
    { id: "qa-engineer", label: "QA Engineer", category: "qa-engineers", alsoCategories: [], anchor: null, aliases: ["qa", "qa engineer", "quality assurance", "test engineer", "sdet", "automation engineer", "qa automation"], searchTerms: ["cypress", "playwright", "selenium", "testing"], skills: ["cypress", "playwright", "typescript", "selenium", "cicd"] },
    { id: "blockchain-engineer", label: "Blockchain Engineer", category: "blockchain-engineers", alsoCategories: [], anchor: null, aliases: ["blockchain", "blockchain engineer", "web3", "web3 engineer", "solidity", "smart contract"], searchTerms: ["solidity", "ethereum", "solana", "rust", "web3"], skills: ["solidity", "ethereum", "rust", "typescript", "react"] }
  ];

  var SENIORITIES = [
    { id: "junior", label: "Junior", years: "0-2 years", description: "Learning the craft with support nearby." },
    { id: "mid", label: "Mid-level", years: "2-5 years", description: "Independent contributor on a product team." },
    { id: "senior", label: "Senior", years: "5-8 years", description: "High technical autonomy.", suggested: true },
    { id: "staff", label: "Staff+", years: "8+ years", description: "Technical leadership and a wider scope." }
  ];

  var FLUENCY_LEVELS = [
    {
      id: "exploring",
      rank: 1,
      level: "Level 1",
      label: "AI exploring",
      description: "Limited experience with AI tools, and not yet using them in the regular workflow. A strong fit for roles that depend less on AI."
    },
    {
      id: "assisted",
      rank: 2,
      level: "Level 2",
      label: "AI assisted",
      description: "Uses AI for specific tasks such as research, code, and debugging, and reviews the output. A common baseline for most teams."
    },
    {
      id: "integrated",
      rank: 3,
      level: "Level 3",
      label: "AI integrated",
      badge: "Most requested",
      suggested: true,
      description: "Works with AI as a thinking partner across the workflow, and checks the output with judgment."
    },
    {
      id: "native",
      rank: 4,
      level: "Level 4",
      label: "AI native",
      tone: "dark",
      description: "Designs AI agents and multi-step pipelines that can run complex workflows on their own."
    }
  ];

  var COMPANY_STAGES = [
    { id: "early", label: "Early stage", description: "High ownership and a fast-changing environment." },
    { id: "growth", label: "Growth stage", description: "Processes are forming and the team is growing." },
    { id: "scaling", label: "Scaling stage", description: "Clear ownership and a faster, more structured pace." },
    { id: "enterprise", label: "Enterprise", description: "Specialized roles, established process, and larger teams." }
  ];

  var POPULAR_ROLE_IDS = [
    "full-stack-developer",
    "frontend-developer",
    "backend-developer",
    "react-developer",
    "python-developer",
    "devops-engineer",
    "ai-engineer",
    "mobile-developer"
  ];

  var aliasToId = {};
  var compactToId = {};

  function compact(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9+#.]/g, "");
  }

  SKILLS.forEach(function (skill) {
    aliasToId[skill.label.toLowerCase()] = skill.id;
    aliasToId[skill.id] = skill.id;
    compactToId[compact(skill.label)] = skill.id;
    compactToId[compact(skill.id)] = skill.id;
    (skill.aliases || []).forEach(function (alias) {
      aliasToId[alias.toLowerCase()] = skill.id;
      compactToId[compact(alias)] = skill.id;
    });
  });

  function canonicalSkill(label) {
    var raw = String(label || "").trim();
    if (!raw) return null;
    var key = raw.toLowerCase();
    if (aliasToId[key]) return aliasToId[key];
    var packed = compact(raw);
    if (compactToId[packed]) return compactToId[packed];
    return "custom:" + packed;
  }

  function skillById(id) {
    for (var i = 0; i < SKILLS.length; i++) {
      if (SKILLS[i].id === id) return SKILLS[i];
    }
    return null;
  }

  function skillLabel(id, customLabels) {
    var known = skillById(id);
    if (known) return known.label;
    if (customLabels && customLabels[id]) return customLabels[id];
    return String(id || "").replace(/^custom:/, "");
  }

  function roleById(id) {
    for (var i = 0; i < ROLES.length; i++) {
      if (ROLES[i].id === id) return ROLES[i];
    }
    return null;
  }

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function norm(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9+#.\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function scoreRole(role, query) {
    var label = norm(role.label);
    var score = 0;
    if (label === query) score += 100;
    else if (label.indexOf(query) === 0) score += 70;
    else if (label.indexOf(query) !== -1) score += 36;

    (role.aliases || []).forEach(function (alias) {
      var a = norm(alias);
      if (!a) return;
      if (a === query) score += 90;
      else if (a.indexOf(query) === 0) score += 48;
      else if (query.indexOf(a) === 0 && a.length >= 3) score += 28;
      else if (a.indexOf(query) !== -1) score += 22;
    });

    (role.searchTerms || []).forEach(function (term) {
      var t = norm(term);
      if (!t) return;
      if (t === query) score += 34;
      else if (t.indexOf(query) === 0 || query.indexOf(t) === 0) score += 20;
      else if (t.indexOf(query) !== -1 || query.indexOf(t) !== -1) score += 12;
    });
    return score;
  }

  function searchRoles(query) {
    var q = norm(query);
    if (!q) {
      return POPULAR_ROLE_IDS.map(roleById).filter(Boolean);
    }
    return ROLES.map(function (role) {
      return { role: role, score: scoreRole(role, q) };
    })
      .filter(function (item) { return item.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 8)
      .map(function (item) { return item.role; });
  }

  function exactRole(query) {
    var q = norm(query);
    if (!q) return null;
    for (var i = 0; i < ROLES.length; i++) {
      if (norm(ROLES[i].label) === q) return ROLES[i];
      var aliases = ROLES[i].aliases || [];
      for (var j = 0; j < aliases.length; j++) {
        if (norm(aliases[j]) === q) return ROLES[i];
      }
    }
    return null;
  }

  root.BEFindTaxonomy = {
    skills: SKILLS,
    roles: ROLES,
    seniorities: SENIORITIES,
    fluencyLevels: FLUENCY_LEVELS,
    companyStages: COMPANY_STAGES,
    canonicalSkill: canonicalSkill,
    skillById: skillById,
    skillLabel: skillLabel,
    roleById: roleById,
    seniorityById: function (id) { return byId(SENIORITIES, id); },
    fluencyById: function (id) { return byId(FLUENCY_LEVELS, id); },
    companyById: function (id) { return byId(COMPANY_STAGES, id); },
    searchRoles: searchRoles,
    exactRole: exactRole
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
