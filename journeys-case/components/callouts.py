"""Styled conclusion callouts. Every chart/table gets a `conclusion`; every tab ends
with a `tab_conclusion`."""
import streamlit as st


def conclusion(text: str):
    """Per-chart / per-table takeaway box."""
    st.markdown(
        f"<div style='border-left:4px solid #0969da;background:#ddf4ff;"
        f"padding:10px 14px;border-radius:4px;margin:6px 0 22px 0;'>"
        f"<b>Conclusion.</b> {text}</div>",
        unsafe_allow_html=True,
    )


def tab_conclusion(title: str, text: str):
    """Overarching conclusion for an entire tab."""
    st.markdown(
        f"<div style='border:2px solid #1a7f37;background:#e9f7ee;"
        f"padding:14px 18px;border-radius:8px;margin-top:18px;'>"
        f"<div style='font-size:1.05rem;font-weight:800;color:#1a7f37;'>"
        f"\u2705 Overarching conclusion \u2014 {title}</div>"
        f"<div style='margin-top:6px;'>{text}</div></div>",
        unsafe_allow_html=True,
    )


def caption_tag(tag_value: str, note: str = ""):
    """Small inline data-type note under a chart title."""
    from components.legend import badge
    st.markdown(f"{badge(tag_value)} &nbsp;<span style='color:#57606a;font-size:0.8rem;'>"
                f"{note}</span>", unsafe_allow_html=True)
