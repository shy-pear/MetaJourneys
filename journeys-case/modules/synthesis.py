"""The Case — the capstone. Consolidates every other tab (potential, strategy, financials)
into one seamless argument + risk panel + recommendations.

The modeled upside and verdict update live from the Adoption & revenue model sliders via
session_state.
"""
import streamlit as st

from components.data import load_csv, load_assumptions, load_json
from components.callouts import conclusion, tab_conclusion
from components.legend import badge
from modules.m5_model import compute, verdict
from modules.feat_npv import _model as npv_model


def _model_state():
    """Pull live model from session_state, or compute defaults if the model tab isn't open."""
    if "model" in st.session_state:
        return st.session_state["model"]
    cfg = load_assumptions(); m = cfg["model"]
    r = compute(m["ig_mau_base_millions"], m["adoption_pct"], m["repeat_poster_pct"],
                m["retention_pct"], m["incremental_arpu_usd"], m["followers_per_journey"])
    r["verdict"] = verdict(r["revenue_bn"], cfg)[0]
    return r


def _move(lead, body, source):
    st.markdown(
        f"<div style='border-left:5px solid #8250df;background:#faf8ff;padding:9px 14px;"
        f"border-radius:6px;margin-bottom:10px;'><b>{lead}</b> "
        f"<span style='color:#333;'>{body}</span><br>"
        f"<span style='font-size:0.76rem;color:#8b949e;'>↳ {source}</span></div>",
        unsafe_allow_html=True)


