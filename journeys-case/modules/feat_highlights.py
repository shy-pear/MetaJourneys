"""Feature deep-dive #2 - Instagram Highlights: the demand it proved, and how Journeys is
positioned as a distinct feature that eventually works with (not against) Highlights.

Thesis: Highlights is an *archive*; Journeys is an *arc with an engine*. Highlights already
proved the appetite for a progress format while structurally capping its value. Journeys
uncaps it, and a phased launch lets the two coexist before any merge.
"""
import pandas as pd
import plotly.express as px
import streamlit as st

from components.data import load_csv
from components.callouts import conclusion, tab_conclusion, caption_tag

EDGE_COLOR = {"journeys": "#8250df", "highlights": "#C13584", "parity": "#57606a"}


def render():
    st.header("Highlights — the demand Journeys inherits")
    st.caption("Instagram Highlights (2017) already proved people want a progress format. This "
               "tab shows what it proved, why it structurally caps that value, and how Journeys "
               "is positioned as distinct first and complementary later.")

    facts = load_csv("highlights_facts.csv")
    cmp = load_csv("highlights_comparison.csv")
    phases = load_csv("highlights_strategy_phases.csv")

    # --- 1. What Highlights is & the demand it proved ----------------------
    st.subheader("1. What Highlights proved")
    st.markdown(
        "Launched **December 2017**, Highlights lets people save expired Stories into "
        "permanent, named, themed collections under the bio — explicitly to *'express more of "
        "who you are.'* Crucially, people already strain it into makeshift journeys — "
        "**'Marathon Training', 'Our Baby', 'Italy 2024'** — which is the clearest possible "
        "evidence that demand for a progress format exists.")
    st.dataframe(facts[["fact", "value", "type"]], width='stretch', hide_index=True)
    caption_tag("MEASURED", "Instagram newsroom; adoption figures third-party; one row FLAGGED")
    conclusion(
        "Highlights has real pull: ~60% of businesses and ~26% of influencer campaigns use it, "
        "and ordinary users routinely repurpose it to chronicle goals and life chapters. The "
        "appetite is proven. (General-user adoption isn't disclosed by Meta — flagged.) But note "
        "*how* people use it: they are forcing a directional story into a container that was "
        "never built for one — and two newer signals scope what's proven. **(1)** Even this "
        "low-effort format is widely set-and-forget (Instagram deletes neglected Highlights), so "
        "the proven appetite is for *displaying* grouped progress, not for sustained active "
        "posting. **(2)** Instagram is now *demoting* Highlights off the profile (2024–25), "
        "vacating the lane — which both validates the opportunity and makes the conversion "
        "on-ramp timely.")

    # --- 2. The structural ceiling: archive vs arc ------------------------
    st.subheader("2. The structural ceiling — an archive, not an arc")
    counts = (cmp[cmp["edge"] == "journeys"].shape[0],
              cmp[cmp["edge"] == "highlights"].shape[0],
              cmp[cmp["edge"] == "parity"].shape[0])
    cap_df = pd.DataFrame({
        "Feature": ["Capabilities only Journeys has", "Where Highlights wins",
                    "At parity (shared)"],
        "count": counts,
        "edge": ["journeys", "highlights", "parity"]})
    fig = px.bar(cap_df, x="count", y="Feature", orientation="h", text="count", color="edge",
                 color_discrete_map=EDGE_COLOR)
    fig.update_layout(height=260, showlegend=False, xaxis_title="number of capabilities",
                      yaxis_title="")
    st.plotly_chart(fig, width='stretch')
    conclusion(
        f"Across {len(cmp)} capabilities, Highlights leads on only {counts[1]} — both about "
        "*simplicity and familiarity* (zero learning curve, an installed base). Journeys "
        f"uniquely owns {counts[0]}, and they cluster in the four areas Highlights cannot touch: "
        "**progression, a social layer, distribution, and discovery.** Highlights doesn't do "
        "these *worse* — it cannot do them at all, because it is a static bucket of saved "
        "stories whose only reply path is a private DM. It broadcasts nothing.")

    st.markdown("**The full capability map:**")
    show = cmp[["capability", "category", "highlights", "journeys", "edge"]].rename(columns={
        "capability": "Capability", "category": "Area", "highlights": "Highlights",
        "journeys": "Journeys", "edge": "Edge"})
    st.dataframe(show, width='stretch', hide_index=True)
    caption_tag("MEASURED", "social/structure rows from product behavior; reads tagged DERIVED")
    conclusion(
        "Read down the 'Highlights' column: a wall of *No* on everything that creates a loop — "
        "no goal, no timeline, no finish, no likes, no comments, no feed presence, no Explore. "
        "Read the 'Highlights' wins: simplicity and familiarity. That is exactly why Journeys "
        "should **not** try to win the 'group content by theme' argument — it would lose to "
        "Highlights on simplicity. It wins on the four things Highlights leaves untouched.")

    # --- 3. How Journeys is positioned differently ------------------------
    st.subheader("3. How Journeys is positioned differently")
    a, b, c, d = st.columns(4)
    a.metric("Progression", "Arc + stage", "vs static bucket")
    b.metric("Social layer", "Likes + comments", "vs DM-only")
    c.metric("Distribution", "Feed + follow-along", "vs sits on profile")
    d.metric("Discovery", "Explore", "vs invisible")
    caption_tag("DERIVED", "the four engines Journeys adds on top of the proven Highlights demand")
    conclusion(
        "Journeys is an **arc with an engine**. The decisive line: *Highlights is an archive; "
        "Journeys is an arc.* Everything Journeys adds — distribution, progression, guidance, "
        "discovery, and a genuine social layer — is something Highlights structurally cannot do. "
        "The fact that millions already misuse Highlights as journeys proves the appetite while "
        "capping the value; Journeys uncaps it.")

    # --- 4. Launch & product strategy w.r.t. Highlights -------------------
    st.subheader("4. Launch & product strategy: distinct first, complementary later")
    st.markdown("The sequencing is what makes coexistence safe — distinct on day one, a merge "
                "only once 'Journey' is an understood concept:")
    st.dataframe(phases[["phase", "move", "rationale"]].rename(columns={
        "phase": "Phase", "move": "Move", "rationale": "Why"}),
        width='stretch', hide_index=True)
    caption_tag("MODELED", "phased product strategy")
    conclusion(
        "Launching Journeys as its own understood feature first avoids reworking an entrenched "
        "behavior before the new concept is taught. Keeping both side by side lets the contrast "
        "teach itself, while an optional 'turn this Highlight into a Journey?' prompt quietly "
        "harvests the installed base to solve cold-start. The full merge is a later, phase-three "
        "*graduation* — not a confusing mutation on day one.")

    # --- 5. Why it works + risks -----------------------------------------
    st.subheader("5. Why this can work — and the risks")
    cwork, crisk = st.columns(2)
    with cwork:
        st.markdown("**Why it can work**")
        st.markdown(
            "- Demand is **already proven** by Highlights misuse — no need to create appetite.\n"
            "- Journeys wins on capabilities Highlights *cannot* replicate, not on simplicity.\n"
            "- Low-friction entry (dump posts → behaves like a Highlight → AI expands) matches "
            "Highlights' ease.\n"
            "- The conversion prompt turns the installed Highlights base into a cold-start "
            "on-ramp.\n"
            "- Fits Meta's win pattern: embed in an existing surface, ride existing behavior "
            "(see Product Case → Launch track record).")
    with crisk:
        st.markdown("**Potential risks**")
        st.markdown(
            "- **Concept confusion:** users unsure whether to file in a Highlight or build a "
            "Journey; the two look superficially similar.\n"
            "- **Cannibalization:** posting attention splits across two overlapping homes.\n"
            "- **Prompt fatigue:** the 'convert your Highlight?' nudge can feel like nagging if "
            "over-shown.\n"
            "- **Merge risk:** a premature or clumsy phase-three merge could break an entrenched, "
            "well-loved behavior.\n"
            "- **Inertia:** Highlights' simplicity may keep casual users from ever climbing to "
            "the higher-commitment Journey.\n"
            "- **Habit decay:** Highlights' own widespread abandonment warns that progress "
            "collections lapse — Journeys must prove its engine actually sustains posting.")
    caption_tag("DERIVED", "strategic assessment")
    conclusion(
        "The risks are real but are mostly **sequencing and UX** risks, which the phased plan is "
        "explicitly designed to manage: distinct-first prevents confusion, optional prompts "
        "limit fatigue, and deferring the merge protects the entrenched behavior. The one to "
        "watch is inertia — some users will be happy filing in Highlights forever — but those "
        "users were never going to sustain a Journey anyway, so little is lost.")

    tab_conclusion(
        "Highlights: the demand Journeys inherits",
        "Highlights is the proof and the floor; Journeys is the ceiling. Highlights demonstrated "
        "real, durable demand for grouping progress by theme, then capped it as a silent archive "
        "with no goal, no social layer, no distribution, and no discovery. Journeys keeps the "
        "proven entry behavior and adds the four engines Highlights structurally lacks — winning "
        "on what Highlights *can't* do rather than on simplicity it would lose. Sequencing makes "
        "it safe: ship distinct, let the contrast teach itself, harvest the installed base with "
        "an optional prompt, and merge only as a later graduation. Two newer signals sharpen the "
        "case: Instagram is now <b>demoting Highlights</b> off the profile (vacating the lane and "
        "making the conversion on-ramp timely), and Highlights' <b>widespread abandonment</b> "
        "scopes the proven demand to *displaying* progress — the sustained-posting habit is the "
        "very thing Journeys' engine must earn. Stories begat Highlights; Highlights revealed the "
        "demand and its ceiling; Journeys is the format built to finally serve it.")
