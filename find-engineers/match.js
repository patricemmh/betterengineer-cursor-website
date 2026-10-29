/**
 * Prototype matching.
 *
 * Scores a normalized candidate catalog against SearchCriteria.
 * Replace match() later without changing the page.
 *
 * Weights (100 total):
 *   role        40
 *   skills      25
 *   seniority   15
 *   AI fluency  12
 *   company      8
 *
 * Missing AI fluency, country, or company stage on a real engineers.js
 * profile is scored as unknown. It is not invented and it is not
 * treated as a failure.
 */
(function (root) {
  "use strict";

  var tax = function () { return root.BEFindTaxonomy; };

  var SENIORITY_ORDER = ["junior", "mid", "senior", "staff"];
  var YEAR_BANDS = {
    junior: [0, 2],
    mid: [2, 5],
    senior: [5, 8],
    staff: [8, 40]
  };

  function normalizeSeniority(value) {
    var raw = String(value || "").toLowerCase();
    if (raw === "mid-level" || raw === "mid level" || raw === "midlevel") return "mid";
    if (raw === "staff+" || raw === "staff") return "staff";
    if (SENIORITY_ORDER.indexOf(raw) !== -1) return raw;
    if (raw.indexOf("junior") !== -1) return "junior";
    if (raw.indexOf("senior") !== -1) return "senior";
    return "senior";
  }

  function fromRecord(record) {
    var labels = (record.skillLabels || record.skills || []).slice();
    var skillIds = [];
    labels.forEach(function (label) {
      var id = tax().canonicalSkill(label);
      if (id && skillIds.indexOf(id) === -1) skillIds.push(id);
    });
    return {
      id: record.id,
      source: record.source || "engineers.js",
      firstName: record.firstName,
      lastInitial: record.lastInitial,
      roleTitle: record.roleTitle,
      seniority: normalizeSeniority(record.seniority),
      yearsExperience: record.yearsExperience,
      verified: record.verified !== false,
      categories: record.categories || record.roles || [],
      skillLabels: labels,
      skillIds: skillIds,
      primaryStack: record.primaryStack || [],
      photo: record.photo || (record.source === "mock" ? null : "/images/engineers/" + record.id + ".webp"),
      fluency: record.fluency || null,
      country: record.country || null,
      usHoursOverlap: record.usHoursOverlap === true ? true : null,
      education: record.education || null,
      environments: record.environments || [],
      differentiators: record.differentiators || [],
      availability: record.availability || null,
      assessment: record.assessment || (record.verified !== false && record.source !== "mock" ? "Verified Expert in Engineering" : null),
      bio: record.bio || null
    };
  }

  function catalog() {
    var real = (root.BEEngineers && root.BEEngineers.ENGINEERS) || [];
    var mocks = root.BEFindMocks || [];
    return real.map(function (record) {
      return fromRecord(record);
    }).concat(mocks.map(fromRecord));
  }

  function roleFit(candidate, role) {
    if (!role) return 0;
    var cats = [role.category].concat(role.alsoCategories || []);
    var inFamily = candidate.categories.some(function (cat) {
      return cats.indexOf(cat) !== -1;
    });
    var hasAnchor = !role.anchor || candidate.skillIds.indexOf(role.anchor) !== -1;
    var overlap = (role.skills || []).filter(function (id) {
      return candidate.skillIds.indexOf(id) !== -1;
    }).length;

    if (inFamily && hasAnchor) return 40;
    if (inFamily && role.anchor && !hasAnchor) return 16;
    if (!inFamily && role.anchor && hasAnchor && overlap >= 2) return 26;
    if (overlap >= 3) return 14;
    return Math.min(8, overlap * 3);
  }

  function skillPoints(candidate, skillIds) {
    if (!skillIds || !skillIds.length) return { points: 12, hits: [] };
    var hits = skillIds.filter(function (id) {
      return candidate.skillIds.indexOf(id) !== -1;
    });
    return {
      points: Math.round((hits.length / skillIds.length) * 25),
      hits: hits
    };
  }

  function seniorityPoints(candidate, seniorityId) {
    if (!seniorityId) return 8;
    var a = SENIORITY_ORDER.indexOf(candidate.seniority);
    var b = SENIORITY_ORDER.indexOf(seniorityId);
    if (a < 0 || b < 0) return 4;
    var dist = Math.abs(a - b);
    var points = dist === 0 ? 13 : dist === 1 ? 7 : dist === 2 ? 3 : 0;
    var band = YEAR_BANDS[seniorityId];
    var years = candidate.yearsExperience;
    if (dist === 0 && band && typeof years === "number" && years >= band[0] && years <= band[1]) {
      points += 2;
    }
    return points;
  }

  function fluencyPoints(candidate, fluencyId) {
    if (!fluencyId) return 6;
    if (!candidate.fluency) return 5;
    var wanted = tax().fluencyById(fluencyId);
    var actual = tax().fluencyById(candidate.fluency);
    if (!wanted || !actual) return 4;
    if (actual.rank >= wanted.rank) return 12;
    if (actual.rank === wanted.rank - 1) return 6;
    return 2;
  }

  function companyPoints(candidate, companyId) {
    if (!companyId) return { points: 4, hit: false };
    if (!candidate.environments || !candidate.environments.length) {
      return { points: 3, hit: false };
    }
    var hit = candidate.environments.indexOf(companyId) !== -1;
    return { points: hit ? 8 : 2, hit: hit };
  }

  function stagePhrase(companyId) {
    var map = {
      early: "Fits an early-stage environment",
      growth: "Fits a growth-stage environment",
      scaling: "Fits a scaling-stage environment",
      enterprise: "Fits an enterprise environment"
    };
    return map[companyId] || "";
  }

  function hitLabels(hits, customLabels) {
    return hits.map(function (id) {
      return tax().skillLabel(id, customLabels);
    });
  }

  function reasonsFor(candidate, criteria, hits, companyHit) {
    var reasons = [];
    var labels = hitLabels(hits, criteria.customLabels);
    if (labels.length === 1) reasons.push("Overlap on " + labels[0]);
    else if (labels.length > 1) {
      var shown = labels.slice(0, 3);
      reasons.push("Overlap on " + shown.slice(0, -1).join(", ") + " and " + shown[shown.length - 1]);
    } else if (candidate.primaryStack && candidate.primaryStack.length) {
      reasons.push("Primary stack: " + candidate.primaryStack.slice(0, 3).join(", "));
    }
    if (companyHit && criteria.companyId) {
      var phrase = stagePhrase(criteria.companyId);
      if (phrase) reasons.push(phrase);
    }
    (candidate.differentiators || []).forEach(function (line) {
      reasons.push(line);
    });
    var seen = {};
    return reasons.filter(function (line) {
      var key = String(line).toLowerCase();
      if (!line || seen[key]) return false;
      seen[key] = true;
      return true;
    }).slice(0, 3);
  }

  function jaccard(a, b) {
    var set = {};
    (a || []).forEach(function (id) { set[id] = true; });
    var inter = 0;
    (b || []).forEach(function (id) { if (set[id]) inter += 1; });
    var union = (a || []).length + (b || []).length - inter;
    return union ? inter / union : 0;
  }

  function scoreOne(candidate, criteria) {
    var skills = skillPoints(candidate, criteria.skillIds || []);
    var company = companyPoints(candidate, criteria.companyId);
    var score = roleFit(candidate, criteria.role)
      + skills.points
      + seniorityPoints(candidate, criteria.seniorityId)
      + fluencyPoints(candidate, criteria.fluencyId)
      + company.points;
    score = Math.max(0, Math.min(100, Math.round(score)));
    return {
      candidate: candidate,
      score: score,
      displayScore: Math.max(1, Math.min(98, score)),
      skillHits: skills.hits,
      reasons: reasonsFor(candidate, criteria, skills.hits, company.hit)
    };
  }

  function pickDiverse(scored, count) {
    var pool = scored.filter(function (item) { return item.score >= 32; });
    if (!pool.length) pool = scored.slice(0, count);
    pool.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return (b.candidate.yearsExperience || 0) - (a.candidate.yearsExperience || 0);
    });
    var picked = [];
    while (picked.length < count && pool.length) {
      var bestIndex = 0;
      var bestValue = -1;
      for (var i = 0; i < pool.length; i++) {
        var value = pool[i].score;
        for (var p = 0; p < picked.length; p++) {
          var similarity = jaccard(pool[i].candidate.skillIds, picked[p].candidate.skillIds);
          if (similarity >= 0.72) value -= 10;
          else if (similarity >= 0.5) value -= 4;
        }
        if (value > bestValue) {
          bestValue = value;
          bestIndex = i;
        }
      }
      picked.push(pool.splice(bestIndex, 1)[0]);
    }
    picked.sort(function (a, b) { return b.score - a.score; });
    return picked;
  }

  function match(criteria) {
    var scored = catalog().map(function (candidate) {
      return scoreOne(candidate, criteria || {});
    }).sort(function (a, b) { return b.score - a.score; });

    var top = pickDiverse(scored, 3).filter(function (item) {
      return item.score >= 28;
    });
    var topIds = {};
    top.forEach(function (item) { topIds[item.candidate.id] = true; });
    var rest = scored.filter(function (item) {
      return !topIds[item.candidate.id] && item.score >= 50;
    });
    return {
      top: top,
      more: rest.slice(0, 8),
      additionalCount: rest.length,
      weak: !top.length || top[0].score < 42,
      totalConsidered: scored.length
    };
  }

  function findById(id) {
    var list = catalog();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  root.BEFindMatch = {
    match: match,
    findById: findById,
    catalog: catalog
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
