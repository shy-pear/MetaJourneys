# Project Brief: "Journeys Case" — A Data-Driven Product Validation Dashboard

A lightweight, deployable app that builds a structured, evidence-based case for whether
Meta should launch "Journeys" (a progress-documentation social format for Instagram).

---

## 0. What this app actually proves (read this first)

No public dataset can prove a product will succeed. Meta's internal launch metrics and
cross-app behavioral data are not published. So be honest about what this tool does:

- It **does**: assemble real public data into a structured argument, score Journeys against
  the historical pattern of Meta's wins, surface trend tailwinds/headwinds, and run a
  transparent adoption/revenue model you can stress-test.
- It **does not**: forecast actual adoption. The Journeys-specific projections are an
  explicit *assumption model*, clearly labeled as such, not empirical prediction.

The credibility of this dashboard comes from separating "this is real measured data" from
"this is a modeled assumption." Keep that line visible everywhere in the UI.

---

## 1. Data: real vs. modeled

Tag every number in the app as one of three types, with a visible legend:

| Tag | Meaning | Example |
|-----|---------|---------|
| `MEASURED` | Sourced from a public dataset/filing | Meta MAU, ARPU, Reels rollout dates |
| `DERIVED` | Computed from measured data | Launch success rate, ARPU growth rate |
| `MODELED` | Your assumption, user-adjustable | Journeys adoption %, incremental ARPU |

A reviewer should be able to see at a glance which parts of the case rest on evidence and
which rest on assumptions. This is the single most important design rule.

---

## 2. Data sources & acquisition checklist

Have Claude Code gather these into a `/data` folder as CSVs. Pull **current** figures — do
not hardcode any numbers from memory.

**Meta performance (MEASURED)**
- Meta quarterly earnings releases + 10-K/10-Q (investor.fb.com / SEC EDGAR): family DAU/MAU,
  ARPU by region, ad revenue, "Reality Labs" segment results.
- Instagram / app-level MAU where Meta has disclosed it publicly.

**Meta product launch history (MEASURED + DERIVED)**
- Build a hand-curated CSV of major launches: Stories, Reels, IGTV, Threads, Shops,
  Marketplace, Live, Live Shopping, Lasso, Slingshot, Poke, Notes, Broadcast Channels.
- Per launch: launch date, what behavior it ported, which surface it embedded in, whether it
  leveraged the existing social graph, documented adoption milestone, and a success verdict
  (win / mixed / killed). Sources: Meta newsroom, press coverage, public adoption stats.

**Social media usage trends (MEASURED)**
- DataReportal "Digital ___" global reports (free, excellent): time spent, platform usage,
  posting behavior.
- Pew Research Center social media fact sheets & reports (US, free).
- Public app-analytics summaries (e.g., data.ai / Sensor Tower press figures) for download
  and engagement trends where available.

**Behavioral shift signals (MEASURED, for the trend thesis)**
- Documented decline of public/original sharing and the shift toward Stories, DMs, and
  close-friends posting ("context collapse" / the move to private sharing). Sourced from
  industry reporting and platform statements.

Where a source is a PDF or behind friction, populate the CSV manually and cite it in a
`SOURCES.md`. Every CSV row gets a `source_url` column.

---

## 3. Dashboard modules

Five analysis modules + one synthesis view. Each module states its question, its data, and
its output.

### Module 1 — Meta's launch track record (the analytical spine)
- **Question:** What pattern separates Meta's product wins from its failures?
- **Data:** the launch-history CSV.
- **Output:** a timeline + a scored table. Compute a `DERIVED` success rate, then test the
  hypothesis that wins cluster around three traits: (a) ported a proven behavior, (b) embedded
  in an existing high-traffic surface, (c) leveraged the existing social graph. Visualize win
  rate split by whether each trait was present.
- **Why it matters:** this pattern becomes the rubric Journeys is scored against. It's also
  the most data-rich, defensible part of the case.

### Module 2 — Journeys positioning score
- **Question:** Does Journeys fit the win pattern from Module 1?
- **Data:** the Module 1 traits, applied to Journeys as a rubric.
- **Output:** a radar or scorecard rating Journeys on each success trait plus new-behavior
  cost and monetization clarity, with written justification per axis. Clearly `MODELED`/
  judgment, but anchored to the empirical pattern.

