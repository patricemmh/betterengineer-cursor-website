/**
 * Add first-mention internal links from role guide/skills copy to technology pages.
 * Idempotent: skips matches already inside an <a> tag or already linked to that slug.
 *
 * Usage: node tools/link-role-tech-mentions.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

/** Longer / more specific patterns first within each role list. */
const ROLE_LINKS = {
  "front-end-engineers": [
    { re: /React\.js/g, slug: "react-developers" },
    { re: /Next\.js/g, slug: "nextjs-developers" },
    { re: /Vue\.js/g, slug: "vuejs-developers" },
    { re: /\bAngular\b/g, slug: "angular-developers" },
    { re: /\bTypeScript\b/g, slug: "typescript-developers" },
    { re: /\bJavaScript\b/g, slug: "javascript-developers" },
    { re: /\bGraphQL\b/g, slug: "graphql-developers" },
    // Plain "React" after React.js; avoid React Native (N/A on this page)
    { re: /\bReact\b(?!\s*Native)/g, slug: "react-developers" },
  ],
  "mobile-engineers": [
    { re: /\bReact Native\b/g, slug: "react-native-developers" },
    { re: /\bFlutter\b/g, slug: "flutter-developers" },
    { re: /\bSwift\b/g, slug: "swift-developers" },
    { re: /\bKotlin\b/g, slug: "kotlin-developers" },
    { re: /\biOS\b/g, slug: "ios-developers" },
    { re: /\bAndroid\b(?!\s*Studio)/g, slug: "android-developers" },
  ],
  "devops-engineers": [
    { re: /\bKubernetes\b/g, slug: "kubernetes-developers" },
    { re: /\bTerraform\b/g, slug: "terraform-developers" },
    { re: /\bDocker\b/g, slug: "docker-developers" },
    { re: /\bJenkins\b/g, slug: "jenkins-developers" },
    { re: /\bAWS\b/g, slug: "aws-developers" },
    { re: /\bAzure\b/g, slug: "azure-developers" },
    { re: /\bGCP\b/g, slug: "google-cloud-developers" },
  ],
  "ai-engineers": [
    { re: /\bLangChain\b/g, slug: "langchain-developers" },
    { re: /\bFastAPI\b/g, slug: "fastapi-developers" },
    { re: /\bOpenAI\b/g, slug: "openai-api-developers" },
    { re: /\bPython\b/g, slug: "python-developers" },
    { re: /\bTypeScript\b/g, slug: "typescript-developers" },
    { re: /\bNode\.js\b/g, slug: "nodejs-developers" },
    { re: /\bRedis\b/g, slug: "redis-developers" },
    { re: /\bElasticsearch\b/g, slug: "elasticsearch-developers" },
  ],
  "data-engineers": [
    { re: /\bDatabricks\b/g, slug: "databricks-developers" },
    { re: /\bSnowflake\b/g, slug: "snowflake-developers" },
    { re: /\bKafka\b/g, slug: "apache-kafka-developers" },
    { re: /\bSpark\b/g, slug: "apache-spark-developers" },
    { re: /\bPython\b/g, slug: "python-developers" },
  ],
  "data-science-engineers": [
    { re: /\bscikit-learn\b/gi, slug: "scikit-learn-developers" },
    { re: /\bPyTorch\b/g, slug: "pytorch-developers" },
    { re: /\bTensorFlow\b/g, slug: "tensorflow-developers" },
    { re: /\bSnowflake\b/g, slug: "snowflake-developers" },
    { re: /\bPython\b/g, slug: "python-developers" },
  ],
  "full-stack-engineers": [
    { re: /Next\.js/g, slug: "nextjs-developers" },
    { re: /\bTypeScript\b/g, slug: "typescript-developers" },
    { re: /\bNode\.js\b/g, slug: "nodejs-developers" },
    { re: /\bGraphQL\b/g, slug: "graphql-developers" },
    { re: /\bPostgreSQL\b/g, slug: "postgresql-developers" },
    { re: /\bReact\b(?!\s*Native)/g, slug: "react-developers" },
    { re: /\bPython\b/g, slug: "python-developers" },
  ],
  "back-end-engineers": [
    { re: /\bSpring Boot\b/g, slug: "spring-boot-developers" },
    { re: /\bPostgreSQL\b/g, slug: "postgresql-developers" },
    { re: /\bFastAPI\b/g, slug: "fastapi-developers" },
    { re: /\bGraphQL\b/g, slug: "graphql-developers" },
    { re: /\bNode\.js\b/g, slug: "nodejs-developers" },
    { re: /\bPython\b/g, slug: "python-developers" },
    { re: /\bKafka\b/g, slug: "apache-kafka-developers" },
  ],
  "qa-engineers": [
    { re: /\bJenkins\b/g, slug: "jenkins-developers" },
  ],
  "blockchain-engineers": [
    { re: /\bRust\b/g, slug: "rust-developers" },
    { re: /\bTypeScript\b/g, slug: "typescript-developers" },
    { re: /\bNode\.js\b/g, slug: "nodejs-developers" },
  ],
};

