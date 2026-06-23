"""Feature deep-dive - is the WhatsApp integration (rollout Phase 2) a good idea?

The rollout proposes an opt-in, per-Journey "share this update to your WhatsApp group?" plus a
group ping on each new post, framed as the highest-leverage cross-app *retention* mechanic.
This tab tests that claim against current WhatsApp usage and the behavioral evidence on whether
sharing progress to a private group helps or hurts follow-through.
"""
import pandas as pd
import plotly.express as px
import streamlit as st

from components.data import load_csv
from components.callouts import conclusion, tab_conclusion, caption_tag
from components.legend import badge

DIR_STYLE = {"help": ("#1a7f37", "⬆ Helps adoption"),
             "hinder": ("#cf222e", "⬇ Risks / hinders"),
             "condition": ("#9a6700", "⚖ Conditions to get it right")}


def _board(df, direction):
    accent, _ = DIR_STYLE[direction]
    for _, r in df[df["direction"] == direction].iterrows():
        st.markdown(
            f"<div style='border-left:4px solid {accent};background:#fafbfc;padding:8px 12px;"
            f"border-radius:4px;margin-bottom:9px;'>"
            f"<b>{r['factor']}</b> &nbsp;{badge(r['type'])}<br>"
            f"<span style='font-size:0.9rem;color:#444;'>{r['detail']}</span><br>"
            f"<a href='{r['source_url']}' style='font-size:0.76rem;'>source</a></div>",
            unsafe_allow_html=True)