### Module 3 — Cross-app & posting-behavior patterns
- **Question:** What is current user behavior, and does it leave room for Journeys?
- **Data:** DataReportal + Pew + earnings.
- **Output:** charts of time-spent, Stories vs. feed vs. Reels usage, posting-frequency
  trends, and the public-sharing decline. The key read: is there an unmet need for a
  lower-pressure, progress-oriented format?

### Module 4 — Social media trend tailwinds & headwinds
- **Question:** Do macro trends support or undercut Journeys?
- **Data:** trend datasets + a curated tailwind/headwind list.
- **Output:** a two-column board. Tailwinds (authenticity over curation, decline of the
  perfect grid, creator economy growth, BeReal-style realness demand). Headwinds (notification
  fatigue, format saturation, declining public posting). Each item linked to a source.

### Module 5 — Adoption & revenue model (the interactive core)
- **Question:** If it works, how big is it — and how sensitive is that to assumptions?
- **Data:** `MEASURED` Instagram MAU as the base; `MODELED` sliders for everything else.
- **Output:** sliders for adoption rate, % who post repeatedly, retention curve, and
  incremental ad ARPU. Live-update engagement and revenue estimates. Seed the adoption
  assumptions against analogous real rollouts (how fast Stories/Reels scaled) shown as
  reference lines, so the model is anchored, not invented. Label the whole module `MODELED`.

### Synthesis view — "The Case"
- A single dashboard landing page: positioning score, win-pattern fit, trend balance,
  modeled upside range, and an explicit risk panel (the void / cold-start problem,
  abandonment, format saturation). End with a go / refine / no-go style summary that updates
  with the model sliders.

---

## 4. Tech stack & architecture

Recommended for "lightweight + deployable":
- **Streamlit** (Python). Purpose-built for interactive data dashboards, fast to build,
  trivial to deploy free on Streamlit Community Cloud. Best fit for this.
- **pandas** for data processing, **Plotly** or **Altair** for charts.
- Data in `/data/*.csv`; model assumptions in a `config/assumptions.yaml` so they're editable
  without touching code.

Alternative if you want a more polished web app: Next.js + Recharts, deployed on Vercel.
More effort, nicer UI. Only choose this if presentation matters more than speed.

Suggested structure:
```
journeys-case/
  data/            CSVs + SOURCES.md
  config/          assumptions.yaml
  modules/         one .py per analysis module
  app.py           Streamlit entry, tabs per module
  README.md
```

---

## 5. Build sequence (give Claude Code these in order)

1. Scaffold the repo, Streamlit shell with empty tabs, and the `MEASURED/DERIVED/MODELED`
   legend component.
2. Build the launch-history CSV + Module 1 (the spine). Validate the win-pattern hypothesis
   before anything else — if the pattern doesn't hold, the whole case changes.
3. Module 3 + 4 (behavior + trends) from public data.
4. Module 2 (positioning score) built on Module 1's rubric.
5. Module 5 (interactive model) with anchored reference curves.
6. Synthesis view + risk panel.
7. Polish, source citations, deploy.

Build incrementally and commit after each module so nothing is lost.

---

## 6. Deployment

- Push to a GitHub repo, connect Streamlit Community Cloud, deploy free.
- Add a one-line disclaimer in the footer: independent analysis using public data; not
  affiliated with Meta; Journeys projections are modeled assumptions.

---

## 7. Stretch goals (optional)

- Sentiment/volume analysis of public discussion around adjacent features (Stories,
  Close Friends, BeReal) as a proxy for appetite.
- A "comparable feature adoption curve" library so the model can be re-anchored to different
  analogs.
- Export-to-PDF of "The Case" view for sharing.

---

## 8. Kickoff prompt for Claude Code

> I want to build a lightweight, deployable Streamlit dashboard that makes a data-driven case
> for a hypothetical Instagram feature called "Journeys" (a progress-documentation social
> format). Follow the attached project brief. Start with step 1 of the build sequence:
> scaffold the repo and the Streamlit shell with tabs for each module and a visible
> MEASURED/DERIVED/MODELED data-type legend. Then stop and show me the structure before
> building Module 1. Pull all real figures from current public sources — do not hardcode
> numbers from memory — and add a source_url for every data row. Flag clearly anywhere the
> data I need isn't publicly available so we can decide how to model it.
