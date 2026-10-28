/**
 * Find-an-engineer flow, UI state, and funnel tracking.
 *
 * Funnel steps (use these paths in GA4 / GTM). Dropoff is a step_view
 * at index N with no later step_view at N+1. Filter funnel_is_revisit
 * to false for a first-pass funnel.
 *
 *   1 role        /find-engineers/
 *   2 seniority   /find-engineers/seniority
 *   3 skills      /find-engineers/skills
 *   4 fluency     /find-engineers/fluency
 *   5 company     /find-engineers/company
 *   6 searching   /find-engineers/searching
 *   7 results     /find-engineers/results
 *   8 unlock      /find-engineers/unlock
 *   9 profile     /find-engineers/profile/{id}
 *
 * Events pushed to dataLayer:
 *   find_engineers_step_view
 *   virtual_page_view
 *   find_engineers_step_complete
 *   find_engineers_step_skip
 *   find_engineers_step_back
 *   find_engineers_unlock_submit
 *   find_engineers_unlock_error
 *   find_engineers_more_click
 *   find_engineers_intro_request
 *   find_engineers_start_over
 *
 * HubSpot is not called. buildHubSpotSubmission() matches the field
 * names used by hire-flow.js so a later sender can post the same shape
 * to portal 8679235, form d43da6a3-79aa-45d4-99be-0d1e8162daf7.
 */
