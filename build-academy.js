'use strict';

var fs = require('fs');
var path = require('path');
var tracks = require('./data/academy-videos.js');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function videoCard(video) {
  var url = 'https://www.youtube.com/watch?v=' + video.id;
  return [
    '          <article class="academy-lesson academy-lesson--' + video.level.toLowerCase() + ' reveal">',
    '            <a class="academy-lesson__media" href="' + url + '" target="_blank" rel="noopener noreferrer" aria-label="Watch ' + escapeHtml(video.title) + ' on YouTube">',
    '              <img src="https://i.ytimg.com/vi/' + video.id + '/hqdefault.jpg" alt="" width="480" height="360" loading="lazy">',
    '              <span class="video-play" aria-hidden="true"></span>',
    '            </a>',
    '            <div class="academy-lesson__body">',
    '              <div class="academy-lesson__meta"><span class="academy-level">' + video.level + '</span><span>Published 2026</span><span>' + video.duration + '</span></div>',
    '              <h3><a href="' + url + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(video.title) + '</a></h3>',
    '              <p class="post-card__meta">' + escapeHtml(video.author) + '</p>',
    '              <p>' + escapeHtml(video.note) + '</p>',
    '              <a class="post-card__more" href="' + url + '" target="_blank" rel="noopener noreferrer">Watch lesson</a>',
    '            </div>',
    '          </article>',
  ].join('\n');
}

function trackSection(track) {
  return [
    '      <section class="academy-track" id="' + track.slug + '" aria-labelledby="' + track.slug + '-heading">',
    '        <div class="academy-track__head reveal">',
    '          <span class="academy-track__number" aria-hidden="true">' + track.number + '</span>',
    '          <div>',
    '            <h2 class="h2" id="' + track.slug + '-heading">' + escapeHtml(track.title) + '</h2>',
    '            <p>' + escapeHtml(track.description) + '</p>',
    '            <p class="academy-outcome"><strong>Track outcome:</strong> ' + escapeHtml(track.outcome) + '</p>',
    '          </div>',
    '        </div>',
    '        <div class="academy-lessons">',
    track.videos.map(videoCard).join('\n'),
    '        </div>',
    '      </section>',
  ].join('\n');
}

var trackLinks = tracks.map(function (track) {
  return '          <a class="academy-track-link" href="#' + track.slug + '"><span>' + track.number + '</span>' + escapeHtml(track.title) + '</a>';
}).join('\n');

var html = [
  '  <main id="main">',
  '    <section class="hero section academy-hero" id="hero" aria-labelledby="academy-title">',
  '      <div class="wrap academy-hero__grid">',
  '        <div class="academy-hero__copy reveal">',
  '          <p class="eyebrow">BETTERENGINEER ACADEMY</p>',
  '          <h1 class="h1" id="academy-title">Build the AI skills modern engineers need</h1>',
  '          <p class="lead">Ten focused tracks. Three levels in each track. Every lesson was published in 2026 and selected to help software engineers use, build, evaluate, secure, and operate AI systems.</p>',
  '          <div class="btn-row"><a class="btn btn--primary" href="#curriculum">Explore the Curriculum</a></div>',
  '        </div>',
  '        <aside class="academy-hero__summary reveal" aria-label="Academy curriculum summary">',
  '          <p class="eyebrow">2026 CURRICULUM</p>',
  '          <div class="academy-summary__stats"><strong>10</strong><span>AI skill tracks</span><strong>30</strong><span>curated lessons</span><strong>3</strong><span>learning levels</span></div>',
  '          <p>Start with the track that matches your work. Within each track, watch Beginner, Intermediate, then Advanced.</p>',
  '        </aside>',
  '      </div>',
  '    </section>',
  '',
  '    <section class="section section-tint" id="curriculum" aria-labelledby="curriculum-heading">',
  '      <div class="wrap">',
  '        <div class="air-section-head reveal">',
  '          <p class="eyebrow">THE CURRICULUM</p>',
  '          <h2 class="h2" id="curriculum-heading">Choose an AI skill track</h2>',
  '          <p class="lead">The sequence moves from effective model use to production engineering and operational ownership.</p>',
  '        </div>',
  '        <nav class="academy-track-nav reveal" aria-label="Academy skill tracks">',
  trackLinks,
  '        </nav>',
  '      </div>',
  '    </section>',
  '',
  '    <div class="wrap academy-curriculum">',
  tracks.map(trackSection).join('\n\n'),
  '    </div>',
  '',
  '    <section class="section section-tint" id="selection-standard" aria-labelledby="selection-standard-heading">',
  '      <div class="wrap split academy-standard">',
  '        <div class="reveal">',
  '          <p class="eyebrow">SELECTION STANDARD</p>',
  '          <h2 class="h2" id="selection-standard-heading">What curated means here</h2>',
  '        </div>',
  '        <div class="reveal">',
  '          <p class="lead">Every lesson passed five checks before entering the Academy.</p>',
  '          <ul class="academy-checks"><li>Published during calendar year 2026</li><li>Directly tied to an engineering learning objective</li><li>Appropriate depth for its assigned level</li><li>Concrete instruction, demonstration, or technical explanation</li><li>Clear progression within its three-video track</li></ul>',
  '          <p class="academy-disclosure">We verified publication metadata, publisher, scope, and level fit. BetterEngineer technical leads should complete a final content review before this becomes a required training program.</p>',
  '        </div>',
  '      </div>',
  '    </section>',
  '  </main>',
].join('\n');

fs.writeFileSync(path.join(__dirname, 'main-engineer-playlist.html'), html + '\n', 'utf8');
console.log('Built BetterEngineer Academy: ' + tracks.length + ' tracks, ' + tracks.reduce(function (sum, track) { return sum + track.videos.length; }, 0) + ' videos');
