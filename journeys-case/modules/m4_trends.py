"""Module 4 - Social media trend tailwinds & headwinds.

Question: do macro trends support or undercut Journeys?
"""
import streamlit as st

from components.data import load_csv
from components.callouts import conclusion, tab_conclusion, caption_tag
from components.legend import badge


def _item_card(row, accent):
    st.markdown(
        f"<div style='border-left:4px solid {accent};background:#fafbfc;padding:8px 12px;"
        f"border-radius:4px;margin-bottom:10px;'>"
        f"<b>{row['item']}</b> &nbsp;{badge(row['type'])}<br>"
        f"<span style='font-size:0.9rem;color:#444;'>{row['description']}</span><br>"
        f"<a href='{row['source_url']}' style='font-size:0.78rem;'>source</a></div>",
        unsafe_allow_html=True)


def render():
    st.header("Module 4 — Tailwinds & headwinds")
    st.caption("Question: do macro trends support or undercut Journeys? Each item is "
               "source-linked; analytical reads are tagged DERIVED.")

    df = load_csv("tailwinds_headwinds.csv")
    tw = df[df["direction"] == "tailwind"]
    hw = df[df["direction"] == "headwind"]

    col1, col2 = st.columns(2)
    with col1:
        st.subheader(f"⬆ Tailwinds ({len(tw)})")
        for _, r in tw.iterrows():
            _item_card(r, "#1a7f37")
    with col2:
        st.subheader(f"⬇ Headwinds ({len(hw)})")
        for _, r in hw.iterrows():
            _item_card(r, "#cf222e")

    caption_tag("MEASURED", "items sourced to reporting/statements; reads tagged DERIVED")
    conclusion(
        "The strongest tailwinds — demand for authenticity, Instagram itself abandoning the "
        "perfect grid, and the shift to private/close-friends sharing — point directly at the "
        "format Journeys provides. The strongest headwind is structural: format saturation plus "
        "the cold-start problem. Notably, 'declining public posting' cuts both ways: it shrinks "
        "the funnel but is also *the reason* a lower-pressure format is needed.")

    tab_conclusion(
        "Tailwinds & headwinds",
        "On balance the macro environment favors Journeys: the cultural and product-strategy "
        "winds (authenticity, de-curation, privacy, the AI inspiration-to-action gap) are "
        "tailwinds the format is purpose-built to ride. The headwinds are real but are mostly "
        "<i>execution</i> risks — saturation and cold-start — that good interest-matched "
        "discovery and a default-off, non-nagging design can mitigate, rather than fundamental "
        "demand risks.")
