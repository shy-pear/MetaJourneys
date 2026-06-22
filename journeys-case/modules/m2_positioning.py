"""Module 2 - Journeys positioning score.

Question: does Journeys fit the win pattern from Module 1?
The scores are MODELED judgment, but each axis is anchored to the empirical Module 1 pattern.
"""
import plotly.graph_objects as go
import streamlit as st

from components.data import load_csv
from components.callouts import conclusion, tab_conclusion, caption_tag


def render():
    st.header("Module 2 — Journeys positioning score")
    st.caption("Question: does Journeys fit Module 1's win pattern? Scores are a MODELED "
               "judgment, anchored to the empirical traits that actually predicted wins.")

    df = load_csv("journeys_scorecard.csv")
    avg = df["score"].mean()

    # --- Radar --------------------------------------------------------------
    st.subheader("1. Scorecard (radar)")
    caption_tag("MODELED", "judgment anchored to Module 1's empirical win pattern")
    fig = go.Figure()
    fig.add_trace(go.Scatterpolar(
        r=list(df["score"]) + [df["score"].iloc[0]],
        theta=list(df["axis"]) + [df["axis"].iloc[0]],
        fill="toself", line_color="#8250df", name="Journeys"))
    fig.update_layout(height=480, polar=dict(radialaxis=dict(range=[0, 5], dtick=1)),
                      showlegend=False)
    st.plotly_chart(fig, width='stretch')
    conclusion(
        f"Journeys scores highest on exactly the two traits Module 1 found decisive — "
        "**embedded surface (5/5)** and **graph leverage (5/5)**. It scores lower on adoption "
        "cost and monetization clarity, which is honest: the open risks are habit-formation and "
        "near-term revenue, not strategic fit.")

    # --- Per-axis justification --------------------------------------------
    st.subheader("2. Per-axis justification")
    for _, r in df.iterrows():
        st.markdown(f"**{r['axis']} — {r['score']}/5**")
        st.markdown(f"<span style='color:#444;font-size:0.92rem;'>{r['justification']}</span>",
                    unsafe_allow_html=True)
        st.progress(r["score"] / 5.0)
    caption_tag("MODELED", "written justification per axis")
    conclusion(
        f"Average score ≈ **{avg:.1f}/5**. The case rests on structural fit (it embeds in "
        "Instagram and rides the existing graph) rather than on novelty — consistent with how "
        "Meta's actual winners succeeded.")

    tab_conclusion(
        "Positioning score",
        f"Journeys is a strong fit for Meta's empirical win pattern (≈{avg:.1f}/5). It maxes out "
        "the two traits that historically separated winners from failures — embedding in a "
        "high-traffic surface and leveraging the social graph — while honestly flagging its two "
        "weaker axes (new-habit adoption cost and near-term monetization clarity) as the real "
        "things to de-risk, which Modules 4 and 5 address.")
