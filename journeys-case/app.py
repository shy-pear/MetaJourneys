"""The Journeys Case - a data-driven product-validation dashboard for a hypothetical
Instagram feature, 'Journeys'. Streamlit entry point.

Run: streamlit run app.py
"""
import streamlit as st

from components.legend import render_legend
from components.data import load_sources_md
from modules import (overview, m1_track_record, m2_positioning, m3_behavior,
                     m4_trends, m5_model, m6_longterm, synthesis, feat_meta_ai,
                     feat_highlights, feat_roadmap, feat_whatsapp, feat_marketing, feat_npv,
                     feat_prototype)

# Dropdown sections for the two analysis tabs.
ANALYSIS_SECTIONS = {
    "1 · Launch track record": m1_track_record.render,
    "2 · Positioning score": m2_positioning.render,
    "3 · Behavior patterns": m3_behavior.render,
    "4 · Tailwinds & headwinds": m4_trends.render,
    "5 · Adoption & revenue model": m5_model.render,
}
STRATEGY_SECTIONS = {
    "1 · Long-term strategy": m6_longterm.render,
    "2 · Rollout roadmap": feat_roadmap.render,
    "3 · Launch marketing": feat_marketing.render,
    "4 · Meta AI deep-dive": feat_meta_ai.render,
    "5 · Highlights & positioning": feat_highlights.render,
    "6 · WhatsApp integration": feat_whatsapp.render,
}

st.set_page_config(page_title="The Journeys Case", page_icon="🧭", layout="wide")

# --- Header row: title left, corner controls right (no sidebar clutter) ------
left, right = st.columns([0.72, 0.28])
with left:
    st.markdown("### 🧭 The Journeys Case")
    st.caption("A data-driven case for a hypothetical Instagram feature.")
with right:
    b1, b2 = st.columns(2)
    with b1:
        with st.popover("🏷 Data legend", use_container_width=True):
            st.markdown("**Data-type legend**")
            render_legend()
    with b2:
        with st.popover("📄 Sources", use_container_width=True):
            st.markdown("All figures are cited. Every CSV row carries a `source_url`.")
            st.markdown(load_sources_md())

tabs = st.tabs([
    "📋 Overview",
    "📊 Analysis of Product Potential",
    "🧭 Product Strategy",
    "📱 Prototype",
    "💰 Financial Analysis",
    "✅ The Case",
])

with tabs[0]:
    overview.render()
with tabs[1]:
    st.markdown("#### Analysis of Product Potential")
    st.caption("Is Journeys a good bet? Use the dropdown to move between sections; each builds "
               "on the last.")
    a_section = st.selectbox("Section", list(ANALYSIS_SECTIONS.keys()),
                             label_visibility="collapsed", key="analysis_section")
    st.divider()
    ANALYSIS_SECTIONS[a_section]()
with tabs[2]:
    st.markdown("#### Product Strategy")
    st.caption("How Journeys is built, sequenced, and taken to market. Use the dropdown to move "
               "between sections.")
    s_section = st.selectbox("Section", list(STRATEGY_SECTIONS.keys()),
                             label_visibility="collapsed", key="strategy_section")
    st.divider()
    STRATEGY_SECTIONS[s_section]()
with tabs[3]:
    feat_prototype.render()
with tabs[4]:
    feat_npv.render()
with tabs[5]:
    synthesis.render()

st.markdown("---")
st.caption("Independent analysis using public data · not affiliated with Meta · Journeys "
           "projections are modeled assumptions · full sources in the 📄 Sources button above "
           "(data/SOURCES.md)")
