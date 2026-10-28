'use strict';

/**
 * Approved proof metrics (COPY_BRIEF.md). Single source for the four-metric
 * `.air-stats-strip` used on industry pages, hire-ai-ready, and generators.
 */
function formatStatNum(m) {
  return m.numSuffix ? m.num + '<small>' + m.numSuffix + '</small>' : m.num;
}

module.exports = {
  strip: [
    { num: '72h', label: 'Average time to present candidates' },
    { num: '21.3', numSuffix: 'mo', label: 'Average engineer tenure' },
    { num: '98%', label: 'Long-term placement rate' },
    { num: '44%', label: 'Average savings vs. U.S. hiring' },
  ],
  formatStatNum: formatStatNum,
};
