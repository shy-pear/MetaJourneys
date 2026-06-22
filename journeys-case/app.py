"""The Journeys Case - a data-driven product-validation dashboard for a hypothetical
Instagram feature, 'Journeys'. Streamlit entry point.

Run: streamlit run app.py
"""
import streamlit as st

from components.legend import render_legend
from components.data import load_sources_md
from modules import (overview, m1_track_record, m2_positioning, m3_behavior,
                     m4_trends, m5_model, m6_longterm, synthesis)

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
    "1 · Overview",
    "2 · Launch track record",
    "3 · Positioning score",
    "4 · Behavior patterns",
    "5 · Tailwinds & headwinds",
    "6 · Adoption & revenue model",
    "7 · Long-term strategy",
    "8 · The Case",
])

with tabs[0]:
    overview.render()
with tabs[1]:
    m1_track_record.render()
with tabs[2]:
    m2_positioning.render()
with tabs[3]:
    m3_behavior.render()
with tabs[4]:
    m4_trends.render()
with tabs[5]:
    m5_model.render()      # writes st.session_state['model'] before synthesis reads it
with tabs[6]:
    m6_longterm.render()
with tabs[7]:
    synthesis.render()

st.markdown("---")
st.caption("Independent analysis using public data · not affiliated with Meta · Journeys "
           "projections are modeled assumptions · full sources in the 📄 Sources button above "
           "(data/SOURCES.md)")
