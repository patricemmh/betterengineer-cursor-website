'use strict';

const fs = require('fs');

const errors = [];

function mustMatch(file, pattern, label) {
  const s = fs.readFileSync(file, 'utf8');
  if (!pattern.test(s)) errors.push(file + ': ' + label);
}

mustMatch('intake-form-shared.js', /intake-proxy\.patricemmh\.workers\.dev/, 'routes through Worker');
mustMatch('intake-form-shared.js', /turnstileToken/, 'sends Turnstile token');
mustMatch('intake-form-shared.js', /form\.dataset\.intakeWired = 'true'/, 'sets intakeWired guard');
mustMatch('intake-form-shared.js', /MIN_MESSAGE_LEN/, 'validates message length');
mustMatch('landing-page.js', /form\.dataset\.intakeWired = 'true'/, 'sets intakeWired guard');
mustMatch('landing-page.js', /if \(honeypot\) \{/, 'honeypot-only fake success');
if (/elapsedSinceFirstInput < MIN_FILL_MS/.test(fs.readFileSync('landing-page.js', 'utf8'))) {
  errors.push('landing-page.js: time-trap fake success still present');
}
mustMatch('air-page.js', /BEIntakeForm\.wireForm/, 'role pages use shared form wiring');

if (errors.length) {
  console.error('Phase 2 verification failed:');
  errors.forEach(function (e) {
    console.error(' ', e);
  });
  process.exit(1);
}

console.log('Phase 2 form hardening checks passed.');