function extractRegions(html) {
  const regions = [];

  // All guide prose blocks (typically 4: what / why / responsibilities / skills).
  // First mention in these blocks beats a skills-chip list for SEO/AEO.
  const proseRe = /(<div class="air-role-prose">)([\s\S]*?)(<\/div>)/g;
  let m;
  while ((m = proseRe.exec(html)) !== null) {
    regions.push({
      start: m.index + m[1].length,
      end: m.index + m[1].length + m[2].length,
      label: "prose",
    });
  }

  // Skills cluster: from cluster open through the section that contains it
  const skillsOpen = html.search(/<div class="air-skills-cluster[^"]*">/);
  if (skillsOpen >= 0) {
    const afterOpen = html.indexOf(">", skillsOpen) + 1;
    const sectionEnd = html.indexOf("<!-- Use cases -->", afterOpen);
    const end = sectionEnd > afterOpen ? sectionEnd : afterOpen;
    // Prefer cutting at the skills cluster close just before use-cases
    const slice = html.slice(afterOpen, end);
    const lastClusterClose = slice.lastIndexOf("</div>");
    if (lastClusterClose >= 0) {
      regions.push({
        start: afterOpen,
        end: afterOpen + lastClusterClose,
        label: "skills",
      });
    }
  }

  return regions.sort((a, b) => a.start - b.start);
}

function isInsideAnchor(html, index) {
  const before = html.slice(Math.max(0, index - 500), index);
  const lastOpen = before.lastIndexOf("<a ");
  const lastOpen2 = before.lastIndexOf("<a>");
  const open = Math.max(lastOpen, lastOpen2);
  if (open < 0) return false;
  const afterOpen = before.slice(open);
  return !afterOpen.includes("</a>");
}

function linkFirstMentions(segment, patterns, alreadyLinkedSlugs) {
  let out = segment;
  const linked = new Set(alreadyLinkedSlugs);
  const report = [];

  for (const { re, slug } of patterns) {
    if (linked.has(slug)) continue;
    const flags = re.flags.includes("g") ? re.flags : re.flags + "g";
    const globalRe = new RegExp(re.source, flags);
    let match;
    let linkedThis = false;
    while ((match = globalRe.exec(out)) !== null) {
      const idx = match.index;
      if (isInsideAnchor(out, idx)) continue;
      // Skip if this exact slug already appears as href in segment (from prior run)
      if (out.includes(`/technologies/${slug}/`)) {
        linked.add(slug);
        linkedThis = true;
        break;
      }
      const text = match[0];
      const href = `/technologies/${slug}/`;
      const replacement = `<a href="${href}">${text}</a>`;
      out = out.slice(0, idx) + replacement + out.slice(idx + text.length);
      linked.add(slug);
      report.push({ text, slug });
      linkedThis = true;
      break; // first mention only
    }
    if (!linkedThis && out.includes(`/technologies/${slug}/`)) {
      linked.add(slug);
    }
  }

  return { out, report, linked };
}

function processRole(slug, patterns) {
  const file = path.join(ROOT, "roles", slug, "index.html");
  let html = fs.readFileSync(file, "utf8");
  const regions = extractRegions(html);
  if (!regions.length) {
    console.warn(`No regions found for ${slug}`);
    return;
  }

  // Document order: guide prose first (best for SEO/AEO), then skills.
  const allReports = [];
  const pageLinked = new Set();
  let offset = 0;

  for (const region of regions) {
    const start = region.start + offset;
    const end = region.end + offset;
    const segment = html.slice(start, end);
    const { out, report, linked } = linkFirstMentions(segment, patterns, pageLinked);
    for (const s of linked) pageLinked.add(s);
    if (out !== segment) {
      html = html.slice(0, start) + out + html.slice(end);
      offset += out.length - segment.length;
      allReports.push(...report.map((r) => ({ ...r, region: region.label })));
    }
  }

  fs.writeFileSync(file, html);
  console.log(
    `${slug}: ${allReports.length} new links` +
      (allReports.length
        ? " → " + allReports.map((r) => `${r.text} (${r.region})`).join(", ")
        : "")
  );
}

function main() {
  for (const [slug, patterns] of Object.entries(ROLE_LINKS)) {
    processRole(slug, patterns);
  }
}

main();
