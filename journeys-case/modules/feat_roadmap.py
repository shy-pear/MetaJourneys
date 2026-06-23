"""Rollout roadmap - an interactive, clickable phase diagram.

The roadmap is a metrics-gated sequence from closed beta to the full ecosystem. Users click a
phase node in the diagram to reveal that phase's goal, what ships, what is measured, and its
go / adjust / redesign decision gate. Kept deliberately clean: the diagram is the map, detail
appears only on demand.
"""
import html
import plotly.graph_objects as go
import streamlit as st

from components.data import load_json
from components.callouts import tab_conclusion

# progression palette: beta (purple) -> ecosystem (green)
PHASE_COLORS = ["#8250df", "#a371f7", "#3b82f6", "#0ea5e9", "#06b6d4", "#10b981", "#1a7f37"]
KIND = {
    "go": ("#1a7f37", "#e9f7ee", "Go"),
    "adjust": ("#9a6700", "#fff8e6", "Adjust"),
    "stop": ("#cf222e", "#ffebe9", "Stop / redesign"),
    "additive": ("#8250df", "#f3eefb", "Additive"),
}
MAX_M = 40  # render ceiling for the open-ended final phase


def _end(p):
    return p["months"][1] if p["months"][1] is not None else MAX_M


def _selected_phase(n):
    """Resolve the clicked phase from the persisted plotly selection (default 0)."""
    ev = st.session_state.get("roadmap_chart")
    try:
        sel = ev["selection"] if isinstance(ev, dict) else getattr(ev, "selection", None)
        for pt in (sel or {}).get("points", []):
            cd = pt.get("customdata")
            if cd:
                idx = int(cd[0])
                if 0 <= idx < n:
                    st.session_state["roadmap_phase"] = idx
                    break
    except Exception:
        pass
    return st.session_state.get("roadmap_phase", 0)


def _diagram(phases, sel):
    fig = go.Figure()
    # phase segments
    for i, p in enumerate(phases):
        fig.add_trace(go.Scatter(
            x=[p["months"][0], _end(p)], y=[0, 0], mode="lines",
            line=dict(color=PHASE_COLORS[i], width=20 if i == sel else 11),
            opacity=1.0 if i == sel else 0.55, hoverinfo="skip", showlegend=False))
    # gate diamonds between phases
    gates = [p["months"][1] for p in phases[:-1] if p["months"][1] is not None]
    fig.add_trace(go.Scatter(
        x=gates, y=[0] * len(gates), mode="markers",
        marker=dict(symbol="diamond", size=13, color="white",
                    line=dict(color="#57606a", width=2)),
        hovertext=["Decision gate"] * len(gates), hoverinfo="text", showlegend=False))
    # clickable phase nodes
    mids = [(p["months"][0] + _end(p)) / 2 for p in phases]
    fig.add_trace(go.Scatter(
        x=mids, y=[0] * len(phases), mode="markers+text",
        marker=dict(size=[40 if i == sel else 30 for i in range(len(phases))],
                    color=PHASE_COLORS,
                    line=dict(color=["#111" if i == sel else "white" for i in range(len(phases))],
                              width=[3 if i == sel else 2 for i in range(len(phases))])),
        text=[str(i) for i in range(len(phases))],
        textfont=dict(color="white", size=15),
        customdata=[[i] for i in range(len(phases))],
        hovertext=[f"Phase {i}: {p['name']}" for i, p in enumerate(phases)],
        hoverinfo="text", showlegend=False))
    # labels: name above, month range below
    for i, p in enumerate(phases):
        rng = f"M{p['months'][0]}–{p['months'][1]}" if p["months"][1] else f"M{p['months'][0]}+"
        fig.add_annotation(x=mids[i], y=0.16, text=f"<b>{p['short']}</b>", showarrow=False,
                           font=dict(size=11, color="#111" if i == sel else "#57606a"))
        fig.add_annotation(x=mids[i], y=-0.16, text=rng, showarrow=False,
                           font=dict(size=10, color="#8b949e"))
    fig.update_layout(
        height=230, margin=dict(l=12, r=12, t=18, b=12), plot_bgcolor="white",
        yaxis=dict(visible=False, range=[-0.45, 0.45]),
        xaxis=dict(range=[-1.5, MAX_M + 0.5], showgrid=False, zeroline=False,
                   title="Months (targets, not commitments)",
                   tickvals=[0, 3, 9, 15, 21, 27, 36]))
    return fig


def _chips(items, color):
    spans = "".join(
        f"<span style='display:inline-block;background:{color}14;border:1px solid {color}55;"
        f"color:#1a1a1a;border-radius:13px;padding:3px 10px;margin:3px 4px 3px 0;"
        f"font-size:0.82rem;'>{html.escape(it)}</span>" for it in items)
    st.markdown(spans, unsafe_allow_html=True)


