"""Tab 7 - The Case: consolidates every module + risk panel + recommendations.

The modeled upside and verdict update live from the Module 5 sliders via session_state.
"""
import streamlit as st

from components.data import load_csv, load_assumptions
from components.callouts import conclusion, tab_conclusion
from components.legend import badge
from modules.m5_model import compute, verdict


def _model_state():
    """Pull live model from session_state, or compute defaults if Module 5 not yet opened."""
    if "model" in st.session_state:
        return st.session_state["model"]
    cfg = load_assumptions(); m = cfg["model"]
    r = compute(m["ig_mau_base_millions"], m["adoption_pct"], m["repeat_poster_pct"],
                m["retention_pct"], m["incremental_arpu_usd"], m["followers_per_journey"])
    r["verdict"] = verdict(r["revenue_bn"], cfg)[0]
    return r


def render():
    st.header("The Case — consolidated analysis & recommendation")
    st.caption("Everything above, in one view. The modeled numbers update live with the "
               "Module 5 sliders.")

    # --- pull the threads together -----------------------------------------
    lh = load_csv("launch_history.csv")
    win_rate = 100.0 * (lh["verdict"] == "win").mean()
    sc = load_csv("journeys_scorecard.csv")
    score_avg = sc["score"].mean()
    th = load_csv("tailwinds_headwinds.csv")
    n_tw = int((th["direction"] == "tailwind").sum())
    n_hw = int((th["direction"] == "headwind").sum())
    model = _model_state()

    # --- Scorecard row ------------------------------------------------------
    st.subheader("1. The case at a glance")
    a, b, c, d = st.columns(4)
    a.metric("Win-pattern fit (Module 2)", f"{score_avg:.1f}/5")
    b.metric("Meta baseline win rate", f"{win_rate:.0f}%")
    c.metric("Trend balance", f"{n_tw}↑ / {n_hw}↓")
    d.metric("Modeled upside", f"${model['revenue_bn']:.2f}B/yr")
    conclusion(
        f"Journeys fits Meta's empirical win pattern strongly (~{score_avg:.1f}/5), driven by "
        "maxing the two traits that historically mattered most (embedded surface + graph "
        "leverage). Trends net positive. Modeled indirect-revenue upside is "
        f"${model['revenue_bn']:.2f}B/yr at the current assumptions — meaningful even before "
        "sponsored guidance or commerce.")

    # --- Verdict ------------------------------------------------------------
    st.subheader("2. Live verdict")
    vcolor = {"GO": "#1a7f37", "REFINE": "#9a6700", "NO-GO": "#cf222e"}[model["verdict"]]
    st.markdown(
        f"<div style='border:3px solid {vcolor};border-radius:10px;padding:16px;text-align:"
        f"center;'><span style='font-size:2.4rem;font-weight:900;color:{vcolor};'>"
        f"{model['verdict']}</span><br><span style='color:#444;'>based on the current Module 5 "
        f"assumptions (~{model['retained']:.0f}M retained creators, "
        f"${model['revenue_bn']:.2f}B/yr modeled)</span></div>", unsafe_allow_html=True)
    st.caption("Change the Module 5 sliders and this verdict updates.")

    # --- Risk panel ---------------------------------------------------------
    st.subheader("3. Risk panel")
    risks = [
        ("Cold-start / the void", "A progress format fails if early creators post into an empty "
         "room. Mitigation: a seeded launch — Meta partners with established Instagram "
         "communities and creators to define the format and spark interest, and Journeys are "
         "pushed not just to a creator's own followers but out to broad, relevant interest "
         "communities, plus interest-matched discovery on Explore/Reels from day one."),
        ("Abandonment & habit cost", "Journeys requires a sustained posting habit — the model's "
         "single most sensitive variable (real analogs: ~19–32% retention). Mitigation: "
         "opt-in, timeline-based reminders that are off by default; off-grid low-pressure "
         "posting; potential WhatsApp-group integration for accountability; and completion "
         "summaries as the emotional payoff — the same gamified hooks that lifted Strava's "
         "retention."),
        ("Format saturation", "Stories, Reels, Notes, Threads and Broadcast Channels already "
         "compete for posting attention. Mitigation: Journeys answers a distinct question "
         "('who am I becoming?') and lives off-grid rather than adding feed clutter."),
        ("Notification fatigue", "Too many post prompts and update pings could drive users away. "
         "Mitigation: on the viewing side, followers choose to 'follow along' specific Journeys, "
         "so they only receive the ones they opted into rather than every creator's updates."),
        ("Monetization is indirect near-term", "Direct revenue is deferred. Mitigation by design: "
         "Journeys ships with NO sponsored content, earning trust first via high-intent signals "
         "and a useful organic guidance layer; clearly-labeled sponsored products and businesses "
         "are introduced only once the feature is proven."),
        ("Instagram MAU base is estimated", "Meta no longer discloses Instagram-only MAU; the "
         "base is a third-party estimate (2.0B–3.0B range; 2.4B used). Mitigation: editable in "
         "the model and documented in Sources; swap in an authoritative figure when available."),
    ]
    for title, body in risks:
        st.markdown(f"**⚠ {title}** — <span style='color:#444;font-size:0.92rem;'>{body}</span>",
                    unsafe_allow_html=True)
    conclusion(
        "Every major risk is an *execution* risk with a concrete design mitigation already built "
        "into the product spec — not a fundamental demand or strategic-fit risk. The one "
        "irreducible bet is habit-formation (will people keep posting).")

    # --- Recommendations ----------------------------------------------------
    st.subheader("4. Final recommendations")
    st.markdown(
        "1. **Proceed to a limited launch.** Strategic fit is strong and trend-supported; the "
        "open questions are answerable only with real adoption data.\n"
        "2. **Instrument retention above all.** The model says habit-formation dominates the "
        "outcome — make week-4 and week-8 repeat-posting the primary success metric, not "
        "sign-ups.\n"
        "3. **Seed cold-start before scaling.** Launch with creator/community partners and push "
        "Journeys to broad relevant interest communities — not just a creator's followers — so "
        "no Journey ever launches into an empty room.\n"
        "4. **Keep monetization patient and staged.** Ship with zero sponsored content; lead "
        "with high-intent signals and an organic guidance layer, and introduce clearly-labeled "
        "sponsored products only once the feature is proven — protect trust.\n"
        "5. **Anchor breadth, not niche.** Position around open-ended *life chapters*, not just "
        "self-improvement, to reach the mainstream adoption the revenue model requires.\n"
        "6. **Judge it as an ecosystem hub, not a single feature.** The year-one revenue "
        "understates the case: Journeys anchors a compounding flywheel across Meta AI (~1.2B "
        "MAU), Reels (~50% of IG time), Facebook (~3.07B MAU) and the fast-growing glasses "
        "business (~7M/yr, ~76% share) — see the **Long-term strategy** tab.")

    st.subheader("5. Points to consider")
    st.markdown(
        f"- {badge('FLAGGED')} Acquire an authoritative Instagram MAU and the in-app "
        "engagement split (Sensor Tower / data.ai) to tighten the model (see 📄 Sources).\n"
        "- Retention is modeled on fitness-app and Strava analogs; Journeys' actual habit curve "
        "is the single biggest thing a limited launch should measure.\n"
        "- The win-pattern is derived from a curated launch set; expanding it would further "
        "stress-test the rubric.\n"
        "- Live Shopping had all three win-traits yet failed — a reminder that the rubric "
        "raises odds, it does not guarantee.\n"
        "- Cannibalization of Stories/feed posting is unmodeled and worth monitoring.",
        unsafe_allow_html=True)
    st.markdown(" ")

    action = {"GO": "full launch", "REFINE": "limited launch to de-risk",
              "NO-GO": "hold; revisit the assumptions"}[model["verdict"]]
    tab_conclusion(
        "The Case",
        f"<b>Verdict at current assumptions: {model['verdict']} → {action}.</b> Journeys fits "
        "Meta's "
        f"empirical win pattern (~{score_avg:.1f}/5) on the two traits that historically "
        "predicted wins, rides favorable macro trends, and clears a meaningful modeled revenue "
        "bar even on conservative, indirect-only assumptions. The risks are real but are "
        "execution risks with built-in mitigations; the single decisive unknown is whether users "
        "sustain the posting habit. That is exactly what a limited, retention-instrumented launch "
        "is designed to learn — making 'launch and measure retention' the rational next step.")