def render():
    st.header("WhatsApp integration — is it a good idea?")
    st.caption("Rollout Phase 2 proposes opt-in, per-Journey sharing to a WhatsApp group plus an "
               "update ping. Question: given current WhatsApp usage, does that help or hinder "
               "adoption and retention?")

    use = load_csv("whatsapp_usage.csv")
    acc = load_csv("whatsapp_accountability.csv")
    assess = load_csv("whatsapp_assessment.csv")

    def uval(metric):
        return float(use.loc[use["metric"] == metric, "value"].iloc[0])

    # --- 1. Why WhatsApp is even the candidate surface --------------------
    st.subheader("1. Why WhatsApp is the candidate surface")
    k1, k2, k3, k4 = st.columns(4)
    k1.metric("WhatsApp MAU", "3.3B")
    k2.metric("Daily / monthly", "~83%", "vs IG ~67%")
    k3.metric("Activity in groups", "~50%")
    k4.metric("Group ping open rate", "98%")
    caption_tag("MEASURED", "DemandSage / Infobip / WANotifier, 2026")
    # stickiness comparison
    stick = pd.DataFrame({"App": ["WhatsApp", "Instagram"],
                          "Daily / monthly active (%)": [83, 67]})
    fig = px.bar(stick, x="App", y="Daily / monthly active (%)", text="Daily / monthly active (%)",
                 color="App", color_discrete_map={"WhatsApp": "#25D366", "Instagram": "#C13584"})
    fig.update_layout(height=300, showlegend=False, yaxis_range=[0, 100], xaxis_title="")
    st.plotly_chart(fig, width='stretch')
    conclusion(
        "WhatsApp is the stickiest surface Meta owns: 3.3B users, ~83% of them daily (vs ~67% for "
        "Instagram), with roughly half of all activity in group chats averaging ~27 close-tie "
        "members. If the goal is a *retention* multiplier — getting people back to post the next "
        "update — there is no higher-frequency, higher-trust surface to plug into.")

    # --- 2. The 'help' case: accountability ------------------------------
    st.subheader("2. The case it helps: progress-sharing drives follow-through")
    caption_tag("MEASURED", "goal-accountability research (ASTD; group-goal studies)")
    fig2 = px.bar(acc, x="condition", y="goal_completion_pct", text="goal_completion_pct",
                  color="condition",
                  color_discrete_sequence=["#8b949e", "#56b366", "#1a7f37"])
    fig2.update_layout(height=340, showlegend=False, yaxis_title="% of goals achieved",
                       xaxis_title="", yaxis_range=[0, 100])
    st.plotly_chart(fig2, width='stretch')
    conclusion(
        "The behavioral evidence is strong and directly on-point: people who share **regular "
        "progress** achieve **76%** of their goals vs **43%** for those who go it alone, and "
        "committing to someone makes you 65% more likely to follow through. Crucially, the effect "
        "is strongest with **close ties** — precisely what a WhatsApp family/friends group is, "
        "and what a public feed of strangers is not. This is the relational weight the rollout "
        "bets on, and the data backs it.")

    # --- 3. The 'hinder' case: the honest risks --------------------------
    st.subheader("3. The case it hinders: the honest risks")
    cL, cR = st.columns(2)
    with cL:
        st.markdown("**⬇ Risks**")
        _board(assess, "hinder")
    with cR:
        st.markdown("**⚖ Design conditions to land on the upside**")
        _board(assess, "condition")
    conclusion(
        "Three risks are real. **(1) The Gollwitzer trap:** publicly *announcing* an identity "
        "goal can create a premature sense of completion that lowers effort — but note the "
        "nuance: that backfire is about one-off *announcements*, while the accountability gains "
        "come from sharing *ongoing progress*. Journeys posts updates, not a single declaration, "
        "so it lands on the favorable side **if designed that way**. **(2) Fatigue:** automated "
        "group pings can annoy; they must be opt-in, per-update, and easily muted. **(3) "
        "Geography:** WhatsApp is only ~3% US (100M) vs 535M in India — the lever is far stronger "
        "outside the US, and it aids retention, not acquisition.")

    # --- 4. Geography caveat ---------------------------------------------
    st.subheader("4. Where the lever actually pulls")
    geo = use[use["metric"].str.contains("US monthly|India monthly")].copy()
    geo["Region"] = ["United States", "India"]
    caption_tag("MEASURED", "Sinch / DemandSage, 2025")
    fig3 = px.bar(geo, x="Region", y="value", text="value", color="Region",
                  color_discrete_map={"United States": "#8b949e", "India": "#25D366"})
    fig3.update_layout(height=300, showlegend=False, yaxis_title="WhatsApp MAU (millions)",
                       xaxis_title="")
    st.plotly_chart(fig3, width='stretch')
    conclusion(
        "WhatsApp integration is not equally valuable everywhere. With ~100M US users vs ~535M in "
        "India alone, the mechanic is a blockbuster in WhatsApp-first markets and a minor feature "
        "in a US-only rollout. That argues for shipping it as an **opt-in, market-aware** layer — "
        "not a universal headline feature — which is exactly how Phase 2 frames it.")

    # --- 5. Net verdict ---------------------------------------------------
    st.subheader("5. Net assessment")
    n_help = int((assess["direction"] == "help").sum())
    n_hind = int((assess["direction"] == "hinder").sum())
    st.markdown(
        "<div style='border:3px solid #1a7f37;border-radius:10px;padding:14px 18px;'>"
        "<span style='font-size:1.3rem;font-weight:900;color:#1a7f37;'>Likely HELPS — "
        "conditionally.</span><br><span style='color:#333;'>A well-designed, opt-in WhatsApp "
        "integration should <b>help</b> adoption by lifting retention through close-tie "
        "accountability, provided it shares progress (not announcements), controls notification "
        "frequency, and is measured with a deprioritize gate.</span></div>",
        unsafe_allow_html=True)
    conclusion(
        f"Weighing {n_help} supporting forces against {n_hind} risks, the balance favors "
        "shipping it — but the verdict is *conditional*, not unconditional. The evidence that "
        "close-tie progress-sharing drives follow-through is exactly the retention lever Journeys "
        "needs; the risks (announcement-backfire, fatigue, US weakness) are all manageable "
        "through design and the existing Phase 2 gate. The rollout's instinct to make it opt-in "
        "and to deprioritize if retention doesn't move is the correct guardrail.")

    tab_conclusion(
        "WhatsApp integration",
        "Yes — with conditions. WhatsApp is the stickiest, most relational surface Meta owns "
        "(3.3B users, ~83% daily, ~half in groups), and the accountability research is "
        "unambiguous that sharing <b>regular progress</b> with <b>close ties</b> materially lifts "
        "follow-through (76% vs 43%) — the precise retention multiplier the rollout wants. The "
        "feature helps rather than hinders adoption <i>if</i> it is designed to share progress "
        "(sidestepping the Gollwitzer announcement-backfire), keeps notifications opt-in and "
        "mutable to avoid fatigue, and is treated as a market-aware retention bet with a real "
        "deprioritize gate — strongest in WhatsApp-first markets, modest in a US-only launch. "
        "The rollout's Phase 2 framing already encodes these guardrails, which is why the bet is "
        "sound.")
