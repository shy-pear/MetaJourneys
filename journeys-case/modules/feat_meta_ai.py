"""Feature deep-dive #1 - Meta AI in Journeys vs. Meta AI as used today.

Question: Journeys reuses the SAME Meta AI assistant Meta already ships everywhere. So why
would people engage with it inside Journeys when Meta AI today is broad-but-shallow? The answer
is *when* and *with what context* it is invoked: high-intent, goal-rich moments.
"""
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

from components.data import load_csv
from components.callouts import conclusion, tab_conclusion, caption_tag


def render():
    st.header("Meta AI — in Journeys vs. today")
    st.caption("Same assistant, different moment. This tab asks what changes when Meta's "
               "existing AI is invoked at high-intent goal moments instead of ambiently.")

    st.info(
        "**Meta AI's role in Journeys** — it is the *guidance layer* that helps a user actually "
        "reach the goal they're documenting. At the moments that matter (starting a Journey, and "
        "at each progress checkpoint) it answers *'what's my next step?'* — surfacing the "
        "creators, communities, and products suited to the user's specific stage, and it can spin "
        "up a Journey straight from a Reel. It starts purely organic (earning trust and "
        "generating high-intent signals) and only later layers in clearly-labeled sponsored "
        "recommendations. In short: Journeys is the place you document progress; Meta AI is the "
        "coach that helps you make it.")

    cmp = load_csv("meta_ai_comparison.csv")
    ev = load_csv("intent_evidence.csv")

    def ev_val(metric):
        return float(ev.loc[ev["metric"] == metric, "value"].iloc[0])

    # --- 1. How Meta AI is used today --------------------------------------
    st.subheader("1. How Meta AI is used today: broad, but shallow")
    today = ev[ev["category"] == "Meta AI today"]
    c1, c2, c3 = st.columns(3)
    c1.metric("Meta AI MAU (est.)", "640M–1.2B")
    c2.metric("Daily / monthly ratio", "~4%")
    c3.metric("Primary use", "Embedded search")
    caption_tag("MEASURED", "Presenc AI / DemandSage, 2026")
    # DAU/MAU visual: 4% habitual vs 96% occasional
    dau = ev_val("Meta AI daily-to-monthly active ratio")
    fig = px.pie(values=[dau, 100 - dau], names=["Daily / habitual", "Occasional / incidental"],
                 color=["Daily / habitual", "Occasional / incidental"],
                 color_discrete_map={"Daily / habitual": "#8250df",
                                     "Occasional / incidental": "#d0d7de"}, hole=0.55)
    fig.update_layout(height=320, showlegend=True)
    st.plotly_chart(fig, width='stretch')
    conclusion(
        f"Meta AI has enormous reach but only a ~{dau:.0f}% daily-to-monthly active ratio — the "
        "overwhelming majority of use is occasional and incidental (tapping the search bar), not "
        "a habit. It is summoned at a random, low-context moment and answers one question. That "
        "is the ceiling of an ambient assistant: wide but shallow, with no reason to return.")

    # --- 2. The high-intent demand already exists (off Meta) ---------------
    st.subheader("2. The 'I want to do' moment already drives huge demand — off Meta")
    caption_tag("MEASURED", "Google micro-moments / Think with Google")
    d1, d2 = st.columns(2)
    d1.metric("Use YouTube for how-to", f"{ev_val('Smartphone users who turn to YouTube for how-to videos'):.0f}%")
    d2.metric("Micro-moments / day", f"{ev_val('Micro-moments experienced per person per day'):.0f}")
    conclusion(
        "When people decide to *do* something, they already reach for help in huge numbers — 91% "
        "turn to YouTube for how-to, amid ~150 intent 'micro-moments' a day. This demand is real "
        "and habitual; it simply happens on Google/YouTube/Reddit because Meta has no surface "
        "that captures the goal. Journeys' AI is positioned exactly at this moment.")

    # --- 3. Same engine, different moment (the comparison) -----------------
    st.subheader("3. Same engine, different moment")
    st.markdown("Journeys does **not** build a new AI. It invokes the *same* Meta AI — but at a "
                "different time, with far richer context:")
    st.dataframe(cmp.rename(columns={"dimension": "Dimension",
                                     "meta_ai_today": "Meta AI today",
                                     "journeys_ai": "Meta AI in Journeys",
                                     "advantage": "edge"})[
        ["Dimension", "Meta AI today", "Meta AI in Journeys", "edge"]],
        width='stretch', hide_index=True)
    caption_tag("MEASURED", "tech & distribution rows are parity (MEASURED); the rest is DERIVED")
    n_j = int((cmp["advantage"] == "journeys").sum())
    n_p = int((cmp["advantage"] == "parity").sum())
    conclusion(
        f"On the two things that cost money to build — the underlying models and the distribution "
        f"surface — Journeys is at **parity** ({n_p} rows): it reuses what Meta already owns. On "
        f"the {n_j} experience dimensions that drive engagement (timing, context, purpose, "
        "recurrence, commercial intent, relationship), Journeys is structurally advantaged. The "
        "feature's value is not a better AI; it is the *same AI placed where intent is highest*.")

    # --- 4. Why willingness to adopt is higher at high intent --------------
    st.subheader("4. Why people will engage Journeys' AI when they ignore the ambient one")
    rel = ev[ev["category"] == "Relevance & context"]
    caption_tag("MEASURED", "personalization & recommendation conversion data")
    fig2 = px.bar(rel, x="value", y="metric", orientation="h", text="value",
                  color_discrete_sequence=["#1a7f37"])
    fig2.update_layout(height=340, xaxis_title="percent", yaxis_title="",
                       yaxis=dict(autorange="reversed"))
    st.plotly_chart(fig2, width='stretch')
    conclusion(
        "Two forces compound at a goal moment. **Receptivity:** behavioral science's *fresh-start "
        "effect* shows people are most open to goal-directed action at temporal landmarks — and "
        "starting a Journey *is* that landmark — while *implementation-intention* (if-then "
        "timeline) prompts are what actually convert intent into action. **Relevance:** 91% are "
        "more likely to act on recommendations that fit their context, and engaging a relevant "
        "recommendation lifts conversion up to ~70% in-session. Journeys' AI has the context "
        "(goal, stage, timeline) the ambient assistant lacks — so the same suggestion lands as "
        "welcome coaching, not noise.")

    # --- 5. The trust reframe ----------------------------------------------
    st.subheader("5. A trust reframe, not just an engagement one")
    conclusion(
        "Meta AI today faces scrutiny for mining low-context chats to target ads. Inside "
        "Journeys, the *user* states the goal and asks for help reaching it, so AI guidance — and "
        "eventually clearly-labeled sponsored gear or services matched to their stage — reads as "
        "service rather than surveillance. High intent doesn't just raise engagement; it aligns "
        "the AI's help with what the user already wants, which is the cleaner foundation for the "
        "staged monetization described in the Product Case.")

    tab_conclusion(
        "Meta AI in Journeys vs. today",
        "Journeys gets the upside of Meta's billion-user AI investment without rebuilding it. The "
        "limitation of Meta AI today is not capability but <b>moment</b>: it is invoked ambiently, "
        "shallowly (~4% DAU/MAU), with no context. Journeys invokes the same engine at the "
        "highest-intent point in a user's day — the decision to pursue a goal — where the "
        "fresh-start effect makes people receptive and rich context makes recommendations "
        "relevant (and far more likely to convert). That is why adoption of 'Journey AI' should "
        "meaningfully exceed ambient Meta AI engagement, and why it is the natural home for "
        "high-intent, trust-aligned monetization.")
