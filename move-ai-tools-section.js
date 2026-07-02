'use strict';
const fs = require('fs');
let h = fs.readFileSync('technologies/react/index.html', 'utf8');

// Extract the full AI tools section (from comment to end of </section>)
const AI_START = '<!-- AI Tools -->';
const AI_END   = '</section>\n<!-- Trust -->';

const startIdx = h.indexOf(AI_START);
const endIdx   = h.indexOf('<!-- Trust -->');

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find AI Tools section markers'); process.exit(1);
}

// Pull out the AI tools block (including its leading comment, excluding <!-- Trust -->)
const aiBlock = h.slice(startIdx, endIdx); // ends right before <!-- Trust -->

// Remove it from current position
h = h.slice(0, startIdx) + '<!-- Trust -->' + h.slice(endIdx + '<!-- Trust -->'.length);

// Insert right after the hiring-path section closing </section>
const INSERT_AFTER = '</section>\n <!-- Long-form guide -->';
const insertIdx = h.indexOf(INSERT_AFTER);

if (insertIdx === -1) {
  // Try alternate whitespace
  const alt = h.indexOf('</section> <!-- Long-form guide -->');
  if (alt !== -1) {
    h = h.slice(0, alt + '</section>'.length) + '\n' + aiBlock + '\n <!-- Long-form guide -->' + h.slice(alt + '</section> <!-- Long-form guide -->'.length);
  } else {
    console.error('Could not find insertion point after hiring-path');
    // Show nearby content
    const hp = h.indexOf('hiring-path');
    console.log('Near hiring-path:', JSON.stringify(h.slice(hp, hp+200)));
    process.exit(1);
  }
} else {
  h = h.slice(0, insertIdx + '</section>'.length) + '\n' + aiBlock + '\n <!-- Long-form guide -->' + h.slice(insertIdx + INSERT_AFTER.length);
}

fs.writeFileSync('technologies/react/index.html', h);
console.log('AI Tools section moved to after hiring-path');
