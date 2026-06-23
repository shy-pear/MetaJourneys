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
        "perfect grid (now actively **demoting Highlights**, which opens the lane and makes the "
        "Highlight→Journey on-ramp timely), and the shift to private/close-friends sharing — "
        "point directly at the format Journeys provides. The sharpest headwind is now a habit "
        "signal: even low-effort **Highlights are widely abandoned** (set-and-forget), which — "
        "alongside format saturation and cold-start — says the real risk is sustaining the "
        "posting habit. Notably, 'declining public posting' cuts both ways: it shrinks the funnel "
        "but is also *the reason* a lower-pressure format is needed.")

    tab_conclusion(
        "Tailwinds & headwinds",
        "On balance the macro environment favors Journeys: the cultural and product-strategy "
        "winds (authenticity, de-curation, privacy, the AI inspiration-to-action gap, and "
        "Instagram demoting the incumbent Highlights archive) are tailwinds the format is "
        "purpose-built to ride. Most headwinds are <i>execution</i> risks — saturation and "
        "cold-start — that interest-matched discovery and a default-off, non-nagging design can "
        "mitigate. The one genuine demand-side caution is habit decay: the abandonment of "
        "Highlights is direct in-Meta evidence that a progress-collection habit fades without an "
        "engine, which is exactly why sustained retention (Module 5) is the make-or-break "
        "variable rather than reach.")
