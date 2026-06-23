# The Journeys Case 🧭

A lightweight, deployable Streamlit dashboard that builds a structured, evidence-based case for
whether Meta should launch **Journeys** — a progress-documentation social format for Instagram.

It assembles **real public data** into a structured argument and keeps a hard line between
what is measured and what is assumed. Every number is tagged:

- `MEASURED` — real public data (filing, dataset, official statement)
- `DERIVED` — computed/reasoned from measured data
- `MODELED` — an assumption, user-adjustable (all Journeys projections)
- `FLAGGED` — wanted but not publicly disclosed (see `data/SOURCES.md`)

## Structure
Five top-level tabs:

1. **📋 Overview** — the project + the Journeys product/problem + the data legend.

2. **📊 Analysis of Product Potential** — *is Journeys a good bet?* (dropdown):
   - **Launch track record** — what separates Meta's wins from failures (the analytical spine)
   - **Positioning score** — does Journeys fit that win pattern?
   - **Behavior patterns** — is there room/unmet need in current user behavior?
   - **Tailwinds & headwinds** — do macro trends support or undercut it?
   - **Adoption & revenue model** — interactive, stress-testable sliders

3. **🧭 Product Strategy** — *how it's built, sequenced, and taken to market* (dropdown):
   - **Long-term strategy** — the ecosystem flywheel (Meta AI → Reels → Facebook → glasses)
   - **Rollout roadmap** — interactive, metrics-gated 7-phase diagram + marketing track
   - **Launch marketing** — the "Everyone Starts at Day One" plan, presented interactively
   - **Meta AI deep-dive** — Meta AI in Journeys vs. as used today (high-intent adoption)
   - **Highlights & positioning** — the demand Highlights proved, and the archive-vs-arc strategy
   - **WhatsApp integration** — does the share/notify mechanic help or hinder adoption?

4. **💰 Financial Analysis** — an interactive 7-year discounted cash-flow / NPV model (ported
   from the NPV workbook): NPV / IRR / benefit-cost, phase cost-benefit, bear/base/bull
   sensitivity, and a reconciliation against the Adoption & revenue model and Meta's Family ARPP.

5. **✅ The Case** — the capstone: a five-move end-to-end argument synthesizing every tab, a live
   verdict, risk panel, recommendations, and points to consider.

Every chart and table has a written **Conclusion**, and every section ends with an
**overarching conclusion**.

## Run locally
```bash
pip install -r requirements.txt
streamlit run app.py
```

## Project structure
```
journeys-case/
  app.py                 # Streamlit entry, 7 tabs + sidebar legend
  config/assumptions.yaml# all MODELED assumptions (sliders, scorecard base)
  components/            # legend, conclusion callouts, cached data loaders
  modules/               # one file per tab
  data/                  # CSVs (every row tagged + source_url) + SOURCES.md
```

## Data status / what needs API access
See `data/SOURCES.md`. Not freely public (flagged):
1. **Instagram-only MAU** — Meta no longer discloses it; public estimates range ~2.0B
   (Backlinko) to 3.0B (Meta CEO, Sept 2025). Base uses businesstats.com's 2.4B (2026) and is
   editable in the model. An authoritative figure would tighten it.
2. **In-app engagement split** (Stories vs Feed vs Reels) — only paywalled third-party
   estimates (Sensor Tower / data.ai).
3. **Public-discussion sentiment** — needs X/Reddit API (stretch, deferred).

## Deploy (free)
Push to a GitHub repo, connect [Streamlit Community Cloud](https://share.streamlit.io), point
it at `app.py`. No secrets required.

## Disclaimer
Independent analysis using public data. Not affiliated with Meta. Journeys is a hypothetical
product; all Journeys-specific projections are modeled assumptions, not forecasts.
