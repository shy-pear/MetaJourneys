# The Journeys Case 🧭

A lightweight, deployable Streamlit dashboard that builds a structured, evidence-based case for
whether Meta should launch **Journeys** — a progress-documentation social format for Instagram.

It assembles **real public data** into a structured argument and keeps a hard line between
what is measured and what is assumed. Every number is tagged:

- `MEASURED` — real public data (filing, dataset, official statement)
- `DERIVED` — computed/reasoned from measured data
- `MODELED` — an assumption, user-adjustable (all Journeys projections)
- `FLAGGED` — wanted but not publicly disclosed (see `data/SOURCES.md`)

## Tabs
1. **Overview** — the project + the Journeys product/problem + the data legend
2. **Launch track record** — what separates Meta's wins from failures (the analytical spine)
3. **Positioning score** — does Journeys fit that win pattern?
4. **Behavior patterns** — is there room/unmet need in current user behavior?
5. **Tailwinds & headwinds** — do macro trends support or undercut it?
6. **Adoption & revenue model** — interactive, stress-testable sliders
7. **Long-term strategy** — the ecosystem flywheel (Meta AI → Reels → Facebook → glasses)
8. **The Case** — consolidated verdict, risk panel, recommendations (updates with the model)

Every chart and table has a written **Conclusion**, and every tab ends with an **overarching
conclusion**.

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
