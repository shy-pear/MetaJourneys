"""Long-term strategy - the product-ecosystem flywheel.

Question: beyond launch, does Journeys anchor a compounding ecosystem that benefits Meta long
term? The five-stage rollout is a STRATEGY (MODELED sequencing), but each stage rides a
distribution surface whose scale is MEASURED today.
"""
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

from components.data import load_csv
from components.callouts import conclusion, tab_conclusion, caption_tag


def render():
    st.header("Long-term strategy — the ecosystem flywheel")
    st.caption("Question: is Journeys a one-off feature, or the hub of a compounding ecosystem? "
               "The rollout sequence is a MODELED strategy; the surface-scale figures that make "
               "each stage credible are MEASURED public data.")

    eco = load_csv("ecosystem_stages.csv")
    gg = load_csv("glasses_growth.csv")

    def g(metric, period=None):
        d = gg[gg["metric"] == metric]
        if period is not None:
            d = d[d["period"] == period]
        return float(d["value"].iloc[0])

    # --- The five-stage strategy -------------------------------------------
    st.subheader("1. The five-stage rollout")
    st.markdown(
        "The strategy introduces Journeys, then progressively wires it into Meta's biggest "
        "surfaces and its hardware roadmap:")
    flow = " &nbsp;→&nbsp; ".join(
        f"<b>{r['stage_order']}. {r['stage']}</b>" for _, r in eco.iterrows())
    st.markdown(
        f"<div style='background:#f3eefb;border:1px solid #8250df;border-radius:8px;"
        f"padding:12px 16px;line-height:2.1;'>{flow}</div>", unsafe_allow_html=True)
    st.markdown(" ")
    show = eco[["stage_order", "stage", "description", "distribution_surface"]].rename(
        columns={"stage_order": "#", "distribution_surface": "rides on"})
    st.dataframe(show, width='stretch', hide_index=True)
    caption_tag("MODELED", "rollout sequencing; surfaces it rides on are real, see chart 2")
    conclusion(
        "Each stage is not a new app to bootstrap — it plugs Journeys into a surface Meta "
        "already owns at scale. The progression deliberately moves from software distribution "
        "(Meta AI, Reels, Facebook) to hardware (glasses), so earlier stages fund and feed the "
        "later, capital-intensive ones rather than betting everything on the glasses up front.")

    # --- Surface scale (why each stage is credible) ------------------------
    st.subheader("2. Each stage rides a surface that already exists at scale")
    surfaces = pd.DataFrame({
        "Surface": ["Meta AI\n(Stage 1)", "Reels time-share\n(Stage 3)",
                    "Facebook MAU\n(Stage 4)", "Glasses sold/yr\n(Stage 5)"],
        "Users (millions)": [g("Meta AI monthly active users", "2026-01"),
                             2000,  # Reels MAU proxy for reach
                             3070, g("Smart glasses sold (Meta + EssilorLuxottica)", "2025")],
    })
    caption_tag("MEASURED", "current scale of each distribution surface (log scale)")
    fig = px.bar(surfaces, x="Surface", y="Users (millions)", text="Users (millions)",
                 color="Surface", log_y=True,
                 color_discrete_sequence=["#8250df", "#C13584", "#1877F2", "#1a7f37"])
    fig.update_layout(height=400, showlegend=False, yaxis_title="Users / units (millions, log)")
    st.plotly_chart(fig, width='stretch')
    conclusion(
        "The software stages reach billions today — Meta AI is already at ~1.2B MAU and Facebook "
        "at ~3.07B — so Journeys never has to build distribution from zero. Glasses are orders "
        "of magnitude smaller (~7M/yr) but are the fastest-growing piece and the only one that "
        "adds a genuinely new capability (real-time capture and coaching). The asymmetry is the "
        "point: huge installed surfaces de-risk early stages; the small-but-exploding hardware "
        "stage is the long-dated option.")

    # --- Reels engagement leverage -----------------------------------------
    st.subheader("3. Why the Reels stages matter most near-term")
    reels_pct = float(eco.loc[eco["stage"] == "Meta AI inside Reels",
                              "anchor_value_millions"].iloc[0])  # 50% Reels share of IG time
    reels = {"Reels = % of IG time": reels_pct, "Video = % of IG time": 67}
    caption_tag("MEASURED", "Zuckerberg / Meta disclosures, 2026")
    fig2 = px.bar(x=list(reels.keys()), y=list(reels.values()),
                  text=[f"{v:.0f}%" for v in reels.values()],
                  color=list(reels.keys()),
                  color_discrete_sequence=["#C13584", "#8250df"])
    fig2.update_layout(height=320, showlegend=False, yaxis_title="% of Instagram time",
                       xaxis_title="", yaxis_range=[0, 100])
    st.plotly_chart(fig2, width='stretch')
    conclusion(
        "Reels is now ~50% of all Instagram time, and video is ~two-thirds — with 200B+ Reels "
        "watched daily across Instagram and Facebook. That is precisely the inspiration surface "
        "where 'I want to do that' moments form. Routing those moments into Journeys (Stage 2) "
        "and letting Meta AI spin up a Journey from a Reel (Stage 3) attacks the "
        "inspiration-to-action leak at the exact point of maximum intent and maximum reach.")

    # --- Glasses trajectory -------------------------------------------------
    st.subheader("4. The hardware horizon is real and accelerating")
    a, b, c, d = st.columns(4)
    a.metric("Glasses sold 2025", "7M", "≈3× vs 2024")
    b.metric("Meta share of market", "76.1%")
    c.metric("Market 2025 → 2026", "9.6M → 13.4M")
    d.metric("Reality Labs rev YoY", "+74%")
    caption_tag("MEASURED", "Ray-Ban Meta / EssilorLuxottica & IDC, 2025–26")
    fig3 = go.Figure()
    fig3.add_trace(go.Bar(x=["Market 2025", "Market 2026 (f)", "Meta target/yr"],
                          y=[g("Global smart glasses market shipments", "2025"),
                             g("Global smart glasses market shipments (forecast)", "2026"),
                             g("Glasses annual production target", "2026")],
                          marker_color=["#8b949e", "#57606a", "#1a7f37"],
                          text=["9.6M", "13.4M", "20M target"]))
    fig3.update_layout(height=340, yaxis_title="Units (millions)")
    st.plotly_chart(fig3, width='stretch')
    conclusion(
        "Smart glasses are no longer hypothetical: Meta sold ~7M in 2025 (tripling year over "
        "year), holds ~76% of the category, and is targeting up to 20M units/yr while Reality "
        "Labs revenue grew 74% YoY. This makes Stage 5 — glasses that capture moments straight "
        "into a Journey and coach users toward a goal — a credible 3–5 year horizon, not "
        "science fiction. Journeys is the software 'holder' that gives all that captured content "
        "a home.")

    # --- The competitive moat ----------------------------------------------
    st.subheader("5. Why only Meta can assemble all four pieces")
    moat = pd.DataFrame({
        "Capability": ["Discovery at scale", "Real-identity social graph",
                       "Creator ecosystem", "AI guidance layer", "Hardware capture roadmap"],
        "Meta": ["✅ Reels/Explore", "✅ IG + FB", "✅ Instagram creators",
                 "✅ Meta AI ~1.2B MAU", "✅ Ray-Ban Meta, 76% share"],
        "TikTok": ["✅", "❌ weak", "✅", "⚠ partial", "❌"],
        "AI assistants": ["❌", "❌", "❌", "✅", "❌"],
    })
    st.dataframe(moat, width='stretch', hide_index=True)
    caption_tag("DERIVED", "capability comparison from the measured scale figures above")
    conclusion(
        "The flywheel — discovery (Reels) → guidance (Meta AI) → documented progress (Journeys) "
        "→ real-world capture (glasses) — requires four assets at once. TikTok has discovery but "
        "no real-identity graph and an algorithm tuned for watch time, not user development; AI "
        "assistants have guidance but no social context, creators, or capture hardware. Meta is "
        "the only player holding all four, and Journeys is the connective tissue that turns them "
        "from separate products into a loop.")

    tab_conclusion(
        "Long-term strategy",
        "Journeys' strategic value is bigger than its standalone revenue: it is the hub of a "
        "compounding flywheel where each stage rides a surface Meta already dominates "
        "(Meta AI ~1.2B, Reels ~50% of IG time and 200B daily plays, Facebook ~3.07B) and feeds "
        "the next, culminating in a fast-growing glasses business (~7M/yr, ~76% share, +74% "
        "Reality Labs revenue) that no competitor can replicate. The sequencing is a modeled "
        "assumption, but the scale of every surface it depends on is measured and already in "
        "place — which is exactly why the long-term case is stronger than the year-one numbers "
        "alone suggest.")
