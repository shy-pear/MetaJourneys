"""Module 1 - Meta's launch track record (the analytical spine).

Question: what pattern separates Meta's product wins from its failures?
The win-pattern derived here becomes the rubric Journeys is scored against in Module 2.
"""
import pandas as pd
import plotly.express as px
import streamlit as st

from components.data import load_csv
from components.callouts import conclusion, tab_conclusion, caption_tag

VERDICT_COLOR = {"win": "#1a7f37", "mixed": "#9a6700", "killed": "#cf222e"}
TRAITS = {
    "ported_behavior": "Ported a proven behavior",
    "embedded_in_surface": "Embedded in a high-traffic surface",
    "leveraged_graph": "Leveraged the existing social graph",
}


def _win_rate(df: pd.DataFrame) -> float:
    return 100.0 * (df["verdict"] == "win").mean()


def render():
    st.header("Module 1 — Meta's launch track record")
    st.caption("The analytical spine. Question: what separates Meta's product wins from its "
               "failures? Source data: a hand-curated launch history (Meta newsroom + press).")

    df = load_csv("launch_history.csv").copy()
    df["date"] = pd.to_datetime(df["launch_date"], format="%Y-%m")

    # --- Timeline -----------------------------------------------------------
    st.subheader("1. Launch timeline by outcome")
    caption_tag("MEASURED", "launch dates & outcomes from public record")
    fig = px.scatter(
        df, x="date", y="product", color="verdict",
        color_discrete_map=VERDICT_COLOR, size=[14] * len(df),
        hover_data={"adoption_milestone": True, "date": False},
    )
    fig.update_layout(height=460, yaxis_title="", xaxis_title="Launch date",
                      legend_title="Outcome")
    st.plotly_chart(fig, width='stretch')
    n = len(df)
    wins = int((df["verdict"] == "win").sum())
    killed = int((df["verdict"] == "killed").sum())
    conclusion(
        f"Across {n} curated launches, outcomes are mixed: {wins} clear wins and {killed} "
        "killed. Meta ships constantly and fails often — so 'Meta builds it' is not, by itself, "
        "a predictor of success. The interesting question is what the winners share.")

    # --- Overall success rate ----------------------------------------------
    st.subheader("2. Overall success rate")
    rate = _win_rate(df)
    c1, c2, c3 = st.columns(3)
    c1.metric("Clear wins", f"{wins}/{n}")
    c2.metric("Win rate", f"{rate:.0f}%")
    c3.metric("Killed", f"{killed}/{n}")
    caption_tag("DERIVED", "computed from the launch-history outcomes above")
    conclusion(
        f"The baseline win rate is ~{rate:.0f}%. Any new feature should be judged against this "
        "base rate, not against a romantic assumption that Meta launches usually win.")

    # --- Win rate by trait --------------------------------------------------
    st.subheader("3. Does the win-pattern hypothesis hold?")
    st.markdown("Hypothesis: wins cluster around three traits — **(a)** porting a proven "
                "behavior, **(b)** embedding in an existing high-traffic surface, and **(c)** "
                "leveraging the existing social graph. We split the win rate by each trait.")
    rows = []
    for col, label in TRAITS.items():
        for present in ("Y", "N"):
            sub = df[df[col] == present]
            if len(sub):
                rows.append({"trait": label, "present": "Present" if present == "Y" else "Absent",
                             "win_rate": _win_rate(sub), "n": len(sub)})
    tdf = pd.DataFrame(rows)
    caption_tag("DERIVED", "win rate split by whether each trait was present")
    fig2 = px.bar(tdf, x="trait", y="win_rate", color="present", barmode="group",
                  color_discrete_map={"Present": "#1a7f37", "Absent": "#cf222e"},
                  text=tdf["win_rate"].round(0).astype(int).astype(str) + "%",
                  hover_data={"n": True})
    fig2.update_layout(height=430, yaxis_title="Win rate (%)", xaxis_title="",
                       legend_title="Trait", yaxis_range=[0, 100])
    st.plotly_chart(fig2, width='stretch')

    # dynamic read of the two discriminating traits
    def gap(col):
        y = df[df[col] == "Y"]; nn = df[df[col] == "N"]
        yr = _win_rate(y) if len(y) else float("nan")
        nr = _win_rate(nn) if len(nn) else float("nan")
        return yr, nr
    emb_y, emb_n = gap("embedded_in_surface")
    gr_y, gr_n = gap("leveraged_graph")
    conclusion(
        f"**Embedding** and **graph leverage** are the discriminating traits: embedded launches "
        f"win ~{emb_y:.0f}% of the time vs ~{emb_n:.0f}% when standalone; graph-leveraged "
        f"launches win ~{gr_y:.0f}% vs ~{gr_n:.0f}% without. **Porting a proven behavior** is "
        "near-universal in Meta's portfolio (almost every launch is a fast-follow) — so it is "
        "necessary table-stakes but does not, on its own, separate winners from losers. Two "
        "honest counter-examples carry all three traits yet did not cleanly win: Facebook Live "
        "Shopping (killed) and Instagram Highlights — which won adoption but stalled as a static "
        "archive Meta is now demoting. The traits raise the odds; they do not guarantee a win "
        "without an engine behind them.")

    # --- Scored table -------------------------------------------------------
    st.subheader("4. Full scored launch table")
    show = df[["product", "launch_date", "ported_behavior", "embedded_in_surface",
               "leveraged_graph", "adoption_milestone", "verdict"]].rename(columns={
        "ported_behavior": "ported", "embedded_in_surface": "embedded",
        "leveraged_graph": "graph"})
    st.dataframe(show, width='stretch', hide_index=True)
    caption_tag("MEASURED", "facts; verdict column is a DERIVED judgment")
    conclusion(
        "The standalone clones with no surface and no graph (Poke, Slingshot, Lasso) were all "
        "killed. Threads is the instructive exception: a separate app that still won, because it "
        "imported the Instagram graph wholesale — reinforcing that graph leverage is the single "
        "most powerful lever.")

    tab_conclusion(
        "Launch track record",
        "Meta's win pattern is real but specific. Porting a proven behavior is necessary but not "
        "sufficient; the traits that actually predict wins are <b>embedding in a high-traffic "
        "surface</b> and <b>leveraging the existing social graph</b>. This becomes the rubric for "
        "scoring Journeys in Module 2 — and Journeys is designed to score maximally on exactly "
        "the two traits that matter most. The closest precedent is Instagram Highlights: it "
        "cleared the trait bar yet plateaued as a static archive with no engine behind it (no "
        "progression, social layer, distribution, or discovery) — precisely the gap Journeys is "
        "built to fill (see the Highlights deep-dive tab).")
