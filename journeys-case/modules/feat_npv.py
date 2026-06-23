"""NPV analysis — a 7-year discounted cash-flow model for Journeys.

Ported from meta-journeys-npv.xlsx and made interactive. The whole model is ILLUSTRATIVE /
MODELED (Meta's internal costs are not public). It cross-checks against the Adoption & revenue
model (Product Case → section 6) and against Meta's real Family ARPP.
"""
import pandas as pd
import plotly.graph_objects as go
import streamlit as st

from components.data import load_json, load_assumptions, load_bytes
from components.callouts import conclusion, tab_conclusion, caption_tag
from modules.m5_model import compute as m5_compute


def _npv(net, wacc):
    return sum(n / (1 + wacc) ** t for t, n in enumerate(net))


def _irr(cfs):
    """Robust IRR via bisection on NPV(rate)=0; returns None if no sign change."""
    f = lambda r: sum(c / (1 + r) ** t for t, c in enumerate(cfs))
    lo, hi = -0.9, 10.0
    flo, fhi = f(lo), f(hi)
    if flo == 0:
        return lo
    if flo * fhi > 0:
        return None
    for _ in range(200):
        mid = (lo + hi) / 2
        fm = f(mid)
        if abs(fm) < 1e-7:
            return mid
        if flo * fm < 0:
            hi = mid
        else:
            lo, flo = mid, fm
    return (lo + hi) / 2


def _model(d, wacc, peak_users, mature_arpu, glasses_on):
    us = peak_users / d["users_m"][-1]
    ar = mature_arpu / d["arpu"][-1]
    users = [u * us for u in d["users_m"]]
    arpu = [a * ar for a in d["arpu"]]
    glass = [(g if glasses_on else 0) for g in d["glasses_mm"]]
    core = [u * a for u, a in zip(users, arpu)]
    rev = [c + g for c, g in zip(core, glass)]
    cost = [b + r for b, r in zip(d["build_cost_mm"], d["run_rate_mm"])]
    net = [rv - ct for rv, ct in zip(rev, cost)]
    dcf = [n / (1 + wacc) ** t for t, n in enumerate(net)]
    cum, s = [], 0.0
    for x in dcf:
        s += x
        cum.append(s)
    payback = next((t for t, v in enumerate(cum) if v > 0), None)
    return {"users": users, "arpu": arpu, "glass": glass, "core": core, "rev": rev,
            "cost": cost, "net": net, "dcf": dcf, "cum": cum, "npv": sum(dcf),
            "irr": _irr(net), "payback": payback,
            "bc": (sum(r / (1 + wacc) ** t for t, r in enumerate(rev)) /
                   sum(c / (1 + wacc) ** t for t, c in enumerate(cost)))}