def _detail(p):
    rng = f"Months {p['months'][0]}–{p['months'][1]}" if p["months"][1] else f"Months {p['months'][0]}+"
    st.markdown(
        f"<div style='border:2px solid {PHASE_COLORS[p['id']]};border-radius:10px;"
        f"padding:14px 18px;'>"
        f"<div style='font-size:1.15rem;font-weight:800;'>Phase {p['id']} — {html.escape(p['name'])}"
        f" <span style='color:#8b949e;font-weight:600;font-size:0.9rem;'>· {rng}</span></div>"
        f"<div style='color:#333;margin-top:4px;'>{html.escape(p['goal'])}</div></div>",
        unsafe_allow_html=True)
    st.markdown(" ")
    c1, c2 = st.columns(2)
    with c1:
        st.markdown("**🚀 Ship — what goes out**")
        _chips(p["ship"], "#3b82f6")
    with c2:
        st.markdown("**📏 Measure — the gates**")
        _chips(p["measure"], "#10b981")
    st.markdown(" ")
    st.markdown("**🚦 Decision gate — when to go, adjust, or redesign**")
    cols = st.columns(len(p["decision"]))
    for col, d in zip(cols, p["decision"]):
        border, bg, _ = KIND[d["kind"]]
        with col:
            st.markdown(
                f"<div style='border-left:5px solid {border};background:{bg};border-radius:6px;"
                f"padding:9px 12px;height:100%;'>"
                f"<div style='font-weight:800;color:{border};'>{html.escape(d['label'])}</div>"
                f"<div style='font-size:0.86rem;color:#333;margin-top:3px;'>"
                f"{html.escape(d['text'])}</div></div>", unsafe_allow_html=True)


def render():
    data = load_json("rollout_roadmap.json")
    phases = data["phases"]

    st.header("Rollout roadmap — phased, metrics-gated")
    st.caption("A staged plan from closed beta to the full ecosystem. Tap any phase in the "
               "roadmap to see what ships, what's measured, and its decision gate.")

    # governing principle + the two metrics that govern every gate
    with st.expander("ℹ️ How to read this: phases advance on metrics, not dates", expanded=False):
        st.markdown(f"**Governing principle.** {data['principle']}")
        g1, g2 = st.columns(2)
        g1.markdown(f"<div style='border-left:4px solid #1a7f37;background:#e9f7ee;padding:8px 12px;"
                    f"border-radius:4px;'><b>★ North-star metric.</b><br>{data['north_star']}</div>",
                    unsafe_allow_html=True)
        g2.markdown(f"<div style='border-left:4px solid #cf222e;background:#ffebe9;padding:8px 12px;"
                    f"border-radius:4px;'><b>Single kill metric.</b><br>{data['kill_metric']}</div>",
                    unsafe_allow_html=True)

    # cross-cutting marketing & creator track (runs through every phase)
    mk = data.get("marketing_track")
    if mk:
        with st.expander("📣 Cross-cutting track: Marketing & Creator Partnerships (runs through "
                         "every phase)", expanded=False):
            st.markdown(mk["summary"])
            for pt in mk["points"]:
                st.markdown(f"- {pt}")
            st.caption("Full detail in the 📣 Launch marketing tab.")

    sel = _selected_phase(len(phases))

    # the clickable diagram
    st.plotly_chart(_diagram(phases, sel), width='stretch',
                    on_select="rerun", selection_mode="points", key="roadmap_chart")
    # quick decision-color legend
    st.markdown(
        "<div style='text-align:center;font-size:0.8rem;color:#57606a;margin-top:-8px;'>"
        "Diamonds = decision gates &nbsp;·&nbsp; "
        "<span style='color:#1a7f37;font-weight:700;'>● Go</span> &nbsp; "
        "<span style='color:#9a6700;font-weight:700;'>● Adjust</span> &nbsp; "
        "<span style='color:#cf222e;font-weight:700;'>● Stop / redesign</span> &nbsp; "
        "<span style='color:#8250df;font-weight:700;'>● Additive</span></div>",
        unsafe_allow_html=True)
    st.markdown(" ")

    _detail(phases[sel])

    tab_conclusion(
        "Rollout roadmap",
        "The sequence is deliberate and each position is defensible: prove the loop in a "
        "norm-setting beta; validate it generalizes at public scale with cold-start mechanics "
        "working; monetize and add retention leverage only once trust and the loop are real; "
        "<b>then</b> spend the crown-jewel Reels surface on acquisition; expand to a second "
        "platform where the data says it fits; and reserve the hardware integration for last as "
        "the opt-in vision layer. Retention is locked before acquisition is scaled, so the "
        "firehose never pours into a leaky bucket; monetization follows proven trust, so revenue "
        "never eats the asset that creates it; and the highest-risk change to the most valuable "
        "surface goes last. The two risks that survive every gate stay the same: make activation "
        "pull hard enough that people sustain a Journey, and make discovery real enough for small "
        "accounts that the recognition promise stays honest.")
