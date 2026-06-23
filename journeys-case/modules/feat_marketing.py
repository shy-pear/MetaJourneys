"""Launch marketing plan — presented interactively.

The plan's real challenge isn't awareness (Meta owns reach) — it's overcoming an entrenched
default (Stories → Highlights) and making sharing imperfect, in-progress content feel
aspirational. This tab lets you play with the campaign idea, the beachhead waves, and the
channel mix rather than reading a wall of strategy.
"""
import html
import streamlit as st

from components.data import load_json
from components.callouts import conclusion, tab_conclusion, caption_tag


def _chips(items, color):
    spans = "".join(
        f"<span style='display:inline-block;background:{color}14;border:1px solid {color}55;"
        f"color:#1a1a1a;border-radius:13px;padding:4px 12px;margin:4px 5px 4px 0;"
        f"font-size:0.9rem;'>{html.escape(it)}</span>" for it in items)
    st.markdown(spans, unsafe_allow_html=True)


def _card(title, body, accent, bg="#fafbfc"):
    st.markdown(
        f"<div style='border-left:5px solid {accent};background:{bg};border-radius:6px;"
        f"padding:11px 14px;height:100%;'>"
        f"<div style='font-weight:800;'>{title}</div>"
        f"<div style='font-size:0.9rem;color:#444;margin-top:4px;'>{body}</div></div>",
        unsafe_allow_html=True)


