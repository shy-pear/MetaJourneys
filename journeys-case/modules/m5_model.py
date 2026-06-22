"""Module 5 - Adoption & revenue model (the interactive core).

Question: if it works, how big is it - and how sensitive is that to assumptions?
Base = MEASURED Instagram MAU. Everything else is MODELED via sliders.
Results are written to st.session_state['model'] so the synthesis tab reacts live.
"""
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

from components.data import load_csv, load_assumptions
from components.callouts import conclusion, tab_conclusion, caption_tag


def compute(base_m, adoption, repeat, retention, arpu, fpj):
    """Pure model. Returns a dict of MODELED outputs (millions / USD bn)."""
    starters = base_m * adoption / 100.0
    active = starters * repeat / 100.0
    retained = active * retention / 100.0
    reach = retained * (1 + fpj)                 # creators + opt-in 'follow along' audience
    revenue_bn = reach * arpu / 1000.0           # reach(millions) * $/yr / 1000 -> $bn/yr
    return {"starters": starters, "active": active, "retained": retained,
            "reach": reach, "revenue_bn": revenue_bn,
            "pct_of_base": 100.0 * retained / base_m}


def verdict(revenue_bn, cfg):
    v = cfg["verdict"]
    if revenue_bn >= v["go_above_usd_bn"]:
        return "GO", "#1a7f37"
    if revenue_bn >= v["refine_above_usd_bn"]:
        return "REFINE", "#9a6700"
    return "NO-GO", "#cf222e"