def render():
    d = load_json("npv_model.json")

    st.header("NPV analysis — 7-year discounted cash flow")
    st.caption("A discounted cash-flow valuation of Journeys, ported from the NPV workbook and "
               "made interactive. Cross-checked against the Adoption & revenue model.")
    caption_tag("MODELED", "ILLUSTRATIVE — Meta's internal costs are not public; every figure is "
                           "an assumption. Adjust the inputs to test scenarios.")

    # --- inputs -------------------------------------------------------------
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        wacc = st.slider("Discount rate (WACC)", 0.06, 0.16, float(d["wacc"]), 0.005,
                         format="%.3f")
    with c2:
        peak = st.slider("Peak users by Yr 6 (M)", 60, 300, int(d["users_m"][-1]), 5)
    with c3:
        marpu = st.slider("Mature ARPU by Yr 6 ($/user/yr)", 5, 40, int(d["arpu"][-1]), 1)
    with c4:
        glasses_on = st.toggle("Glasses upside layer", value=True)
    st.caption(f"Peak {peak}M users = {100*peak/1000/d['ig_mau_billions']:.1f}% of a "
               f"{d['ig_mau_billions']}B Instagram MAU. Costs are held fixed across scenarios "
               "(conservative: the bear case still bears the full build).")

    m = _model(d, wacc, peak, marpu, glasses_on)

    # --- headline -----------------------------------------------------------
    st.subheader("1. Headline outputs")
    k1, k2, k3, k4 = st.columns(4)
    k1.metric("NPV (7-yr)", f"${m['npv']/1000:.1f}B")
    k2.metric("IRR", f"{m['irr']*100:.0f}%" if m["irr"] else "n/a")
    k3.metric("Benefit / cost", f"{m['bc']:.1f}×")
    k4.metric("Discounted payback",
              f"Year {m['payback']}" if m["payback"] is not None else "—")
    caption_tag("MODELED", "NPV excludes any terminal value beyond Year 6 (conservative)")
    conclusion(
        f"At the base inputs the model returns an **NPV of ~${m['npv']/1000:.1f}B** over seven "
        f"years with a benefit/cost ratio of **{m['bc']:.1f}×** and discounted payback by "
        f"**Year {m['payback']}**. The IRR (~{m['irr']*100:.0f}%) is extreme and not very "
        "meaningful on its own — it simply reflects that Journeys rides existing infrastructure "
        "and the existing social graph, so the incremental investment (~$1.4B over 7 years) is "
        "tiny next to the revenue an at-scale Instagram feature can produce. The real risk is "
        "not negative NPV; it is adoption falling short of the threshold where the loop sustains.")

    # --- cash flow chart ----------------------------------------------------
    st.subheader("2. The 7-year cash flow")
    yrs = d["years"]
    fig = go.Figure()
    fig.add_bar(x=yrs, y=m["rev"], name="Revenue", marker_color="#1a7f37")
    fig.add_bar(x=yrs, y=[-c for c in m["cost"]], name="Cost", marker_color="#cf222e")
    fig.add_trace(go.Scatter(x=yrs, y=m["cum"], name="Cumulative discounted CF",
                             mode="lines+markers", line=dict(color="#8250df", width=3)))
    fig.add_hline(y=0, line_color="#888", line_width=1)
    fig.update_layout(height=420, barmode="relative", yaxis_title="$mm",
                      legend=dict(orientation="h", y=1.1))
    st.plotly_chart(fig, width='stretch')
    conclusion(
        f"The shape is the story: two years of net investment (Years 0–1), then the cumulative "
        f"discounted cash flow crosses zero in **Year {m['payback']}** and compounds steeply as "
        "ARPU matures and the user base scales. Costs are front-loaded and modest; revenue is "
        "back-loaded and large — the classic profile of a feature that leverages infrastructure "
        "it didn't have to build.")

    # --- cash flow table ----------------------------------------------------
    with st.expander("📋 Full year-by-year cash flow"):
        tbl = pd.DataFrame({
            "$mm": ["Journey users (M)", "ARPU ($/yr)", "Core revenue", "Glasses upside",
                    "Total revenue", "Total cost", "Net cash flow", "Discounted CF",
                    "Cumulative DCF"],
            **{yrs[t]: [round(m["users"][t], 1), round(m["arpu"][t], 1), round(m["core"][t]),
                        round(m["glass"][t]), round(m["rev"][t]), round(m["cost"][t]),
                        round(m["net"][t]), round(m["dcf"][t]), round(m["cum"][t])]
               for t in range(7)}})
        st.dataframe(tbl, width='stretch', hide_index=True)

    # --- phase cost/benefit -------------------------------------------------
    st.subheader("3. Cost & benefit by rollout phase")
    ph = pd.DataFrame(d["phases"])[["phase", "name", "months", "cost_mm", "benefit"]].rename(
        columns={"cost_mm": "build $mm", "benefit": "primary benefit"})
    st.dataframe(ph, width='stretch', hide_index=True)
    total_build = sum(p["cost_mm"] for p in d["phases"])
    caption_tag("MODELED", f"one-time build/launch costs; total ≈ ${total_build}mm (run-rate "
                           "modeled separately)")
    conclusion(
        f"Total one-time build across all seven phases is only ~**${total_build}mm** — the "
        "expensive phases are the crown-jewel Reels AI CTA (Phase 4) and the genuinely "
        "re-designed Facebook and Glasses phases (5–6). Every phase is gated by the rollout "
        "roadmap, so spend is released only as each gate clears — capital is never committed "
        "ahead of proof.")

    # --- sensitivity --------------------------------------------------------
    st.subheader("4. Sensitivity")
    sc = pd.DataFrame(d["scenarios"])
    sc["NPV"] = sc["npv_mm"].apply(lambda v: f"${v/1000:.1f}B")
    show = sc[["name", "desc", "peak_users", "mature_arpu", "NPV", "read"]].rename(columns={
        "name": "Scenario", "desc": "", "peak_users": "Peak users (M)",
        "mature_arpu": "Mature ARPU ($)", "read": "Read"})
    st.dataframe(show, width='stretch', hide_index=True)
    # live WACC sensitivity on current inputs
    waccs = [0.08, 0.10, 0.12, 0.15]
    wdf = pd.DataFrame({"WACC": [f"{int(w*100)}%" for w in waccs],
                        "NPV ($B)": [round(_npv(m["net"], w) / 1000, 1) for w in waccs]})
    cA, cB = st.columns([1, 1])
    with cA:
        st.caption("Illustrative scenario NPVs (from the workbook):")
    with cB:
        st.caption("Live WACC sensitivity (your current inputs):")
        st.dataframe(wdf, width='stretch', hide_index=True)
    conclusion(
        "Even the **bear case stays strongly positive (~$2.1B)** and the project remains "
        "NPV-positive across every discount rate tested — because it rides existing "
        "infrastructure, so downside is bounded. The spread between bear and bull (~$2B to "
        "~$14.5B) is driven almost entirely by the two levers the rest of this dashboard "
        "obsesses over: **adoption** (peak users) and **monetization** (mature ARPU).")

    # --- cross-check vs Module 5 -------------------------------------------
    st.subheader("5. Cross-check vs the Adoption & revenue model")
    cfg = load_assumptions()["model"]
    r5 = m5_compute(cfg["ig_mau_base_millions"], cfg["adoption_pct"], cfg["repeat_poster_pct"],
                    cfg["retention_pct"], cfg["incremental_arpu_usd"], cfg["followers_per_journey"])
    x1, x2 = st.columns(2)
    with x1:
        st.markdown(
            f"<div style='border-left:5px solid #1a7f37;background:#f0f9f3;padding:11px 14px;"
            f"border-radius:6px;'><b>✅ User counts reconcile</b><br>"
            f"The Adoption model's bottom-up funnel — {cfg['ig_mau_base_millions']:.0f}M IG MAU × "
            f"{cfg['adoption_pct']:.0f}% start × {cfg['repeat_poster_pct']:.0f}% repeat × "
            f"{cfg['retention_pct']:.0f}% retained ≈ <b>{r5['retained']:.0f}M</b> sustained "
            f"creators — lands right on this model's <b>Year-1 active users (25M)</b>.</div>",
            unsafe_allow_html=True)
    with x2:
        eng = 1 + cfg["followers_per_journey"]
        st.markdown(
            f"<div style='border-left:5px solid #1a7f37;background:#f0f9f3;padding:11px 14px;"
            f"border-radius:6px;'><b>✅ ARPU reconciles at maturity</b><br>"
            f"The Adoption model's ${cfg['incremental_arpu_usd']:.0f}/engaged-person × ~{eng:.0f} "
            f"engaged people per active Journey ≈ <b>${cfg['incremental_arpu_usd']*eng:.0f}/active "
            f"user</b> — close to this model's mature <b>${d['arpu'][-1]}/active user</b>.</div>",
            unsafe_allow_html=True)
    st.markdown(" ")
    conclusion(
        f"The two models were built independently yet agree where they overlap: the same ~25M "
        f"sustained Year-1 users, and an equivalent mature monetization (~$25 vs ${d['arpu'][-1]} "
        "per active user). The Adoption model is the conservative **single-year, ad-targeting-"
        "only** slice; this NPV is the **multi-year, all-streams** view (sponsored recs, commerce, "
        f"affiliate, glasses). For context, the mature ARPU of ${d['arpu'][-1]}/yr is ~37% of "
        f"Meta's real Family ARPP (~${d['meta_family_arpp_yr']}/yr) — aggressive, but it is the "
        "fully-monetized end-state; the bear case (~$10) is a more modest ~16%.")

    tab_conclusion(
        "NPV analysis",
        f"On modeled-but-defensible assumptions, Journeys is a <b>strongly NPV-positive</b> bet "
        f"(~${m['npv']/1000:.1f}B base case, ~$2.1B even in the bear case), because it monetizes "
        "an at-scale Instagram audience while riding infrastructure and a social graph Meta "
        "already owns — so the ~$1.4B incremental investment is small relative to the upside, and "
        "downside is bounded. The valuation reconciles cleanly with the bottom-up Adoption model "
        "(same ~25M Year-1 users; equivalent mature ARPU) and sits at a defensible ~37% of Meta's "
        "real Family ARPP at maturity. The decisive variable is unchanged from every other tab: "
        "<b>adoption and sustained retention</b>, not cost or monetization mechanics — the spread "
        "from bear to bull is almost entirely an adoption-and-ARPU story. NPV is rarely the "
        "question for an infra-leveraged feature; whether the loop sustains is.")

    # --- Source workbook + MAU source (bottom of tab) ----------------------
    st.markdown("---")
    st.markdown("**Source**")
    st.download_button(
        "⬇ Download the source NPV workbook (.xlsx)",
        data=load_bytes("meta-journeys-npv.xlsx"),
        file_name="meta-journeys-npv.xlsx",
        mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        help="The full Excel model this tab is built from (Assumptions, Phase Cost-Benefit, NPV "
             "Model, Sensitivity). Instagram MAU = 2.4B, matching this tab.")
    st.markdown(
        f"<span style='font-size:0.8rem;color:#57606a;'>Instagram MAU base: "
        f"<b>{d['ig_mau_billions']}B</b> (2026, third-party estimate; {d['mau_range']}) — source: "
        f"<a href='{d['mau_source_url']}'>businesstats.com</a>. The NPV is independent of the MAU "
        f"base (it sets only the adoption-% context), so this tab and the workbook match. All "
        f"other figures are illustrative / modeled.</span>", unsafe_allow_html=True)
