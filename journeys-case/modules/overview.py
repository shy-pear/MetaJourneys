"""Tab 1 - Overview: the data-analysis project + the Journeys product/problem."""
import streamlit as st

from components.callouts import tab_conclusion


def render():
    st.header("The Journeys Case — a data-driven product validation")
    st.markdown(
        "A lightweight, evidence-based dashboard that assembles **real public data** into a "
        "structured argument about whether Meta should launch **Journeys**, a progress-"
        "documentation format for Instagram.")

    # --- The product & problem (first) -------------------------------------
    st.subheader("The product & the problem it solves")
    st.markdown(
        "**Problem — Meta wins discovery and loses progression.** Instagram Reels manufactures "
        "aspiration at huge scale: people watch a golf swing, a sourdough loaf, a marathon "
        "finish and think *'I want to do that.'* But at that moment Meta has nothing to catch "
        "the intent — users leave for Google, YouTube, Reddit and AI assistants to actually "
        "start. Meta owns the attention but not the action. Underneath sits a second problem: "
        "the curated grid has made authentic, in-progress sharing feel too risky, pushing it "
        "into Stories, DMs and Close Friends.")
    st.markdown(
        "**Product — Journeys** is a persistent, timeline-based format for documenting something "
        "as it unfolds: a skill (marathon training, learning golf), or an open-ended life "
        "chapter (a pregnancy, a renovation, a year of travel). Updates are quick, informal "
        "Story-style posts. The key design decision: **Journey posts live off the main grid**, "
        "so sharing a beginner attempt carries none of the identity weight of the permanent "
        "feed. Anyone can 'follow along' a single Journey without following the creator, giving "
        "Meta a sharp interest signal. A completed Journey becomes a celebratory summary — both "
        "a trophy and the best recruitment tool the format has. Woven through the experience is "
        "**Meta AI**, a quiet guidance layer that helps users discover the content, creators, "
        "communities, and products that help them actually achieve their goals — beginning with "
        "purely organic recommendations and supporting eventual monetization through "
        "clearly-labeled sponsored content once the feature is proven.")

    # --- What this proves / doesn't (after the product) --------------------
    st.subheader("What this analysis does — and does not — prove")
    c1, c2 = st.columns(2)
    with c1:
        st.markdown(
            "**It does:**\n"
            "- Assemble real public data into a structured case\n"
            "- Score Journeys against the historical pattern of Meta's wins\n"
            "- Surface trend tailwinds & headwinds\n"
            "- Run a transparent, stress-testable adoption/revenue model")
    with c2:
        st.markdown(
            "**It does not:**\n"
            "- Forecast actual adoption (no one can, from public data)\n"
            "- Use Meta's internal launch or behavioral metrics (unpublished)\n"
            "- Treat the Journeys projections as empirical — they are an explicit, "
            "labeled assumption model")
    st.info("The credibility of this dashboard comes from separating **real measured data** "
            "from **modeled assumptions**, and keeping that line visible on every chart. The "
            "data-type legend is in the 🏷 button at the top right.")

    # --- Reading guide ------------------------------------------------------
    st.subheader("How to read this dashboard")
    st.markdown(
        "1. **Launch track record** — what separates Meta's wins from its failures (the spine).\n"
        "2. **Positioning score** — does Journeys fit that win pattern?\n"
        "3. **Behavior patterns** — is there room/unmet need in current user behavior?\n"
        "4. **Tailwinds & headwinds** — do macro trends support or undercut it?\n"
        "5. **Adoption & revenue model** — if it works, how big, and how sensitive?\n"
        "6. **Long-term strategy** — does Journeys anchor a compounding ecosystem flywheel?\n"
        "7. **The Case** — consolidated verdict, risks, and recommendations.")

    tab_conclusion(
        "Overview",
        "The thesis in one paragraph: Meta's winning launches share two empirical traits — they "
        "embed in a high-traffic surface and leverage the existing social graph — and Journeys "
        "is designed to score maximally on both. The macro environment (authenticity demand, "
        "de-curation, private sharing, the AI inspiration-to-action gap) is favorable. The real "
        "uncertainty is not strategic fit or monetization but whether users will sustain a new "
        "posting habit. The following tabs test each of these claims against real public data, "
        "and the final tab consolidates them into a go / refine / no-go recommendation.")
