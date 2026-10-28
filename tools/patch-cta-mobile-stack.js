const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const oldBlock = `      .cta-split__text-inner:not(:has(.lead)) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        width: 100%;
        max-width: none;
      }
      .cta-band .cta-split__text-inner:not(:has(.lead)) .h2 {
        margin: 0;
        flex: 1 1 auto;
        min-width: 0;
      }
      .cta-band .cta-split__text-inner:not(:has(.lead)) .btn-row {
        margin: 0 0 0 auto;
        flex: 0 0 auto;
        justify-content: flex-end;
      }`;
const newBlock = `      .cta-band .cta-split__text-inner:not(:has(.lead)) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        width: 100%;
        max-width: none;
      }
      .cta-band .cta-split__text-inner:not(:has(.lead)) .h2 {
        margin: 0;
        min-width: 0;
      }
      .cta-band .cta-split__text-inner:not(:has(.lead)) .btn-row {
        margin: 0;
        flex: 0 0 auto;
        justify-content: flex-start;
      }`;

let updated = 0;
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory() && ent.name !== 'node_modules' && ent.name !== '.git') walk(p);
    else if (ent.isFile() && ent.name.endsWith('.html')) {
      const c = fs.readFileSync(p, 'utf8');
      const normalized = c.replace(/\r\n/g, '\n');
      if (normalized.includes(oldBlock)) {
        const out = normalized.replace(oldBlock, newBlock);
        fs.writeFileSync(p, c.includes('\r\n') ? out.replace(/\n/g, '\r\n') : out, 'utf8');
        updated++;
      }
    }
  }
}
walk(root);
console.log('HTML files updated:', updated);