def render():
    m = load_json("marketing_plan.json")

    st.header("Launch marketing — make Day One feel brave")
    st.caption("The challenge isn't awareness — it's pulling people off the Highlights default "
               "and making an imperfect beginning feel aspirational. Play with the pieces below.")
    caption_tag("MODELED", "marketing strategy & creative plan — not public data")

    # --- The challenge ------------------------------------------------------
    st.subheader("1. The real challenge")
    st.info(f"**Objective.** {m['challenge']['objective']}")
    c1, c2 = st.columns(2)
    for col, t in zip((c1, c2), m["challenge"]["truths"]):
        with col:
            _card(f"{t['emoji']} {t['title']}", t["text"], "#cf222e", "#fff5f5")
    conclusion(
        "Both truths point the same way: this is a *reframing* problem, not a reach problem. If "
        "marketing makes beginning-in-public feel brave instead of exposing, the product's own "
        "loop (cheering, follow-along, completion) takes over. If it doesn't, no reach matters.")

    # --- Positioning --------------------------------------------------------
    st.subheader("2. The one-line positioning")
    st.markdown(
        f"<div style='background:linear-gradient(135deg,#8250df,#C13584);color:white;"
        f"border-radius:12px;padding:22px 26px;font-size:1.25rem;font-weight:700;"
        f"line-height:1.5;'>{html.escape(m['positioning']['one_liner'])}</div>",
        unsafe_allow_html=True)
    st.markdown(" ")
    p1, p2 = st.columns(2)
    with p1:
        _card("✅ The promise to users", m["positioning"]["promise"], "#1a7f37", "#f0f9f3")
    with p2:
        _card("🚫 What we will NOT say", m["positioning"]["wont_say"], "#cf222e", "#fff5f5")
    conclusion(
        "The positioning sells **being seen for your progress**, never organization — because "
        "'group your content by theme' loses to Highlights on simplicity. The one-liner makes "
        "Journeys the natural next rung above Stories and the profile, not a new thing to learn.")

    # --- Messaging pillars --------------------------------------------------
    st.subheader("3. Three messaging pillars")
    cols = st.columns(3)
    for col, pl in zip(cols, m["pillars"]):
        with col:
            st.markdown(
                f"<div style='border:1px solid #d0d7de;border-radius:10px;padding:14px;"
                f"height:100%;'><div style='font-size:1.8rem;'>{pl['emoji']}</div>"
                f"<div style='font-weight:800;margin-top:4px;'>{html.escape(pl['name'])}</div>"
                f"<div style='font-size:0.9rem;color:#333;margin-top:6px;'>"
                f"<i>{html.escape(pl['truth'])}</i></div>"
                f"<div style='font-size:0.82rem;color:#57606a;margin-top:8px;'>"
                f"{html.escape(pl['motivation'])}</div></div>", unsafe_allow_html=True)
    st.markdown(" ")

    # --- Hero campaign (interactive) ---------------------------------------
    st.subheader(f"4. The hero campaign — “{m['hero']['name']}”  ▶ try it")
    st.caption("Pick a story to see the campaign idea: pair a humble Day One with an impressive "
               "Now. Tap through the personas.")
    personas = m["hero"]["personas"]
    labels = [f"{p['emoji']} {p['who']}" for p in personas]
    pick = st.segmented_control("Pick a story", labels, default=labels[0],
                                key="mk_persona", label_visibility="collapsed")
    p = personas[labels.index(pick)] if pick in labels else personas[0]
    d1, arrow, d2 = st.columns([6, 1, 6])
    with d1:
        st.markdown(
            f"<div style='border:2px dashed #b0b0b0;background:#f6f6f6;border-radius:12px;"
            f"padding:18px;text-align:center;'>"
            f"<div style='font-size:0.8rem;letter-spacing:1px;color:#8b949e;font-weight:700;'>"
            f"DAY ONE</div><div style='font-size:2.4rem;margin:6px 0;opacity:0.7;'>"
            f"{p['emoji']}</div><div style='color:#444;'>{html.escape(p['day_one'])}</div></div>",
            unsafe_allow_html=True)
    with arrow:
        st.markdown("<div style='text-align:center;font-size:1.8rem;margin-top:34px;'>→</div>",
                    unsafe_allow_html=True)
    with d2:
        st.markdown(
            f"<div style='border:2px solid #8250df;background:linear-gradient(135deg,#f3eefb,"
            f"#fdeef6);border-radius:12px;padding:18px;text-align:center;'>"
            f"<div style='font-size:0.8rem;letter-spacing:1px;color:#8250df;font-weight:700;'>"
            f"NOW</div><div style='font-size:2.4rem;margin:6px 0;'>{p['emoji']}</div>"
            f"<div style='color:#222;font-weight:600;'>{html.escape(p['now'])}</div></div>",
            unsafe_allow_html=True)
    st.markdown(
        f"<div style='text-align:center;margin-top:14px;'><span style='background:#8250df;"
        f"color:white;border-radius:24px;padding:9px 22px;font-weight:700;font-size:1.05rem;'>"
        f"{html.escape(m['hero']['cta'])} →</span></div>", unsafe_allow_html=True)
    st.markdown(" ")
    conclusion(
        f"**Why it works.** {m['hero']['why']} Every piece of the campaign drives to one "
        f"low-friction act: *{m['hero']['cta']}* — start a Journey with a first post, or convert "
        "an existing Highlight into one.")

    # --- Beachhead waves (interactive) -------------------------------------
    st.subheader("5. Beachhead audiences — launch category by category")
    st.caption("Don't launch broadly. Land where progress-sharing is already normal. Pick a wave.")
    waves = m["waves"]
    wlabels = [w["wave"] for w in waves]
    wpick = st.segmented_control("Wave", wlabels, default=wlabels[0], key="mk_wave",
                                 label_visibility="collapsed")
    w = waves[wlabels.index(wpick)] if wpick in wlabels else waves[0]
    st.markdown(f"**{w['wave']} — {w['theme']}**")
    _chips(w["categories"], "#8250df")
    st.markdown(" ")
    conclusion(
        "Each wave gets its own creator campaign and creative, so the message always arrives "
        "inside a community that already values the behavior — never as a generic broadcast. "
        "Wave 1 is the safest ground (high accountability, clear milestones); Wave 3 is the "
        "highest-emotion, highest-ARPU life documentation.")

    # --- Founding Journeys --------------------------------------------------
    st.subheader("6. The engine — the ‘Founding Journeys’ creator program")
    f = m["founding"]
    fc1, fc2, fc3 = st.columns(3)
    with fc1:
        _card("🌟 What it is", f["what"], "#8250df", "#f3eefb")
    with fc2:
        _card("🤝 What we ask", f["ask"], "#3b82f6", "#eef5ff")
    with fc3:
        _card("📈 The incentive = amplification", f["incentive"], "#1a7f37", "#f0f9f3")
    st.markdown(" ")
    tcols = st.columns(3)
    for col, t in zip(tcols, f["tiers"]):
        with col:
            st.markdown(f"**{t['tier']}** — <span style='color:#444;font-size:0.88rem;'>"
                        f"{html.escape(t['role'])}</span>", unsafe_allow_html=True)
    conclusion(
        "Creators are the launch, not an add-on: they set the cultural default (honest, "
        "in-progress, celebrated) **and** turn each community into a ready-made on-ramp that "
        "avoids the void. Paying in amplification self-selects for creators who post "
        "consistently and seeds the very discovery the launch depends on.")

    # --- Channel plan (interactive) ----------------------------------------
    st.subheader("7. Channel plan")
    ch_keys = list(m["channels"].keys())
    chlabels = [f"{m['channels'][k]['emoji']} {k}" for k in ch_keys]
    chpick = st.segmented_control("Channel", chlabels, default=chlabels[0], key="mk_channel",
                                  label_visibility="collapsed")
    ck = ch_keys[chlabels.index(chpick)] if chpick in chlabels else ch_keys[0]
    chan = m["channels"][ck]
    st.markdown(f"*{chan['note']}*")
    _chips(chan["items"], "#0969da")
    if ck == "Owned":
        st.warning("🚫 No Reels entry point at launch — that is a later-phase move (roadmap "
                   "Phases 3–4) the product must earn first.")
    st.markdown(" ")
    conclusion(
        "Owned surfaces alone are a complete launch set — Meta's structural advantage — with the "
        "**Highlight→Journey prompt** the single highest-leverage tactic (it reaches people who "
        "already do the behavior). Earned media compounds via completed-Journey recaps; paid is "
        "tight and high-intent, never a broad awareness buy.")

    # --- Launch sequence mapped to roadmap ---------------------------------
    st.subheader("8. Launch sequence (mapped to the rollout roadmap)")
    for s in m["sequence"]:
        st.markdown(
            f"<div style='border-left:4px solid #8250df;padding:6px 12px;margin-bottom:8px;'>"
            f"<b>{html.escape(s['phase'])}</b><br>"
            f"<span style='color:#444;font-size:0.9rem;'>{html.escape(s['move'])}</span></div>",
            unsafe_allow_html=True)
    caption_tag("MODELED", "sequence aligns to the Rollout roadmap phases")
    conclusion(
        "Marketing is phased to the product, not ahead of it: seed quietly in the closed beta, "
        "splash at public launch on the safest categories, sustain wave by wave, then let "
        "completed Journeys become the self-renewing asset that fuels every later surface.")

    # --- Measurement & the honest gate -------------------------------------
    st.subheader("9. How we measure success — and the honest gate")
    for row in m["measurement"]:
        if row["kind"] == "gate":
            st.markdown(
                f"<div style='border:2px solid #1a7f37;background:#e9f7ee;border-radius:8px;"
                f"padding:12px 16px;'><b>🚦 {row['tier']}.</b> {html.escape(row['items'])}</div>",
                unsafe_allow_html=True)
        else:
            st.markdown(f"**{row['tier']}.** <span style='color:#444;font-size:0.9rem;'>"
                        f"{html.escape(row['items'])}</span>", unsafe_allow_html=True)
    conclusion(
        "Awareness metrics are necessary but not sufficient. The honest gate is whether "
        "marketing-sourced users *behave like real users* — hitting the north-star 3rd-update "
        "retention. If acquired users don't retain, the answer is to fix the product, not buy "
        "more reach. Marketing is held to the same retention bar as the product.")

    # --- Risks --------------------------------------------------------------
    st.subheader("10. Risks the marketing must actively avoid")
    for r in m["risks"]:
        st.markdown(
            f"<div style='border-left:4px solid #cf222e;background:#fff5f5;padding:7px 12px;"
            f"border-radius:4px;margin-bottom:8px;'><b>⚠ {html.escape(r['risk'])}</b> — "
            f"<span style='color:#444;font-size:0.9rem;'>{html.escape(r['detail'])}</span></div>",
            unsafe_allow_html=True)

    tab_conclusion(
        "Launch marketing",
        "The plan is built around the product's actual challenge — an emotional barrier and an "
        "entrenched default, not awareness. It wins by reframing the fear: <b>“Everyone Starts "
        "at Day One”</b> makes sharing an imperfect beginning the bravest, most human thing you "
        "can do. Creators are the launch itself (paid in amplification, not cash), the message "
        "lands community by community via beachhead waves, owned surfaces carry the whole launch "
        "(deliberately no Reels yet), and completed Journeys become the self-renewing asset. "
        "Crucially, marketing is held to the same north-star retention gate as the product: if "
        "acquired users don't sustain, the answer is fix the product, not spend more — keeping "
        "the recognition promise honest.")