(function (root) {
  "use strict";

  var STORAGE_KEY = "be_find_engineers_v1";
  var SID_KEY = "be_find_engineers_sid";
  var SEEN_KEY = "be_find_engineers_seen";
  var LEAD_KEY = "be_find_engineers_lead";
  var HUBSPOT_SUBMIT_URL = "https://api.hsforms.com/submissions/v3/integration/submit/8679235/d43da6a3-79aa-45d4-99be-0d1e8162daf7";
  var EMAIL_RE = /^[A-Z0-9._%+\-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  var FREE_DOMAINS = {
    "gmail.com": true,
    "googlemail.com": true,
    "yahoo.com": true,
    "yahoo.co.uk": true,
    "hotmail.com": true,
    "outlook.com": true,
    "live.com": true,
    "icloud.com": true,
    "me.com": true,
    "aol.com": true,
    "proton.me": true,
    "protonmail.com": true,
    "msn.com": true,
    "gmx.com": true,
    "mail.com": true
  };

  var FUNNEL = [
    { id: "role", index: 1, name: "Role search", path: "/find-engineers/", title: "Find an engineer" },
    { id: "seniority", index: 2, name: "Seniority", path: "/find-engineers/seniority", title: "Seniority", wizard: 1 },
    { id: "skills", index: 3, name: "Skills", path: "/find-engineers/skills", title: "Skills", wizard: 2 },
    { id: "fluency", index: 4, name: "AI fluency", path: "/find-engineers/fluency", title: "AI fluency", wizard: 3 },
    { id: "company", index: 5, name: "Company", path: "/find-engineers/company", title: "Company", wizard: 4 },
    { id: "searching", index: 6, name: "Searching", path: "/find-engineers/searching", title: "Searching the network" },
    { id: "results", index: 7, name: "Results", path: "/find-engineers/results", title: "Your shortlist" },
    { id: "unlock", index: 8, name: "Unlock", path: "/find-engineers/unlock", title: "Unlock profiles" },
    { id: "profile", index: 9, name: "Profile", path: "/find-engineers/profile", title: "Engineer profile" }
  ];

  var WIZARD = ["seniority", "skills", "fluency", "company"];

  var state = blankState();
  var ui = { suggestOpen: false, suggestIndex: 0, summaryOpen: false };
  var lastTracked = "";
  var searchTimer = null;

  function tax() { return root.BEFindTaxonomy; }
  function matchApi() { return root.BEFindMatch; }

  function blankState() {
    return {
      roleId: null,
      roleQuery: "",
      seniorityId: null,
      senioritySkipped: false,
      skillIds: [],
      customLabels: {},
      fluencyId: null,
      fluencySkipped: false,
      companyId: null,
      companySkipped: false,
      unlocked: false,
      email: "",
      personName: "",
      companyName: "",
      gateIntent: null,
      introRequested: {},
      showMore: false,
      profileId: null,
      step: "role"
    };
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function funnelMeta(step) {
    for (var i = 0; i < FUNNEL.length; i++) {
      if (FUNNEL[i].id === step) return FUNNEL[i];
    }
    return FUNNEL[0];
  }

  function sessionId() {
    try {
      var id = sessionStorage.getItem(SID_KEY);
      if (!id) {
        id = "fe_" + Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
        sessionStorage.setItem(SID_KEY, id);
      }
      return id;
    } catch (err) {
      return "fe_local";
    }
  }

  function seenMap() {
    try {
      return JSON.parse(sessionStorage.getItem(SEEN_KEY) || "{}");
    } catch (err) {
      return {};
    }
  }

  function markSeen(key) {
    var seen = seenMap();
    var revisit = !!seen[key];
    seen[key] = true;
    try { sessionStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch (err) { /* ignore */ }
    return revisit;
  }

  function currentRole() {
    return state.roleId ? tax().roleById(state.roleId) : null;
  }

  function selectedSkillLabels() {
    return (state.skillIds || []).map(function (id) {
      return tax().skillLabel(id, state.customLabels);
    });
  }

  function trackContext() {
    var meta = funnelMeta(state.step);
    var role = currentRole();
    var seniority = tax().seniorityById(state.seniorityId);
    var fluency = tax().fluencyById(state.fluencyId);
    var company = tax().companyById(state.companyId);
    var path = meta.path;
    if (state.step === "profile" && state.profileId) path += "/" + state.profileId;
    return {
      funnel_name: "find_engineers",
      funnel_session_id: sessionId(),
      funnel_step_id: meta.id,
      funnel_step_index: meta.index,
      funnel_step_name: meta.name,
      funnel_wizard_step: meta.wizard || "",
      page_path: path,
      page_title: meta.title + " | BetterEngineer",
      funnel_role: role ? role.label : "",
      funnel_seniority: seniority ? seniority.id : "",
      funnel_skill_count: (state.skillIds || []).length,
      funnel_fluency: fluency ? fluency.id : "",
      funnel_company: company ? company.id : ""
    };
  }

  function track(eventName, extra) {
    var payload = trackContext();
    payload.event = eventName;
    if (extra) {
      Object.keys(extra).forEach(function (key) {
        payload[key] = extra[key];
      });
    }
    root.dataLayer = root.dataLayer || [];
    root.dataLayer.push(payload);
    try {
      document.dispatchEvent(new CustomEvent("be:funnel", { detail: payload }));
    } catch (err) { /* ignore */ }
  }

  function maybeTrackView() {
    var key = state.step + ":" + (state.step === "profile" ? state.profileId || "" : "");
    if (key === lastTracked) return;
    lastTracked = key;
    var revisit = markSeen(key);
    var extra = { funnel_is_revisit: revisit };
    if (state.step === "profile" && state.profileId) {
      extra.funnel_profile_id = state.profileId;
      var person = matchApi().findById(state.profileId);
      if (person) extra.funnel_profile_source = person.source;
    }
    track("find_engineers_step_view", extra);
    track("virtual_page_view", extra);
    var meta = funnelMeta(state.step);
    document.title = meta.title + " | BetterEngineer";
    document.body.setAttribute("data-funnel-step", meta.id);
    document.body.setAttribute("data-funnel-step-index", String(meta.index));
    var live = document.getElementById("fe-live");
    if (live) live.textContent = meta.name;
  }

  function save() {
    var snapshot = {
      roleId: state.roleId,
      roleQuery: state.roleQuery,
      seniorityId: state.seniorityId,
      senioritySkipped: state.senioritySkipped,
      skillIds: state.skillIds,
      customLabels: state.customLabels,
      fluencyId: state.fluencyId,
      fluencySkipped: state.fluencySkipped,
      companyId: state.companyId,
      companySkipped: state.companySkipped,
      unlocked: state.unlocked,
      email: state.email,
      personName: state.personName,
      companyName: state.companyName,
      gateIntent: state.gateIntent,
      introRequested: state.introRequested,
      showMore: state.showMore,
      profileId: state.profileId
    };
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot)); } catch (err) { /* ignore */ }
  }

  function load() {
    state = blankState();
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      Object.keys(saved).forEach(function (key) {
        if (key in state) state[key] = saved[key];
      });
    } catch (err) { /* ignore */ }
  }

  function criteria() {
    return {
      role: currentRole(),
      seniorityId: state.seniorityId,
      skillIds: state.skillIds || [],
      customLabels: state.customLabels || {},
      fluencyId: state.fluencyId,
      companyId: state.companyId
    };
  }

  function results() {
    return matchApi().match(criteria());
  }

  function hashFor(step, profileId) {
    if (step === "role") return "#/";
    if (step === "profile") return "#/profile/" + (profileId || state.profileId || "");
    return "#/" + step;
  }

  function parseHash() {
    var parts = (location.hash || "")
      .replace(/^#/, "")
      .split("/")
      .filter(Boolean);
    if (!parts.length) return { step: "role", profileId: null };
    if (parts[0] === "english") parts[0] = "fluency";
    if (parts[0] === "profile") return { step: "profile", profileId: parts[1] || null };
    var known = false;
    for (var i = 0; i < FUNNEL.length; i++) {
      if (FUNNEL[i].id === parts[0]) known = true;
    }
    if (!known) return { step: "role", profileId: null };
    return { step: parts[0], profileId: null };
  }

  function resolveStep(parsed) {
    if (!parsed || parsed.step === "role") return "role";
    if (!state.roleId) return "role";
    if (parsed.step === "searching") return "results";
    if (parsed.step === "profile") {
      if (!parsed.profileId || !matchApi().findById(parsed.profileId)) return "results";
      state.profileId = parsed.profileId;
      if (!state.unlocked) {
        state.gateIntent = { type: "profile", id: parsed.profileId };
        return "unlock";
      }
      return "profile";
    }
    return parsed.step;
  }

  function clearSearchTimer() {
    if (searchTimer) {
      clearTimeout(searchTimer);
      searchTimer = null;
    }
  }

  function go(step, opts) {
    opts = opts || {};
    clearSearchTimer();
    if (opts.profileId) state.profileId = opts.profileId;
    state.step = step;
    save();
    var hash = hashFor(step, state.profileId);
    if (location.hash !== hash) {
      if (opts.replace) history.replaceState({ step: step }, "", hash);
      else history.pushState({ step: step }, "", hash);
    }
    render({ track: true, focus: opts.focus !== false, stepChange: true });
  }

  function syncChrome() {
    var start = document.querySelector(".fe-start");
    if (start) start.hidden = state.step === "role";
  }

  function render(opts) {
    opts = opts || {};
    var app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = screenHtml();
    syncChrome();
    if (opts.stepChange) window.scrollTo(0, 0);
    if (opts.track !== false) maybeTrackView();
    if (opts.focus) focusStep();
    if (state.step === "searching") startSearch();
    if (state.step === "role") paintSuggestions();
  }

  function focusStep() {
    if (state.step === "role") {
      var input = document.getElementById("fe-role-input");
      if (input) input.focus();
      return;
    }
    var title = document.querySelector(".fe-title");
    if (title) {
      title.setAttribute("tabindex", "-1");
      title.focus();
    }
  }

  function screenHtml() {
    if (state.step === "role") return roleHtml();
    if (state.step === "searching") return searchingHtml();
    if (state.step === "results") return resultsHtml();
    if (state.step === "unlock") return unlockHtml();
    if (state.step === "profile") return profileHtml();
    return wizardHtml(state.step);
  }

  function arrowIcon(direction) {
    var path = direction === "left" ? "M16 10H4M8 6 4 10l4 4" : "M4 10h12M12 6l4 4-4 4";
    return '<svg class="fe-icon" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false"><path d="' + path + '" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
  }

  function wrap(inner, withSummary, stage) {
    var cls = "fe-wrap" + (stage ? " fe-stage" : "");
    return '<div class="' + cls + '">' + inner + "</div>";
  }

  function roleHtml() {
    return '<div class="fe-wrap fe-wrap--entry">' +
      '<section class="fe-entry fe-step">' +
        '<p class="fe-eyebrow">Find an engineer</p>' +
        '<h1 class="fe-title">What type of role are you looking for?</h1>' +
        '<p class="fe-lead">Type a role or a technology. We search the BetterEngineer network and build a shortlist you can preview.</p>' +
        '<form class="fe-search" id="fe-role-form" autocomplete="off">' +
          '<div class="fe-search__field">' +
            '<label class="fe-sr" for="fe-role-input">Role or technology</label>' +
            '<input id="fe-role-input" name="role" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="fe-suggest" placeholder="Try Full Stack Developer, React, or DevOps" value="' + esc(state.roleQuery) + '" spellcheck="false">' +
            '<ul class="fe-suggest" id="fe-suggest" role="listbox" hidden></ul>' +
          '</div>' +
          '<button class="fe-btn fe-btn--primary" type="submit" id="fe-role-submit"' + (state.roleId ? "" : " disabled") + ">Find a match</button>" +
        "</form>" +
        '<p class="fe-note">Search by role or by a technology such as React, Python, or Kubernetes.</p>' +
      "</section>" +
    "</div>";
  }

  function roleQueryText() {
    return String(state.roleQuery || "").trim();
  }

  function paintSuggestions() {
    var list = document.getElementById("fe-suggest");
    var input = document.getElementById("fe-role-input");
    if (!list || !input) return;
    if (!roleQueryText()) ui.suggestOpen = false;
    var roles = tax().searchRoles(state.roleQuery);
    if (!ui.suggestOpen) {
      list.hidden = true;
      list.innerHTML = "";
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      return;
    }
    if (!roles.length) {
      list.hidden = false;
      list.innerHTML = '<li class="fe-suggest__empty">No matching roles. Try React, Python, DevOps, or Full Stack.</li>';
      input.setAttribute("aria-expanded", "true");
      return;
    }
    if (ui.suggestIndex >= roles.length) ui.suggestIndex = 0;
    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
    list.innerHTML = roles.map(function (role, index) {
      var hints = role.skills.slice(0, 3).map(function (id) {
        return tax().skillLabel(id);
      }).join(", ");
      var selected = index === ui.suggestIndex;
      return '<li role="presentation"><button type="button" class="fe-suggest__opt' + (selected ? " is-active" : "") + '" role="option" id="fe-opt-' + index + '" data-action="select-role" data-role-id="' + esc(role.id) + '" aria-selected="' + (selected ? "true" : "false") + '"><span>' + esc(role.label) + '</span><small>' + esc(hints) + "</small></button></li>";
    }).join("");
    input.setAttribute("aria-activedescendant", "fe-opt-" + ui.suggestIndex);
  }

  function syncRoleButton() {
    var button = document.getElementById("fe-role-submit");
    if (button) button.disabled = !state.roleId;
  }

  function wizardCopy(step) {
    var role = currentRole();
    var roleName = role ? role.label : "this role";
    if (step === "seniority") {
      return {
        title: "What seniority level are you looking for?",
        lead: "Senior is the usual fit for a BetterEngineer hire. Choose the level that matches the seat you are filling."
      };
    }
    if (step === "skills") {
      return {
        title: "What skills and technologies are you looking for?",
        lead: "Relevant skills for " + roleName + " are listed first. Pick the ones that matter, or add your own."
      };
    }
    if (step === "fluency") {
      return {
        title: "What level of AI fluency do you need?",
        lead: "Every candidate is assessed before you meet them. AI integrated is the level most teams request."
      };
    }
    return {
      title: "How would you describe your company right now?",
      lead: "We use this to talk about environment fit, not only the technical match."
    };
  }

  function wizardHtml(step) {
    var index = WIZARD.indexOf(step) + 1;
    var copy = wizardCopy(step);
    var body = "";
    if (step === "seniority") body = choiceGrid(tax().seniorities, "seniority", state.seniorityId);
    else if (step === "fluency") body = fluencyGrid(state.fluencyId);
    else if (step === "company") body = choiceGrid(tax().companyStages, "company", state.companyId);
    else body = skillsHtml();

    var canContinue = step === "skills" || !!chosenValue(step);
    var continueLabel = step === "company" ? "See matches" : "Continue";
    var dots = WIZARD.map(function (_, i) {
      var n = i + 1;
      var cls = "fe-progress__dot";
      if (n < index) cls += " is-done";
      else if (n === index) cls += " is-current";
      return '<span class="' + cls + '"></span>';
    }).join("");

    return wrap(
      '<section class="fe-step">' +
        '<div class="fe-progress" role="progressbar" aria-valuemin="1" aria-valuemax="' + WIZARD.length + '" aria-valuenow="' + index + '" aria-label="Step ' + index + " of " + WIZARD.length + '">' +
          dots +
        "</div>" +
        '<h1 class="fe-title fe-title--wizard">' + esc(copy.title) + "</h1>" +
        '<p class="fe-lead">' + esc(copy.lead) + "</p>" +
        '<div class="fe-step__main">' + body + "</div>" +
        '<div class="fe-nav">' +
          '<button type="button" class="fe-text fe-back" data-action="back">' + arrowIcon("left") + "Back</button>" +
          '<div class="fe-nav__end">' +
            '<button type="button" class="fe-text" data-action="skip">Skip</button>' +
            (step === "skills"
              ? '<button type="button" class="fe-btn fe-btn--primary" data-action="continue"' + (canContinue ? "" : " disabled") + ">" + continueLabel + arrowIcon("right") + "</button>"
              : "") +
          "</div>" +
        "</div>" +
      "</section>",
      true,
      true
    );
  }

  function chosenValue(step) {
    if (step === "seniority") return state.seniorityId;
    if (step === "fluency") return state.fluencyId;
    if (step === "company") return state.companyId;
    return true;
  }

  function fluencyGrid(selected) {
    return '<div class="fe-fluency" role="group" aria-label="AI fluency levels">' + tax().fluencyLevels.map(function (item) {
      var on = selected === item.id;
      var cls = "fe-fluency__card";
      if (item.suggested) cls += " is-suggested";
      if (on) cls += " is-selected";
      return '<button type="button" class="' + cls + '" data-action="choose" data-field="fluency" data-value="' + esc(item.id) + '" aria-pressed="' + (on ? "true" : "false") + '">' +
        (item.badge ? '<span class="fe-badge">' + esc(item.badge) + "</span>" : "") +
        "<strong>" + esc(item.label) + "</strong>" +
        '<span class="fe-fluency__level">' + esc(item.level) + "</span>" +
        "<span>" + esc(item.description) + "</span>" +
      "</button>";
    }).join("") + "</div>";
  }

  function choiceGrid(items, field, selected) {
    return '<div class="fe-choices" role="group">' + items.map(function (item) {
      var on = selected === item.id;
      return '<button type="button" class="fe-choice' + (item.suggested ? " is-suggested" : "") + (on ? " is-selected" : "") + '" data-action="choose" data-field="' + field + '" data-value="' + esc(item.id) + '" aria-pressed="' + (on ? "true" : "false") + '">' +
        (item.suggested ? '<span class="fe-badge">Suggested</span>' : "") +
        "<strong>" + esc(item.label) + "</strong>" +
        (item.years ? '<span class="fe-choice__meta">' + esc(item.years) + "</span>" : "") +
        "<span>" + esc(item.description) + "</span>" +
      "</button>";
    }).join("") + "</div>";
  }

  function skillsHtml() {
    var role = currentRole();
    var ids = role ? role.skills.slice() : [];
    (state.skillIds || []).forEach(function (id) {
      if (ids.indexOf(id) === -1) ids.push(id);
    });
    var chips = ids.map(function (id) {
      var on = state.skillIds.indexOf(id) !== -1;
      return '<button type="button" class="fe-chip' + (on ? " is-selected" : "") + '" data-action="toggle-skill" data-skill-id="' + esc(id) + '" aria-pressed="' + (on ? "true" : "false") + '">' + esc(tax().skillLabel(id, state.customLabels)) + "</button>";
    }).join("");
    return '<div class="fe-chips">' + chips + "</div>" +
      '<form class="fe-add" id="fe-add-skill" autocomplete="off">' +
        '<label class="fe-sr" for="fe-custom-skill">Add a custom skill</label>' +
        '<input id="fe-custom-skill" name="skill" type="text" placeholder="Add a custom skill" maxlength="40">' +
        '<button class="fe-btn fe-btn--primary" type="submit" disabled>Add</button>' +
      "</form>";
  }

  function summaryValue(value, skipped) {
    if (value) return esc(value);
    if (skipped) return '<span class="is-muted">Skipped</span>';
    return '<span class="is-muted">Not set yet</span>';
  }

  function summaryHtml() {
    var role = currentRole();
    var seniority = tax().seniorityById(state.seniorityId);
    var fluency = tax().fluencyById(state.fluencyId);
    var company = tax().companyById(state.companyId);
    var skills = selectedSkillLabels();
    var skillHtml = skills.length
      ? skills.map(function (label) { return '<span class="fe-mini">' + esc(label) + "</span>"; }).join("")
      : '<span class="is-muted">Not set yet</span>';
    var bits = [];
    if (seniority) bits.push(seniority.label);
    if (skills.length) bits.push(skills.length + (skills.length === 1 ? " skill" : " skills"));
    if (fluency) bits.push(fluency.label);
    var meta = bits.length ? bits.join(" · ") : "Add details as you go";
    return '<aside class="fe-summary' + (ui.summaryOpen ? " is-open" : "") + '" aria-label="Search summary">' +
      '<button type="button" class="fe-summary__toggle" data-action="toggle-summary" aria-expanded="' + (ui.summaryOpen ? "true" : "false") + '">' +
        "<span><strong>Searching profiles</strong><em>" + esc(role ? role.label : "Choose a role") + "</em></span>" +
        "<span>" + esc(meta) + "</span>" +
      "</button>" +
      '<div class="fe-summary__body">' +
        '<p class="fe-summary__kicker">Searching profiles</p>' +
        '<p class="fe-summary__role">' + esc(role ? role.label : "Choose a role") + "</p>" +
        "<dl>" +
          "<dt>Skills</dt><dd>" + skillHtml + "</dd>" +
          "<dt>Seniority</dt><dd>" + summaryValue(seniority && seniority.label, state.senioritySkipped) + "</dd>" +
          "<dt>AI fluency</dt><dd>" + summaryValue(fluency && fluency.label, state.fluencySkipped) + "</dd>" +
          "<dt>Company</dt><dd>" + summaryValue(company && company.label, state.companySkipped) + "</dd>" +
        "</dl>" +
      "</div>" +
    "</aside>";
  }

  function searchingHtml() {
    return wrap(
      '<section class="fe-searching fe-step" aria-live="polite">' +
        '<p class="fe-eyebrow">Building your shortlist</p>' +
        '<div class="fe-searching__track" aria-hidden="true"><span id="fe-search-bar"></span></div>' +
        '<p class="fe-searching__msg" id="fe-search-msg">Searching our network...</p>' +
      "</section>"
    );
  }

  function startSearch() {
    clearSearchTimer();
    var reduce = false;
    try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (err) { /* ignore */ }
    var messages = searchCopy();
    if (reduce) messages = [messages[0], messages[messages.length - 1]];
    var index = 0;
    var delay = reduce ? 400 : 1000;
    var msg = document.getElementById("fe-search-msg");
    var bar = document.getElementById("fe-search-bar");
    function paint() {
      if (msg) msg.textContent = messages[index];
      if (bar) bar.style.width = Math.round(((index + 1) / messages.length) * 100) + "%";
    }
    paint();
    function tick() {
      index += 1;
      if (index >= messages.length) {
        go("results", { replace: true });
        return;
      }
      paint();
      searchTimer = setTimeout(tick, delay);
    }
    searchTimer = setTimeout(tick, delay);
  }

  function searchCopy() {
    var role = currentRole();
    var lines = ["Searching our network..."];
    if (role) lines.push("Finding engineers with " + role.label + " experience...");
    var seniority = tax().seniorityById(state.seniorityId);
    if (seniority) lines.push("Prioritizing " + seniority.label + " candidates...");
    var labels = selectedSkillLabels();
    if (labels.length === 1) lines.push("Matching " + labels[0] + " experience...");
    else if (labels.length > 1) lines.push("Matching " + labels[0] + " and " + labels[1] + " experience...");
    var fluency = tax().fluencyById(state.fluencyId);
    if (fluency) lines.push("Checking " + fluency.label + " fluency...");
    lines.push("Building your shortlist...");
    return lines.slice(0, 5);
  }

  function resultsHtml() {
    var found = results();
    var title = "Here are your top engineer matches";
    var eyebrow = "Your shortlist is ready";
    if (!found.top.length) {
      title = "No strong match in this preview yet";
      eyebrow = "Keep looking";
    } else if (found.weak) {
      title = "Here are the closest engineers we found";
    } else if (found.top.length === 1) {
      title = "Here is your top engineer match";
    }
    var lead = state.unlocked
      ? "Profiles are open for this browser session. Ask for an introduction when someone looks right."
      : "These are preview profiles based on your requirements. Full profiles unlock with your work email.";
    var cards = found.top.map(function (item) {
      return cardHtml(item);
    }).join("");
    var more = "";
    if (found.additionalCount > 0) {
      var noun = found.additionalCount === 1 ? "engineer matches" : "engineers match";
      more = '<button type="button" class="fe-more" data-action="more">' + found.additionalCount + " additional " + noun + " your search.</button>";
      if (state.unlocked && state.showMore) {
        more += '<div class="fe-more-list">' + found.more.map(function (item) {
          return '<button type="button" class="fe-more-row" data-action="open-profile" data-profile-id="' + esc(item.candidate.id) + '"><span>' + esc(displayName(item.candidate)) + "</span><span>" + esc(item.candidate.roleTitle) + "</span><strong>" + item.displayScore + "% match</strong></button>";
        }).join("") + "</div>";
      }
    } else if (found.top.length) {
      more = '<p class="fe-more fe-more--static">These are the strongest matches in this preview of the network.</p>';
    }
    var empty = found.top.length ? "" : '<div class="fe-empty"><p>Try a broader role, or skip a requirement and search again.</p><button type="button" class="fe-btn fe-btn--primary" data-action="adjust">Adjust search</button></div>';
    var see = "";
    if (found.top.length && !state.unlocked) {
      see = '<button type="button" class="fe-btn fe-btn--primary" data-action="see-profiles">See full profiles</button>';
    }
    return wrap(
      '<section class="fe-results fe-step">' +
        '<p class="fe-eyebrow">' + esc(eyebrow) + "</p>" +
        '<h1 class="fe-title fe-title--center">' + esc(title) + "</h1>" +
        '<p class="fe-lead fe-lead--center">' + esc(lead) + "</p>" +
        recapHtml() +
        see +
        '<div class="fe-cards">' + cards + "</div>" +
        more +
        empty +
        '<div class="fe-results__links"><button type="button" class="fe-text" data-action="adjust">Adjust search</button></div>' +
      "</section>"
    );
  }

  function recapHtml() {
    var bits = [];
    var role = currentRole();
    if (role) bits.push(role.label);
    var seniority = tax().seniorityById(state.seniorityId);
    if (seniority) bits.push(seniority.label);
    selectedSkillLabels().forEach(function (label) { bits.push(label); });
    var fluency = tax().fluencyById(state.fluencyId);
    if (fluency) bits.push(fluency.label);
    var company = tax().companyById(state.companyId);
    if (company) bits.push(company.label);
    if (!bits.length) return "";
    return '<ul class="fe-recap">' + bits.map(function (bit) {
      return "<li>" + esc(bit) + "</li>";
    }).join("") + "</ul>";
  }

  function displayName(candidate) {
    return candidate.firstName + " " + candidate.lastInitial + ".";
  }

  function previewSkills(candidate) {
    var labels = [];
    (candidate.primaryStack || []).concat(candidate.skillLabels || []).forEach(function (label) {
      if (labels.length < 4 && labels.indexOf(label) === -1) labels.push(label);
    });
    return labels;
  }

  function avatarHtml(candidate, masked) {
    var name = displayName(candidate);
    if (candidate.photo) {
      return '<span class="fe-avatar' + (masked ? " is-masked" : "") + '"><img src="' + esc(candidate.photo) + '" alt="" width="96" height="96"></span>';
    }
    var letter = esc((candidate.firstName || "?").charAt(0));
    return '<span class="fe-avatar fe-avatar--letter' + (masked ? " is-masked" : "") + '" aria-hidden="true">' + letter + "</span>";
  }

  function cardHtml(item) {
    var candidate = item.candidate;
    var masked = !state.unlocked;
    var meta = [];
    if (candidate.yearsExperience) meta.push(candidate.yearsExperience + " years");
    var seniority = tax().seniorityById(candidate.seniority);
    if (seniority) meta.push(seniority.label);
    if (candidate.fluency) {
      var fluency = tax().fluencyById(candidate.fluency);
      if (fluency) meta.push(fluency.label);
    }
    var place = [];
    if (candidate.country) place.push(candidate.country);
    if (candidate.usHoursOverlap) place.push("U.S. hours overlap");
    var reasons = (item.reasons || []).map(function (line) {
      return "<li>" + esc(line) + "</li>";
    }).join("");
    return '<article class="fe-card">' +
      '<div class="fe-card__head">' +
        avatarHtml(candidate, masked) +
        "<div>" +
          '<p class="fe-card__role">' + esc(candidate.roleTitle) + "</p>" +
          "<h2>" + esc(displayName(candidate)) + "</h2>" +
        "</div>" +
      "</div>" +
      '<div class="fe-match"><span style="width:' + item.displayScore + '%"></span></div>' +
      '<p class="fe-match__num">' + item.displayScore + "% match</p>" +
      (meta.length ? '<p class="fe-card__meta">' + esc(meta.join(" · ")) + "</p>" : "") +
      '<ul class="fe-tags">' + previewSkills(candidate).map(function (label) {
        return "<li>" + esc(label) + "</li>";
      }).join("") + "</ul>" +
      (candidate.assessment ? '<p class="fe-verified"><span aria-hidden="true">&#10003;</span> ' + esc(candidate.assessment) + "</p>" : "") +
      (reasons ? '<ul class="fe-points">' + reasons + "</ul>" : "") +
      (place.length ? '<p class="fe-card__place">' + esc(place.join(", ")) + "</p>" : "") +
      '<button type="button" class="fe-btn fe-btn--ghost" data-action="open-profile" data-profile-id="' + esc(candidate.id) + '">View profile</button>' +
    "</article>";
  }

  function unlockHtml() {
    var role = currentRole();
    return wrap(
      '<section class="fe-gate fe-step">' +
        '<form class="fe-gate__card" id="fe-unlock-form" novalidate>' +
          '<p class="fe-eyebrow">Unlock profiles</p>' +
          '<h1 class="fe-title fe-title--wizard">Unlock your full shortlist</h1>' +
          '<p class="fe-lead">Enter your work email to view complete candidate profiles and continue your search.</p>' +
          (role ? '<p class="fe-gate__for">For ' + esc(role.label) + "</p>" : "") +
          '<div class="fe-field"><label for="fe-email">Work email</label><input id="fe-email" name="email" type="email" autocomplete="email" inputmode="email" required placeholder="you@company.com" value="' + esc(state.email) + '"></div>' +
          '<div class="fe-field"><label for="fe-name">Name <span>optional</span></label><input id="fe-name" name="name" type="text" autocomplete="name" value="' + esc(state.personName) + '"></div>' +
          '<div class="fe-field"><label for="fe-company">Company <span>optional</span></label><input id="fe-company" name="company" type="text" autocomplete="organization" value="' + esc(state.companyName) + '"></div>' +
          '<label class="fe-consent"><input type="checkbox" name="consent" id="fe-consent"> <span>I agree to receive communications from Better Engineer.</span></label>' +
          '<p class="fe-form-status" id="fe-form-status" role="alert"></p>' +
          '<button class="fe-btn fe-btn--primary fe-btn--block" type="submit">Continue' + arrowIcon("right") + "</button>" +
          '<p class="fe-note">We use this to open profiles and follow up on the search. Preview cards never include a direct email or phone number.</p>' +
        "</form>" +
        '<button type="button" class="fe-text fe-gate__back" data-action="back-results">' + arrowIcon("left") + "Back to previews</button>" +
      "</section>"
    );
  }

  function profileHtml() {
    var candidate = matchApi().findById(state.profileId);
    if (!candidate || !state.unlocked) {
      return wrap('<section class="fe-step"><p>That profile is not open yet.</p></section>');
    }
    var found = results();
    var scored = null;
    found.top.concat(found.more).forEach(function (item) {
      if (item.candidate.id === candidate.id) scored = item;
    });
    if (!scored) scored = { displayScore: null, reasons: [] };
    var seniority = tax().seniorityById(candidate.seniority);
    var fluency = candidate.fluency ? tax().fluencyById(candidate.fluency) : null;
    var facts = [];
    if (candidate.yearsExperience) facts.push(["Experience", candidate.yearsExperience + " years"]);
    if (seniority) facts.push(["Seniority", seniority.label]);
    if (fluency) facts.push(["AI fluency", fluency.label]);
    if (candidate.country) facts.push(["Based in", candidate.country]);
    if (candidate.usHoursOverlap) facts.push(["Hours", "Overlaps U.S. business hours"]);
    if (candidate.availability) facts.push(["Availability", candidate.availability]);
    var primary = candidate.primaryStack || [];
    var skills = (candidate.skillLabels || []).map(function (label, i) {
      var isCore = primary.indexOf(label) !== -1;
      return '<li class="' + (isCore ? "is-core" : "") + '">' + esc(label) + "</li>";
    }).join("");
    var name = displayName(candidate);
    var intro = state.introRequested[candidate.id];
    var reasons = scored.reasons || [];
    var score = scored.displayScore ? Math.max(0, Math.min(100, Math.round(scored.displayScore))) : null;
    var introLabel = "Request introduction";
    var introBtn = function (extra) {
      return '<button type="button" class="fe-btn fe-btn--primary fe-pf-cta' + (extra || "") + '" data-action="request-intro" data-profile-id="' + esc(candidate.id) + '">' + introLabel + arrowIcon("right") + "</button>";
    };
    var confirm = '<p class="fe-confirm"><span class="fe-confirm__icon" aria-hidden="true">&#10003;</span><span><strong>Introduction requested.</strong> We will follow up at ' + esc(state.email) + " to introduce " + esc(name) + ".</span></p>";
    var action = intro ? confirm : introBtn("");
    var mobileBar = '<div class="fe-pf-bar" role="region" aria-label="' + introLabel + '">' +
      '<div class="fe-pf-bar__who"><strong>' + esc(name) + "</strong>" + (score ? "<span>" + score + "% match</span>" : "<span>" + esc(candidate.roleTitle) + "</span>") + "</div>" +
      (intro ? '<span class="fe-pf-bar__done"><span aria-hidden="true">&#10003;</span> Requested</span>' : introBtn(" fe-pf-cta--bar")) +
    "</div>";
    var matchBadge = score
      ? '<span class="fe-pf-badge" aria-label="' + score + ' percent match for this search">' + score + "% match</span>"
      : "";
    return wrap(
      '<section class="fe-profile fe-step">' +
        '<button type="button" class="fe-text fe-pf-back" data-action="back-results">' + arrowIcon("left") + "Back to shortlist</button>" +
        '<div class="fe-pf-grid">' +
          '<div class="fe-pf-lead">' +
            '<header class="fe-pf-head">' +
              avatarHtml(candidate, false) +
              '<div class="fe-pf-head__text">' +
                '<p class="fe-pf-role">' + esc(candidate.roleTitle) + "</p>" +
                '<h1 class="fe-pf-name">' + esc(name) + "</h1>" +
                (candidate.assessment ? '<p class="fe-pf-note">' + esc(candidate.assessment) + "</p>" : "") +
              "</div>" +
              matchBadge +
            "</header>" +
            (facts.length ? '<dl class="fe-facts">' + facts.map(function (fact) {
              return '<div class="fe-facts__item"><dt>' + esc(fact[0]) + "</dt><dd>" + esc(fact[1]) + "</dd></div>";
            }).join("") + "</dl>" : "") +
          "</div>" +
          '<aside class="fe-pf-side"><div class="fe-pf-side__card">' +
            '<p class="fe-pf-side__eyebrow">Interested in ' + esc(candidate.firstName) + "?</p>" +
            action +
            '<p class="fe-pf-side__text">We make the introduction and handle scheduling. No cost to request.</p>' +
            '<ul class="fe-pf-side__points">' +
              "<li>Contact details shared after you request an intro</li>" +
            "</ul>" +
          "</div></aside>" +
          '<div class="fe-pf-main">' +
            (reasons.length ? '<section class="fe-pf-section"><h2>Why this match</h2><ul class="fe-checks">' + reasons.map(function (line) {
              return "<li>" + esc(line) + "</li>";
            }).join("") + "</ul></section>" : "") +
            (candidate.bio ? '<section class="fe-pf-section"><h2>About</h2><p>' + esc(candidate.bio) + "</p></section>" : "") +
            (skills ? '<section class="fe-pf-section"><h2>Skills</h2><ul class="fe-skills">' + skills + "</ul></section>" : "") +
            (candidate.education ? '<section class="fe-pf-section"><h2>Education</h2><p>' + esc(candidate.education) + "</p></section>" : "") +
          "</div>" +
        "</div>" +
        mobileBar +
      "</section>"
    );
  }

  function buildHubSpotSubmission() {
    var role = currentRole();
    var seniority = tax().seniorityById(state.seniorityId);
    var fluency = tax().fluencyById(state.fluencyId);
    var company = tax().companyById(state.companyId);
    var notes = [
      role ? "Role: " + role.label : "",
      seniority ? "Seniority: " + seniority.label : "",
      "Skills: " + (selectedSkillLabels().join(", ") || "not specified"),
      fluency ? "AI fluency: " + fluency.label : "",
      company ? "Company stage: " + company.label : ""
    ].filter(Boolean).join("\n");
    return {
      url: HUBSPOT_SUBMIT_URL,
      fields: [
        { name: "email", value: state.email },
        { name: "multi_step_form___name", value: state.personName || "" },
        { name: "multi_step_form___company", value: state.companyName || "" },
        { name: "multi_step_form___skills", value: selectedSkillLabels().join(";") },
        { name: "multi_step_form___specific_skills", value: selectedSkillLabels().join(", ") },
        { name: "multi_step_form___hiring_needs", value: notes }
      ],
      context: {
        pageUri: location.href,
        pageName: document.title
      }
    };
  }

  function emailDomain(email) {
    var parts = String(email || "").toLowerCase().split("@");
    return parts.length === 2 ? parts[1] : "";
  }

  function validateUnlock(form) {
    var email = (form.email.value || "").trim();
    var consent = form.consent.checked;
    if (!email) return { ok: false, code: "missing_email", message: "Enter your work email to continue." };
    if (!EMAIL_RE.test(email)) return { ok: false, code: "invalid_email", message: "Enter a valid email address." };
    if (FREE_DOMAINS[emailDomain(email)]) {
      return { ok: false, code: "free_email", message: "Use your work email. Personal inboxes stay closed for this step." };
    }
    if (!consent) return { ok: false, code: "missing_consent", message: "Agree to hear from BetterEngineer to continue." };
    return { ok: true, email: email };
  }

  function setFormStatus(message) {
    var el = document.getElementById("fe-form-status");
    if (el) el.textContent = message || "";
  }

  function afterUnlock() {
    state.unlocked = true;
    try { sessionStorage.setItem(LEAD_KEY, JSON.stringify(buildHubSpotSubmission())); } catch (err) { /* ignore */ }
    var intent = state.gateIntent;
    if (intent && intent.type === "profile" && intent.id) {
      go("profile", { profileId: intent.id });
      return;
    }
    if (intent && intent.type === "more") state.showMore = true;
    go("results");
  }

  function openProfile(id) {
    if (!matchApi().findById(id)) return;
    state.profileId = id;
    if (!state.unlocked) {
      state.gateIntent = { type: "profile", id: id };
      save();
      track("find_engineers_more_click", { funnel_target: "profile", funnel_profile_id: id });
      go("unlock");
      return;
    }
    go("profile", { profileId: id });
  }

  function choose(field, value) {
    if (field === "seniority") {
      state.seniorityId = value;
      state.senioritySkipped = false;
    } else if (field === "fluency") {
      state.fluencyId = value;
      state.fluencySkipped = false;
    } else if (field === "company") {
      state.companyId = value;
      state.companySkipped = false;
    }
    save();
    track("find_engineers_step_complete", { funnel_completed_step: state.step });
    go(nextStep(state.step));
  }

  function toggleSkill(id) {
    var index = state.skillIds.indexOf(id);
    if (index === -1) state.skillIds.push(id);
    else state.skillIds.splice(index, 1);
    save();
    render({ track: false, focus: false, stepChange: false });
  }

  function addCustomSkill(raw) {
    var label = String(raw || "").trim().replace(/\s+/g, " ");
    if (!label) return;
    var id = tax().canonicalSkill(label);
    var known = tax().skillById(id);
    if (!known) state.customLabels[id] = label;
    if (state.skillIds.indexOf(id) === -1) state.skillIds.push(id);
    save();
    render({ track: false, focus: false, stepChange: false });
    var input = document.getElementById("fe-custom-skill");
    if (input) input.focus();
  }

  function skipStep() {
    var step = state.step;
    track("find_engineers_step_skip", { funnel_skipped_step: step });
    if (step === "seniority") {
      state.seniorityId = null;
      state.senioritySkipped = true;
    } else if (step === "fluency") {
      state.fluencyId = null;
      state.fluencySkipped = true;
    } else if (step === "company") {
      state.companyId = null;
      state.companySkipped = true;
    }
    var next = nextStep(step);
    save();
    go(next);
  }

  function nextStep(step) {
    var index = WIZARD.indexOf(step);
    if (index < 0) return "seniority";
    if (index >= WIZARD.length - 1) return "searching";
    return WIZARD[index + 1];
  }

  function prevStep(step) {
    var index = WIZARD.indexOf(step);
    if (index <= 0) return "role";
    return WIZARD[index - 1];
  }

  function continueStep() {
    if (state.step !== "skills" && !chosenValue(state.step)) return;
    track("find_engineers_step_complete", { funnel_completed_step: state.step });
    go(nextStep(state.step));
  }

  function startOver() {
    track("find_engineers_start_over");
    clearSearchTimer();
    state = blankState();
    ui.suggestOpen = false;
    ui.summaryOpen = false;
    lastTracked = "";
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(LEAD_KEY);
    } catch (err) { /* ignore */ }
    history.pushState({ step: "role" }, "", "#/");
    render({ track: true, focus: true, stepChange: true });
  }

  function onRoleInput(event) {
    state.roleQuery = event.target.value;
    var exact = tax().exactRole(state.roleQuery);
    state.roleId = exact ? exact.id : null;
    ui.suggestOpen = !!roleQueryText();
    ui.suggestIndex = 0;
    save();
    paintSuggestions();
    syncRoleButton();
  }

  function moveSuggest(delta) {
    if (!ui.suggestOpen || !roleQueryText()) return;
    var roles = tax().searchRoles(state.roleQuery);
    if (!roles.length) return;
    ui.suggestIndex = (ui.suggestIndex + delta + roles.length) % roles.length;
    paintSuggestions();
  }

  function selectActiveSuggestion() {
    var roles = tax().searchRoles(state.roleQuery);
    var role = roles[ui.suggestIndex] || tax().exactRole(state.roleQuery);
    if (!role) return;
    state.roleId = role.id;
    state.roleQuery = role.label;
    ui.suggestOpen = false;
    save();
    var input = document.getElementById("fe-role-input");
    if (input) input.value = role.label;
    paintSuggestions();
    syncRoleButton();
  }

  function onClick(event) {
    var trigger = event.target.closest("[data-action]");
    if (!trigger) {
      if (ui.suggestOpen && !event.target.closest(".fe-search")) {
        ui.suggestOpen = false;
        paintSuggestions();
      }
      return;
    }
    var action = trigger.getAttribute("data-action");
    if (action === "select-role") {
      event.preventDefault();
      var picked = tax().roleById(trigger.getAttribute("data-role-id"));
      if (!picked) return;
      state.roleId = picked.id;
      state.roleQuery = picked.label;
      ui.suggestOpen = false;
      save();
      var input = document.getElementById("fe-role-input");
      if (input) input.value = picked.label;
      paintSuggestions();
      syncRoleButton();
      return;
    }
    if (action === "choose") {
      choose(trigger.getAttribute("data-field"), trigger.getAttribute("data-value"));
      return;
    }
    if (action === "toggle-skill") {
      toggleSkill(trigger.getAttribute("data-skill-id"));
      return;
    }
    if (action === "toggle-summary") {
      ui.summaryOpen = !ui.summaryOpen;
      render({ track: false, focus: false, stepChange: false });
      return;
    }
    if (action === "continue") {
      continueStep();
      return;
    }
    if (action === "skip") {
      skipStep();
      return;
    }
    if (action === "back") {
      track("find_engineers_step_back", { funnel_from_step: state.step });
      go(prevStep(state.step));
      return;
    }
    if (action === "back-results") {
      track("find_engineers_step_back", { funnel_from_step: state.step });
      go("results");
      return;
    }
    if (action === "adjust") {
      track("find_engineers_step_back", { funnel_from_step: "results", funnel_target: "seniority" });
      go("seniority");
      return;
    }
    if (action === "see-profiles") {
      state.gateIntent = { type: "shortlist" };
      save();
      track("find_engineers_more_click", { funnel_target: "shortlist" });
      go("unlock");
      return;
    }
    if (action === "more") {
      if (!state.unlocked) {
        state.gateIntent = { type: "more" };
        save();
        track("find_engineers_more_click", { funnel_target: "additional" });
        go("unlock");
        return;
      }
      state.showMore = !state.showMore;
      save();
      render({ track: false, focus: false, stepChange: false });
      return;
    }
    if (action === "open-profile") {
      openProfile(trigger.getAttribute("data-profile-id"));
      return;
    }
    if (action === "request-intro") {
      var id = trigger.getAttribute("data-profile-id");
      state.introRequested[id] = true;
      save();
      track("find_engineers_intro_request", { funnel_profile_id: id });
      render({ track: false, focus: false, stepChange: false });
      return;
    }
    if (action === "start-over") {
      startOver();
    }
  }

  function onSubmit(event) {
    var form = event.target;
    if (form.id === "fe-role-form") {
      event.preventDefault();
      if (ui.suggestOpen) selectActiveSuggestion();
      if (!state.roleId) {
        ui.suggestOpen = !!roleQueryText();
        paintSuggestions();
        return;
      }
      track("find_engineers_step_complete", { funnel_completed_step: "role" });
      go("seniority");
      return;
    }
    if (form.id === "fe-add-skill") {
      event.preventDefault();
      addCustomSkill(form.skill.value);
      return;
    }
    if (form.id === "fe-unlock-form") {
      event.preventDefault();
      var result = validateUnlock(form);
      if (!result.ok) {
        setFormStatus(result.message);
        track("find_engineers_unlock_error", { funnel_error: result.code });
        var emailInput = document.getElementById("fe-email");
        if (emailInput && result.code !== "missing_consent") emailInput.focus();
        return;
      }
      state.email = result.email;
      state.personName = (form.name.value || "").trim();
      state.companyName = (form.company.value || "").trim();
      save();
      track("find_engineers_unlock_submit", { funnel_email_domain: emailDomain(result.email) });
      afterUnlock();
    }
  }

  function onKey(event) {
    if (state.step === "role" && event.target && event.target.id === "fe-role-input") {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveSuggest(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveSuggest(-1);
      } else if (event.key === "Escape") {
        ui.suggestOpen = false;
        paintSuggestions();
      }
      return;
    }
    if (event.key === "Enter" && event.target && event.target.id === "fe-custom-skill") {
      event.preventDefault();
      addCustomSkill(event.target.value);
      return;
    }
    if (event.key !== "Enter") return;
    if (event.target && (event.target.closest("form") || event.target.closest("button") || event.target.closest("a"))) return;
    var button = document.querySelector("[data-action='continue']");
    if (button && !button.disabled) {
      event.preventDefault();
      continueStep();
    }
  }

  function syncAddSkillButton() {
    var input = document.getElementById("fe-custom-skill");
    var form = document.getElementById("fe-add-skill");
    var button = form ? form.querySelector("button") : null;
    if (!input || !button) return;
    button.disabled = !String(input.value || "").trim();
  }

  function boot() {
    load();
    var parsed = parseHash();
    state.step = resolveStep(parsed);
    save();
    var hash = hashFor(state.step, state.profileId);
    if (location.hash !== hash) history.replaceState({ step: state.step }, "", hash);
    render({ track: true, focus: false, stepChange: false });
  }

  document.addEventListener("click", onClick);
  document.addEventListener("submit", onSubmit);
  document.addEventListener("keydown", onKey);
  document.addEventListener("input", function (event) {
    if (event.target && event.target.id === "fe-role-input") onRoleInput(event);
    if (event.target && event.target.id === "fe-custom-skill") syncAddSkillButton();
  });
  document.addEventListener("focusin", function (event) {
    if (event.target && event.target.id === "fe-role-input") {
      ui.suggestOpen = !!roleQueryText();
      paintSuggestions();
    }
  });
  document.addEventListener("focusout", function (event) {
    if (!event.target || event.target.id !== "fe-role-input") return;
    setTimeout(function () {
      var active = document.activeElement;
      if (!active || !active.closest || !active.closest(".fe-search")) {
        ui.suggestOpen = false;
        paintSuggestions();
      }
    }, 0);
  });
  document.addEventListener("mousedown", function (event) {
    if (event.target.closest("[data-action='select-role']")) event.preventDefault();
  });
  window.addEventListener("popstate", function () {
    clearSearchTimer();
    var parsed = parseHash();
    state.step = resolveStep(parsed);
    save();
    render({ track: true, focus: true, stepChange: true });
  });

  root.BEFindFlow = {
    getState: function () { return state; },
    buildHubSpotSubmission: buildHubSpotSubmission,
    steps: FUNNEL
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
