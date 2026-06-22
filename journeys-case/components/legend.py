"""MEASURED / DERIVED / MODELED legend and inline tag badges."""
import streamlit as st

COLORS = {
    "MEASURED": "#1a7f37",   # green  - real public data
    "DERIVED": "#9a6700",    # amber  - computed from measured data
    "MODELED": "#8250df",    # purple - assumption, user-adjustable
    "FLAGGED": "#cf222e",    # red    - wanted but not publicly disclosed
}

DESCRIPTIONS = {
    "MEASURED": "Real public data (filing, dataset, or official statement).",
    "DERIVED": "Computed or reasoned from measured data.",
    "MODELED": "An assumption or judgment — user-adjustable.",
    "FLAGGED": "Wanted but not publicly disclosed — see SOURCES.md.",
}


def badge(tag: str) -> str:
    """Return an HTML pill for a data-type tag (use with unsafe_allow_html=True)."""
    tag = str(tag).upper()
    color = COLORS.get(tag, "#57606a")
    return (
        f"<span style='background:{color};color:white;border-radius:6px;"
        f"padding:1px 7px;font-size:0.72rem;font-weight:700;"
        f"letter-spacing:0.3px;'>{tag}</span>"
    )


def tag(tag_value: str):
    """Render a standalone tag badge."""
    st.markdown(badge(tag_value), unsafe_allow_html=True)


def render_legend(compact: bool = False):
    """Render the data-type legend. Used in the sidebar and on the overview tab."""
    if compact:
        pills = " ".join(badge(t) for t in ("MEASURED", "DERIVED", "MODELED", "FLAGGED"))
        st.markdown(pills, unsafe_allow_html=True)
        return
    for t, desc in DESCRIPTIONS.items():
        st.markdown(f"{badge(t)} &nbsp; {desc}", unsafe_allow_html=True)
