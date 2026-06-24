# Sources & Data Status

Every CSV row carries a `type` tag and a `source_url`. This file documents provenance and,
critically, **what is verified public data vs. what is not publicly available** and would need
user-provided access.

## Data-type legend
- **MEASURED** — sourced from a public dataset, filing, or official platform statement.
- **DERIVED** — computed or reasoned from measured data (e.g. a growth rate, a win rate, an
  analytical trend read).
- **MODELED** — an assumption or judgment, user-adjustable. All Journeys-specific projections
  are MODELED.
- **FLAGGED** — a number we wanted but that is **not publicly disclosed**; see NEEDS-INPUT.

## Primary sources
- **Meta Q1 2026 earnings** (Family DAP, ARPP, revenue, ad metrics) — Meta Investor Relations
  and CNBC earnings coverage (April 29, 2026).
  - https://investor.atmeta.com/investor-news/
  - https://www.cnbc.com/2026/04/29/meta-q1-earnings-report-2026.html
- **DataReportal — Digital 2026 Global Overview Report** (social users, time spent, per-app
  time, mobile share). https://datareportal.com/reports/digital-2026-global-overview-report
- **Pew Research Center — Americans' Social Media Use 2025** (US Instagram adoption by age).
  https://www.pewresearch.org/internet/2025/11/20/americans-social-media-use-2025/
- **Meta / Instagram newsroom** — launch dates and announcements for the launch-history CSV.
- **TechCrunch / The Verge** — adoption milestones and shutdown dates for launches and the
  Stories adoption curve.
- **Meta "privacy-focused vision" (2019)** and Mosseri statements — the public-sharing shift.
- **Creator/retention benchmarks** (`retention_benchmarks.csv`) — Nielsen/NN-g 90-9-1
  participation inequality, fitness-app retention (Lucid.now, Business of Apps), and Strava's
  gamified-Challenges retention lift (StriveCloud). Used to ground the Module 5 funnel
  assumptions (repeat-posting and retention) in real analog behavior.
- **Meta AI usage & intent evidence** (`meta_ai_comparison.csv`, `intent_evidence.csv`) —
  Meta AI scale and the ~4% daily/monthly ratio (Presenc, DemandSage); Google "micro-moments"
  high-intent demand (Think with Google via SEO Inc / Ptengine); personalization & product-
  recommendation conversion stats (Instapage, Clerk.io); plus the behavioral *fresh-start
  effect* and *implementation-intentions* literature (The Behavioral Scientist; NIH/PMC).
  Used in the "Meta AI deep-dive" feature tab.
- **Instagram Highlights** (`highlights_facts.csv`, `highlights_comparison.csv`,
  `highlights_strategy_phases.csv`) — Highlights launch and purpose (Instagram newsroom, Dec
  2017; TechCrunch); business/influencer adoption of Highlights (Social Tradia, inBeat). The
  capability comparison and phased Highlights→Journeys strategy are DERIVED/MODELED product
  analysis. General-user Highlights adoption is FLAGGED (not disclosed by Meta). Newer
  Highlights signals also feed the Product Case: set-and-forget **abandonment** (Hollyland —
  Instagram deletes neglected Highlights), Instagram **demoting** Highlights off the profile
  in 2024–25 (PiunikaWeb), and Instagram **engagement down ~26% YoY** (eMarketer). These refine
  the retention caution (Module 5 / The Case), add a tailwind + headwind (Module 4), and scope
  the demand claim (Overview, Module 2) — see notes below.
- **WhatsApp integration** (`whatsapp_usage.csv`, `whatsapp_accountability.csv`,
  `whatsapp_assessment.csv`) — WhatsApp scale, stickiness, group-chat share and US/India
  penetration (DemandSage, Infobip, WANotifier, Sinch, 2025–26); goal-accountability research
  (ASTD via Fast Company; group-goal studies via C'Meet It / Dataquest); and the Gollwitzer
  "announcing goals backfires" research (MIT Sloan Management Review). Help/hinder reads tagged
  DERIVED.

## DATA-STATUS / NEEDS-INPUT (not freely public — flagged per the brief)
1. **Instagram-only MAU by quarter.** Meta no longer breaks Instagram out in its filings.
   Public third-party estimates for 2026 cluster around **2.0B–3.0B**: businesstats.com reports
   **2.4B MAU / 1.6B DAU** (~8% YoY), Backlinko reports **2.0B**, and Meta's CEO stated
   Instagram passed **3.0B** in Sept 2025. We use **2.4B** as the model base (businesstats) and
   expose it as an editable input. Tagged MEASURED with this caveat.
   - https://businesstats.com/instagram-statistics/
   - https://backlinko.com/instagram-users
2. **In-app engagement split (Stories vs Feed vs Reels vs DMs time/posting share).** Not
   disclosed by Meta. Only third-party estimates exist (Sensor Tower / data.ai), largely
   paywalled. Marked FLAGGED in `sharing_shift.csv`. *Sensor Tower / data.ai API or report
   access would let us quantify this.*
3. **Public-discussion sentiment/volume** around adjacent features (Close Friends, BeReal,
   Notes) — a stretch goal. Requires X/Reddit API access. Out of scope this pass.

## Prototype
- `data/prototype.html` is a rough, clickable Phase-1 prototype of Journeys on Instagram,
  embedded in the **Prototype** tab. It is a React + TanStack Router (Vite) app — source in
  `../journeys-prototype` — built to a single self-contained HTML file (`vite-plugin-singlefile`,
  hash-history routing so it works inside the embed). All in-app content is mock/illustrative;
  the Meta AI panel uses hardcoded suggestions (no live API). Images/video load from the web.

## Modeled assumptions
- `config/assumptions.yaml` holds all Module 5 sliders and the Journeys scorecard. Every value
  there is MODELED and user-adjustable in the app.
- `data/rollout_roadmap.json` holds the phased rollout plan shown in the **Rollout roadmap**
  tab (7 phases, 0–6, plus the cross-cutting marketing track). It is a MODELED product strategy
  (phases, gates, go/adjust/kill decisions) derived from the project's rollout roadmap — not
  external public data.
- `data/marketing_plan.json` holds the **Launch marketing** tab content (positioning, pillars,
  the "Everyone Starts at Day One" campaign, beachhead waves, Founding Journeys program,
  channels, sequence, measurement, risks). MODELED marketing strategy from the launch marketing
  plan — not external public data.
- `data/npv_model.json` holds the **NPV analysis** tab (7-year DCF, phase costs, scenarios),
  ported from `meta-journeys-npv.xlsx`. ILLUSTRATIVE / MODELED — Meta's internal costs are not
  public. Updated vs the source: Instagram MAU 2.0B → 2.4B (latest, consistent with the
  Adoption & revenue model); NPV is independent of the MAU base, so headline outputs reproduce
  the workbook exactly (NPV ≈ $7.6B, B/C ≈ 8.3×). The mature ARPU is cross-checked against
  Meta's real Family ARPP (~$63/yr, derived from Q1 2026 ARPP $15.66/qtr in
  `meta_performance.csv`).
