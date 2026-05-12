'use strict';

/* Local clone of the GitHub Actions LP bundle (dist/ + CNAME + nested site path). See GITHUB_PAGES_LP_HOSTING.md. */

var cp = require('child_process');

var root = __dirname;
process.env.OUTPUT_ROOT = 'dist/betterengineer-cursor-website';
process.env.PAGES_PUBLISH_ROOT = 'dist';
process.env.GITHUB_PAGES_CNAME = 'lp.betterengineer.com';

cp.execSync('node build-pages.js --base=/betterengineer-cursor-website', {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
});