def render():
    st.header("The Case — consolidated analysis & recommendation")
    st.caption("Every tab, in one argument. The modeled numbers update live with the Adoption & "
               "revenue model sliders.")

    # --- pull the threads together -----------------------------------------
    lh = load_csv("launch_history.csv")
    win_rate = 100.0 * (lh["verdict"] == "win").mean()
    sc = load_csv("journeys_scorecard.csv")
    score_avg = sc["score"].mean()
    th = load_csv("tailwinds_headwinds.csv")
    n_tw = int((th["direction"] == "tailwind").sum())
    n_hw = int((th["direction"] == "headwind").sum())
    model = _model_state()
    nd = load_json("npv_model.json")
    mn = npv_model(nd, nd["wacc"], nd["users_m"][-1], nd["arpu"][-1], True)
    npv_b = mn["npv"] / 1000.0
    bc = mn["bc"]
    bear_b = next(s for s in nd["scenarios"] if s["name"] == "Bear")["npv_mm"] / 1000.0

    # --- 1. At a glance ----------------------------------------------------
    st.subheader("1. The case at a glance")
    a, b, c, d, e = st.columns(5)
    a.metric("Win-pattern fit", f"{score_avg:.1f}/5")
    b.metric("Meta baseline win rate", f"{win_rate:.0f}%")
    c.metric("Trend balance", f"{n_tw}↑ / {n_hw}↓")
    d.metric("Modeled Yr-1 upside", f"${model['revenue_bn']:.2f}B")
    e.metric("7-yr NPV", f"${npv_b:.1f}B")
    conclusion(
        f"Journeys fits Meta's empirical win pattern strongly (~{score_avg:.1f}/5) by maxing the "
        "two traits that historically mattered most (embedded surface + graph leverage); trends "
        f"net positive ({n_tw}↑/{n_hw}↓); the conservative year-one upside is "
        f"~${model['revenue_bn']:.2f}B, and the full 7-year valuation is ~${npv_b:.1f}B NPV "
        f"(benefit/cost ~{bc:.1f}×). Five independent lenses point the same way.")

    # --- 2. The argument, end to end ---------------------------------------
    st.subheader("2. The argument, end to end")
    _move("It fits how Meta actually wins.",
          f"Wins aren't predicted by ‘Meta built it’ (baseline ~{win_rate:.0f}%) but by two "
          "traits — embedding in a high-traffic surface and leveraging the existing graph — and "
          f"Journeys maxes both (~{score_avg:.1f}/5). The closest precedent, Instagram "
          "Highlights, cleared that bar yet stalled as an engineless archive Meta is now "
          "demoting — precisely the gap Journeys fills with progression, a social layer, "
          "distribution and discovery.",
          "Analysis → Launch track record, Positioning score; Strategy → Highlights")
    _move("The demand is real but has no home.",
          "Attention is enormous but flat, and Instagram's own engagement fell ~26% YoY, so "
          "incremental value must come from a new behavior, not more scrolling. The young, "
          "growing IG base is the native audience for documenting progress, and people already "
          "strain Highlights into makeshift journeys — proof of appetite. But Highlights' "
          "widespread abandonment scopes that proof to *displaying* progress, leaving sustained "
          "active posting as the open question.",
          "Analysis → Behavior patterns; Strategy → Highlights")
    _move("The winds are at its back.",
          f"{n_tw} tailwinds vs {n_hw} headwinds: authenticity demand, de-curation, "
          "private-sharing, the AI inspiration-to-action gap, and Instagram demoting the "
          "incumbent Highlights archive all open the lane. The headwinds are mostly execution "
          "risks; the one genuine demand-side caution is habit decay.",
          "Analysis → Tailwinds & headwinds")
    _move("The economics are asymmetric.",
          f"Even on conservative, ad-targeting-only assumptions the year-one upside is "
          f"~${model['revenue_bn']:.2f}B. The full 7-year NPV is ~${npv_b:.1f}B "
          f"(benefit/cost ~{bc:.1f}×), and even the bear case stays ~${bear_b:.1f}B positive — "
          "because Journeys rides infrastructure and a graph Meta already owns, so downside is "
          "bounded and the bear-to-bull spread is an adoption-and-monetization story, not a cost "
          "one.",
          "Analysis → Adoption & revenue model; Financial Analysis → NPV")
    _move("The execution is sequenced to de-risk.",
          "The rollout is metrics-gated: retention is locked before the crown-jewel Reels "
          "surface is ever touched, and monetization follows proven trust. The same Meta AI is "
          "deployed at high-intent goal moments (not ambiently), marketing reframes the fear via "
          "‘Everyone Starts at Day One’ and pays creators in amplification, and an opt-in "
          "WhatsApp layer adds conditional accountability. Every major risk has a built-in "
          "mitigation.",
          "Strategy → Long-term, Roadmap, Marketing, Meta AI, WhatsApp")
    conclusion(
        "Fit, demand, trends, economics, and execution were assessed independently and converge: "
        "Journeys is the right kind of bet for Meta, into a real and unserved appetite, with "
        "favorable winds, asymmetric economics, and a de-risked rollout. The single thread that "
        "runs through all five — and the only irreducible bet — is whether users **sustain the "
        "posting habit.**")

    # --- 3. Live verdict ----------------------------------------------------
    st.subheader("3. Live verdict")
    vcolor = {"GO": "#1a7f37", "REFINE": "#9a6700", "NO-GO": "#cf222e"}[model["verdict"]]
    st.markdown(
        f"<div style='border:3px solid {vcolor};border-radius:10px;padding:16px;text-align:"
        f"center;'><span style='font-size:2.4rem;font-weight:900;color:{vcolor};'>"
        f"{model['verdict']}</span><br><span style='color:#444;'>based on the current Adoption & "
        f"revenue model assumptions (~{model['retained']:.0f}M retained creators, "
        f"${model['revenue_bn']:.2f}B/yr modeled)</span></div>", unsafe_allow_html=True)
    st.caption("Change the Adoption & revenue model sliders and this verdict updates.")

    # --- 4. Risk panel ------------------------------------------------------
    st.subheader("4. Risk panel")
    risks = [
        ("Cold-start / the void", "A progress format fails if early creators post into an empty "
         "room. Mitigation: a seeded launch — Meta partners with established Instagram "
         "communities and creators to define the format and spark interest, and Journeys are "
         "pushed not just to a creator's own followers but out to broad, relevant interest "
         "communities, plus interest-matched discovery on Explore/Reels from day one."),
        ("Abandonment & habit cost", "Journeys requires a sustained posting habit — the model's "
         "single most sensitive variable (real analogs: ~19–32% retention). The sharpest warning "
         "is in-Meta: even low-effort Instagram Highlights are widely set-and-forget (Instagram "
         "deletes neglected ones), so a progress habit demonstrably decays without an engine. "
         "Mitigation: opt-in, timeline-based reminders that are off by default; off-grid "
         "low-pressure posting; potential WhatsApp-group accountability; and completion "
         "summaries as the emotional payoff — the same gamified hooks that lifted Strava's "
         "retention. This is the one risk to treat as the make-or-break beta question."),
        ("Format saturation", "Stories, Reels, Notes, Threads and Broadcast Channels already "
         "compete for posting attention. Mitigation: Journeys answers a distinct question "
         "('who am I becoming?') and lives off-grid rather than adding feed clutter."),
        ("Notification fatigue", "Too many post prompts and update pings could drive users away. "
         "Mitigation: on the viewing side, followers choose to 'follow along' specific Journeys, "
         "so they only receive the ones they opted into rather than every creator's updates."),
        ("Monetization is indirect near-term", "Direct revenue is deferred. Mitigation by design: "
         "Journeys ships with NO sponsored content, earning trust first via high-intent signals "
         "and a useful organic guidance layer; clearly-labeled sponsored products and businesses "
         "are introduced only once the feature is proven."),
        ("Instagram MAU base is estimated", "Meta no longer discloses Instagram-only MAU; the "
         "base is a third-party estimate (2.0B–3.0B range; 2.4B used). Mitigation: editable in "
         "the model and documented in Sources; swap in an authoritative figure when available."),
    ]
    for title, body in risks:
        st.markdown(f"**⚠ {title}** — <span style='color:#444;font-size:0.92rem;'>{body}</span>",
                    unsafe_allow_html=True)
    conclusion(
        "Every major risk is an *execution* risk with a concrete design mitigation already built "
        "into the product spec — not a fundamental demand or strategic-fit risk. And the "
        f"financial downside is bounded: even the bear case is ~${bear_b:.1f}B NPV-positive "
        "because the feature rides existing infrastructure. The one irreducible bet is "
        "habit-formation — will people keep posting.")

    # --- 5. Final recommendations ------------------------------------------
    st.subheader("5. Final recommendations")
    st.markdown(
        "1. **Proceed to a limited, metrics-gated launch.** Strategic fit, trends, and an "
        f"asymmetric financial profile (~${npv_b:.1f}B NPV, bounded downside) all support it; the "
        "open questions are answerable only with real adoption data.\n"
        "2. **Instrument retention above all.** The model and the Highlights precedent agree that "
        "habit-formation dominates the outcome — make the 3rd-update-in-30-days retention "
        "(by follower segment) the primary success metric, not sign-ups.\n"
        "3. **Seed cold-start before scaling.** Launch with creator/community partners and push "
        "Journeys to broad relevant interest communities — not just a creator's followers — so "
        "no Journey ever launches into an empty room.\n"
        "4. **Keep monetization patient and staged.** Ship with zero sponsored content; lead "
        "with high-intent signals and an organic guidance layer, and introduce clearly-labeled "
        "sponsored products only once the feature is proven — protect trust.\n"
        "5. **Anchor breadth, not niche.** Position around open-ended *life chapters*, not just "
        "self-improvement, to reach the mainstream adoption the revenue model requires.\n"
        "6. **Judge it as an ecosystem hub, not a single feature.** The year-one revenue "
        "understates the case: Journeys anchors a compounding flywheel across Meta AI (~1.2B "
        "MAU), Reels (~50% of IG time), Facebook (~3.07B MAU) and the fast-growing glasses "
        "business (~7M/yr, ~76% share) — the source of the 7-year NPV.")

    # --- 6. Points to consider ---------------------------------------------
    st.subheader("6. Points to consider")
    st.markdown(
        f"- {badge('FLAGGED')} Acquire an authoritative Instagram MAU and the in-app "
        "engagement split (Sensor Tower / data.ai) to tighten the model (see 📄 Sources).\n"
        "- Retention is modeled on fitness-app and Strava analogs **and corroborated by the "
        "set-and-forget abandonment of Instagram Highlights** — Journeys' actual habit curve is "
        "the single biggest thing a limited launch should measure.\n"
        "- Highlights is the closest precedent and cuts both ways: its widespread misuse as "
        "makeshift journeys **proves the appetite**, while its abandonment **caps the value** — "
        "and Instagram now demoting Highlights opens the lane and makes the conversion on-ramp "
        "timely.\n"
        "- The NPV is large because incremental cost is tiny against an at-scale audience; the "
        "sensitivity that matters is adoption and mature ARPU, not cost — so a bear outcome is a "
        "smaller win, not a loss.\n"
        "- Both Live Shopping and Highlights carried all three win-traits yet did not cleanly "
        "win — a reminder that the rubric raises odds, it does not guarantee, without an engine.\n"
        "- Cannibalization of Stories/feed posting is unmodeled and worth monitoring.",
        unsafe_allow_html=True)
    st.markdown(" ")

    action = {"GO": "full launch", "REFINE": "limited launch to de-risk",
              "NO-GO": "hold; revisit the assumptions"}[model["verdict"]]
    tab_conclusion(
        "The Case",
        f"<b>Verdict at current assumptions: {model['verdict']} → {action}.</b> The whole "
        "dashboard converges on one conclusion. Journeys fits Meta's empirical win pattern "
        f"(~{score_avg:.1f}/5) on the two traits that actually predict wins; it answers a real, "
        "Highlights-proven appetite the curated grid suppresses; the macro winds (authenticity, "
        "de-curation, the AI intent gap, and Instagram demoting Highlights) favor it; and the "
        f"economics are asymmetric — ~${npv_b:.1f}B NPV with the bear case still ~${bear_b:.1f}B "
        "positive, because it rides infrastructure Meta already owns. The rollout is sequenced so "
        "retention is locked before the crown-jewel Reels surface is risked, and marketing, "
        "Meta AI and WhatsApp each de-risk a specific failure mode. The risks are real but are "
        "execution risks with built-in mitigations; the single decisive unknown is whether users "
        "sustain the posting habit — exactly what a limited, retention-instrumented, metrics-"
        "gated launch is designed to learn. <b>Launch it, and let retention decide how far it "
        "scales.</b>")
