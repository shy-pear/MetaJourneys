"""Prototype — a rough, clickable Phase-1 prototype of Journeys on Instagram.

The prototype is a React/Vite app (in ../journeys-prototype) built into a single self-contained
HTML file and embedded here. It is interactive: navigate it like a real app. It also demonstrates
how Meta AI can be integrated into Reels (the "try this out?" entry point).
"""
import streamlit as st
import streamlit.components.v1 as components

from components.data import load_text
from components.callouts import caption_tag, tab_conclusion


def render():
    st.header("Prototype — Journeys on Instagram")
    st.caption("A clickable walkthrough of the core Phase-1 experience, embedded live below.")
    caption_tag("MODELED", "rough interactive prototype — illustrative UI, mock content")

    st.info(
        "🚧 **This is a rough prototype of the Phase 1 (Instagram) experience** — the closed-beta "
        "/ public-launch core loop, not a finished design. It also shows **how Meta AI can be "
        "integrated into Reels**: open the **Reels** tab inside the phone and tap the ✨ sparkle / "
        "**'try this out?'** button to see Meta AI surface creators, communities and products and "
        "spin up a new Journey from a Reel.")

    # what to click
    with st.expander("▶ What to try in the prototype", expanded=False):
        st.markdown(
            "- **Home / Profile** — browse Journeys and open one to see its timeline + story viewer.\n"
            "- **Create** — start a Journey and post a first update (off-grid, story-style).\n"
            "- **Explore** — find interest-matched Journeys (the cold-start discovery layer).\n"
            "- **Reels → ✨ 'try this out?'** — the headline demo: Meta AI reads the Reel's topic, "
            "recommends a starting point, and lets you launch a Journey from it.\n"
            "- **Follow along** on a Journey, and **complete** one to see the Wrapped-style recap.")

    # embed the self-contained single-file build (compact phone, white surround);
    # height fully contains the 600px phone so the embed itself never scrolls
    html = load_text("prototype.html")
    components.html(html, height=616, scrolling=False)

    st.caption("Prototype source: a React + TanStack Router app, built to a single self-contained "
               "HTML file and embedded above. Routing uses hash history so it works inside the "
               "embed. All content is mock/illustrative.")

    tab_conclusion(
        "Prototype",
        "This rough Phase-1 prototype makes the core loop concrete: start a Journey, post "
        "off-grid updates, get followed and cheered, discover others at your stage, and finish "
        "with a celebratory recap. Most importantly it demonstrates the highest-leverage "
        "acquisition mechanic the roadmap earns its way toward — <b>Meta AI inside Reels</b>: at "
        "the exact high-intent moment someone watches a skill Reel and thinks 'I want to do "
        "that,' the ✨ 'try this out?' entry point turns inspiration into a started Journey. "
        "It is illustrative, not production design — but it shows the experience the rest of the "
        "dashboard argues for is buildable and coherent.")
