'use strict';

/* Local clone of the GitHub Actions LP bundle (dist/ + CNAME + /aimanufacturing/ path). See GITHUB_PAGES_DISCOVER_HOSTING.md. */

var cp = require('child_process');

var root = __dirname;
process.env.OUTPUT_ROOT = 'dist/aimanufacturing';
process.env.PAGES_PUBLISH_ROOT = 'dist';
process.env.GITHUB_PAGES_CNAME = 'discover.betterengineer.com';
process.env.LP_ROOT_PAGE = 'manufacturing';

cp.execSync('node build-pages.js --base=/aimanufacturing', {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
});