def render():
    cfg = load_assumptions()
    m = cfg["model"]
    rng = cfg["ranges"]

    st.header("Module 5 — Adoption & revenue model")
    st.markdown("Whole module is **MODELED**. The only MEASURED input is the Instagram user "
                "base; every slider is an assumption you can stress-test. Outputs update live "
                "and feed the final 'The Case' tab.")
    caption_tag("MODELED", "interactive assumption model — not a forecast")

    base = st.number_input(
        "Instagram MAU base (millions) — MEASURED-with-caveat (see 📄 Sources)",
        value=float(m["ig_mau_base_millions"]), step=100.0,
        help="Default 2,400M = businesstats.com 2026 estimate. Public estimates range "
             "~2,000M (Backlinko) to 3,000M (Meta CEO, Sept 2025). Edit to stress-test.")

    def _slider(label, key, default, help=None):
        lo, hi, step = rng[key]
        return st.slider(label, min_value=float(lo), max_value=float(hi), step=float(step),
                         value=float(default), help=help)

    c1, c2 = st.columns(2)
    with c1:
        adoption = _slider("Year-1 adoption: % of IG users who start a Journey",
                           "adoption_pct", m["adoption_pct"])
        repeat = _slider(
            "% of starters who post repeatedly (become active creators)",
            "repeat_poster_pct", m["repeat_poster_pct"],
            help="Anchored to creator-participation research: the 90-9-1 rule put active "
                 "creators at ~1% of a general population, rising to ~23% on modern platforms. "
                 "People who START a Journey are already self-selected creators, so the default "
                 "(40%) sits above that population rate. See the benchmark table below.")
    with c2:
        retention = _slider(
            "% of active creators retained after the ramp",
            "retention_pct", m["retention_pct"],
            help="Default 32% is anchored to the closest real analog: fitness apps average "
                 "~31% 90-day retention, and Strava's gamified Challenges lifted its 90-day "
                 "retention from 18% to 32% — the same kind of completion/follow-along hooks "
                 "Journeys uses.")
        arpu = _slider("Incremental annual ad ARPU per engaged person ($)",
                       "incremental_arpu_usd", m["incremental_arpu_usd"])
    fpj = m["followers_per_journey"]

    r = compute(base, adoption, repeat, retention, arpu, fpj)
    st.session_state["model"] = {**r, "verdict": verdict(r["revenue_bn"], cfg)[0]}

    # --- Funnel outputs -----------------------------------------------------
    st.subheader("1. Adoption funnel (modeled)")
    k1, k2, k3, k4 = st.columns(4)
    k1.metric("Start a Journey", f"{r['starters']:.0f}M")
    k2.metric("Active creators", f"{r['active']:.0f}M")
    k3.metric("Retained", f"{r['retained']:.0f}M")
    k4.metric("Total reach", f"{r['reach']:.0f}M")
    conclusion(
        f"At these assumptions, ~{r['starters']:.0f}M users start a Journey in year 1, "
        f"~{r['retained']:.0f}M become sustained creators (~{r['pct_of_base']:.1f}% of the IG "
        f"base), and with opt-in followers the format reaches ~{r['reach']:.0f}M people. The "
        "funnel is highly sensitive to the retention slider — sustaining the posting habit is "
        "the make-or-break variable, matching Module 2's flagged weak axis.")

    # --- Benchmark grounding for the two habit assumptions -----------------
    with st.expander("📊 What real data anchors the 'repeat-poster' and 'retention' sliders?"):
        bm = load_csv("retention_benchmarks.csv")
        st.dataframe(bm[["benchmark", "value", "unit", "context", "type"]],
                     width='stretch', hide_index=True)
        caption_tag("MEASURED", "creator-participation & retention analogs (Nielsen, "
                                "fitness-app data, Strava)")
        conclusion(
            "These analogs bound the two most important sliders. **Repeat-posting (active "
            "creators):** participation inequality puts general-population creators at ~1% "
            "(90-9-1), rising to ~23% on modern platforms — that ~23% is the *floor* here, since "
            "people who start a Journey are already self-selected creators, so the 40% default "
            "sits above it. **Retention:** the closest analog is fitness apps "
            "(~31% at 90 days, ~19% annually), and critically, Strava's gamified Challenges "
            "lifted 90-day retention from 18% to 32% — evidence that completion summaries and "
            "follow-along social reward, which Journeys is built around, materially improve "
            "sustained creation. The 32% default assumes Journeys achieves Strava-with-Challenges "
            "level retention; drop it toward ~19% for a no-engagement-lift scenario.")

    # --- Revenue ------------------------------------------------------------
    st.subheader("2. Modeled incremental annual revenue")
    v_label, v_color = verdict(r["revenue_bn"], cfg)
    st.markdown(
        f"<div style='font-size:2.2rem;font-weight:800;color:{v_color};'>"
        f"${r['revenue_bn']:.2f}B / yr &nbsp;<span style='font-size:1.1rem;'>"
        f"→ {v_label}</span></div>", unsafe_allow_html=True)
    conclusion(
        f"Modeled incremental ad revenue is **${r['revenue_bn']:.2f}B/yr** from improved "
        "high-intent targeting alone (before any sponsored guidance or commerce). Verdict "
        f"thresholds: ≥${cfg['verdict']['go_above_usd_bn']}B = GO, "
        f"≥${cfg['verdict']['refine_above_usd_bn']}B = REFINE. This is indirect revenue only and "
        "deliberately conservative — the larger upside (sponsored recommendations, commerce) is "
        "not modeled here.")

    # --- Sensitivity --------------------------------------------------------
    st.subheader("3. Sensitivity to adoption rate")
    xs = [x / 2 for x in range(2, int(rng["adoption_pct"][1] * 2) + 1)]
    ys = [compute(base, x, repeat, retention, arpu, fpj)["revenue_bn"] for x in xs]
    sdf = pd.DataFrame({"Adoption %": xs, "Revenue $B/yr": ys})
    fig = px.line(sdf, x="Adoption %", y="Revenue $B/yr", markers=False)
    fig.add_vline(x=adoption, line_dash="dash", line_color="#8250df",
                  annotation_text="current")
    fig.add_hline(y=cfg["verdict"]["go_above_usd_bn"], line_dash="dot", line_color="#1a7f37",
                  annotation_text="GO")
    fig.update_layout(height=360)
    st.plotly_chart(fig, width='stretch')
    conclusion(
        "Revenue scales roughly linearly with adoption. The model crosses the GO threshold only "
        "above a meaningful adoption rate — so the case depends on Journeys becoming a "
        "mainstream behavior, not a niche one, which is exactly why the format is anchored to "
        "broad 'life chapters,' not just self-improvement.")

    # --- Anchor curve -------------------------------------------------------
    st.subheader("4. Reality check: how fast did an embedded Meta feature actually scale?")
    anchors = load_csv("adoption_anchors.csv")
    stories = anchors[anchors["product"] == "Instagram Stories"]
    caption_tag("MEASURED", "Instagram Stories daily active users after launch (anchor)")
    fig2 = go.Figure()
    fig2.add_trace(go.Scatter(x=stories["months_since_launch"], y=stories["value_millions"],
                              mode="lines+markers", name="Stories DAU", line_color="#1a7f37"))
    fig2.add_hline(y=r["starters"], line_dash="dash", line_color="#8250df",
                   annotation_text="Your modeled Yr-1 starters")
    fig2.update_layout(height=360, xaxis_title="Months since launch",
                       yaxis_title="Users (millions)")
    st.plotly_chart(fig2, width='stretch')
    conclusion(
        "Instagram Stories — an embedded, graph-leveraged feature — scaled from 0 to 500M daily "
        "users in ~29 months. That is the empirical ceiling for what aggressive embedded "
        "adoption looks like. Your modeled year-1 starters should sit *below* that curve to stay "
        "credible; if your slider pushes it above, you are assuming faster-than-Stories uptake.")

    tab_conclusion(
        "Adoption & revenue model",
        "Even on conservative, indirect-revenue-only assumptions, plausible adoption produces a "
        "material revenue line, and the upside is asymmetric because sponsored guidance and "
        "commerce are excluded. The model's sensitivity is concentrated in <b>retention / "
        "habit-formation</b> and <b>adoption breadth</b> — confirming that the strategic bet is "
        "not 'will it monetize' but 'will people keep posting.' Anchored against the real Stories "
        "curve, the assumptions are aggressive-but-not-fantastical.")
