# Tech Icon Grid Reference

## CSS block (add once to `<head>`, before `</head>`)

```html
<style>.air-tech-icons{display:grid;grid-template-columns:repeat(5,1fr);gap:1.75rem 1rem}.air-tech-icon{display:flex;flex-direction:column;align-items:center;gap:.85rem}.air-tech-icon img{width:54px;height:54px;object-fit:contain}.air-tech-icon span{font-size:.8rem;color:#374151;font-weight:600;text-align:center;line-height:1.3}@media(max-width:768px){.air-tech-icons{gap:1.4rem .75rem}}@media(max-width:600px){.air-tech-icons{grid-template-columns:repeat(4,1fr)}}@media(max-width:380px){.air-tech-icons{grid-template-columns:repeat(3,1fr);gap:1.1rem .6rem}}</style>
```

## Icon grid HTML (replaces the static `<img>` in `#tech-stack`)

Replace this block:
```html
<div class="reveal"> <img src="/images/roles/front-end-engineers/technologies-stack.png" alt="..." loading="lazy"> </div>
```

With:
```html
<div class="reveal"> <div class="air-tech-icons" aria-label="Technologies {role} engineers work with"> <div class="air-tech-icon"><img src="{CDN_URL}" alt="{Label}" width="54" height="54" loading="lazy"><span>{Label}</span></div> ... (10 icons total) </div> </div>
```

---

## CDN sources

**Simple Icons** (flat brand SVGs, colour matches brand):
```
https://cdn.simpleicons.org/{slug}
```
Browse slugs at [simpleicons.org](https://simpleicons.org) or search GitHub `simple-icons/simple-icons`.

**Devicons** (richer, coloured tech icons — fallback when Simple Icons doesn't have the logo):
```
https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/{name}/{name}-original.svg
```

---

## Verified slugs by role (all HTTP-checked OK)

### Front-End Engineers
`react` · `typescript` · `javascript` · `nextdotjs` · `tailwindcss` · `figma` · `vite` · `storybook`
Devicons fallback for: `css3` → `css3/css3-original.svg` · `html5` → `html5/html5-original.svg`

### Full Stack Engineers
`react` · `typescript` · `nodedotjs` · `python` · `postgresql` · `docker` · `graphql` · `redis` · `mongodb` · `kubernetes`

### Back End Engineers
`python` · `nodedotjs` · `go` · `postgresql` · `redis` · `docker` · `apachekafka` · `graphql` · `kubernetes` · `nginx`

### Data Engineers
`python` · `apacheairflow` · `databricks` · `apachespark` · `snowflake` · `postgresql` · `googlebigquery` · `apachekafka` · `docker` · `googlecloud`

### Data Science Engineers
`python` · `tensorflow` · `pytorch` · `scikitlearn` · `jupyter` · `pandas` · `numpy` · `r` · `apachespark` · `databricks`

### Mobile Engineers
`swift` · `kotlin` · `react` · `flutter` · `dart` · `android` · `firebase` · `figma` · `typescript` · `xcode`

### AI Engineers
`python` · `openai` · `pytorch` · `tensorflow` · `fastapi` · `docker` · `postgresql` · `redis` · `kubernetes` · `jupyter`

### DevOps Engineers
`docker` · `kubernetes` · `terraform` · `githubactions` · `ansible` · `prometheus` · `grafana` · `linux` · `nginx` · `jenkins`

### QA Engineers
`cypress` · `selenium` · `jest` · `postman` · `githubactions` · `jira` · `python` · `javascript` · `typescript`
Devicons fallback for: `playwright` → `playwright/playwright-original.svg`

---

## Known broken / unavailable slugs on Simple Icons

| Technology | Broken slug | Working alternative |
|------------|-------------|---------------------|
| CSS3 | `css3` | Devicons `css3/css3-original.svg` |
| HTML5 | `html5` | Devicons `html5/html5-original.svg` |
| Playwright | `playwright` | Devicons `playwright/playwright-original.svg` |
| Java | `java` | Devicons `java/java-original.svg` |
| AWS | `amazonwebservices` | Devicons `amazonwebservices/amazonwebservices-original-wordmark.svg` |

## Tips

- Use `node audit-pages.js` after adding a new page to HTTP-check all icon URLs.
- If an icon looks broken in the browser, open DevTools → Network and check for 404 on the CDN URL. Swap the slug using the table above or find the correct slug at simpleicons.org.
- Aim for 10 icons per role. 5 columns × 2 rows is the target layout.
