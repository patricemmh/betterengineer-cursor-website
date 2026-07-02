'use strict';

const cp = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');

function run(label, cmd) {
  console.log('\n==> ' + label);
  cp.execSync(cmd, { cwd: root, stdio: 'inherit' });
}

run('Build discover bundle', 'node build-discover-dist.js');
run('Verify source SEO (roles + technologies)', 'node tools/verify-phase1-seo.js');
run('Verify form hardening (source JS)', 'node tools/verify-phase2-forms.js');
run('Verify built dist output', 'node tools/verify-dist.js');

console.log('\nAll site verification checks passed.');
