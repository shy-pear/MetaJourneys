"""Module 3 - Cross-app & posting-behavior patterns.

Question: what is current user behavior, and does it leave room for Journeys?
"""
import plotly.express as px
import streamlit as st

from components.data import load_csv
from components.callouts import conclusion, tab_conclusion, caption_tag


def render():
    st.header("Module 3 — Behavior patterns")
    st.caption("Question: what are people actually doing on social today, and is there an unmet "
               "need for a lower-pressure, progress-oriented format? Sources: DataReportal "
               "Digital 2026, Pew 2025.")

    tr = load_csv("usage_trends.csv")
    sh = load_csv("sharing_shift.csv")

    def val(metric, year=None):
        d = tr[tr["metric"] == metric]
        if year is not None:
            d = d[d["year"] == year]
        return float(d["value"].iloc[0])

    # --- Time spent per app -------------------------------------------------
    st.subheader("1. Daily time spent per app (where attention lives)")
    apps = tr[tr["metric"].str.contains("daily time per user")].copy()
    apps["app"] = apps["metric"].str.replace(" daily time per user (Android)", "", regex=False)
    caption_tag("MEASURED", "DataReportal Digital 2026 (Android app data)")
    fig = px.bar(apps.sort_values("value"), x="value", y="app", orientation="h",
                 text="value", color="app",
                 color_discrete_map={"Instagram": "#C13584", "TikTok": "#000000",
                                     "Facebook": "#1877F2"})
    fig.update_layout(height=300, xaxis_title="Minutes per day", yaxis_title="",
                      showlegend=False)
    st.plotly_chart(fig, width='stretch')
    conclusion(
        f"Instagram already commands ~{val('Instagram daily time per user (Android)'):.0f} "
        f"minutes/day per user, but TikTok leads at "
        f"~{val('TikTok daily time per user (Android)'):.0f} min. Meta owns enormous attention "
        "to build on, yet loses time to a discovery-tuned rival — the exact 'owns attention, "
        "not action' gap Journeys targets.")

    # --- Global time trend (slight decline) --------------------------------
    st.subheader("2. Is overall social time still growing?")
    caption_tag("MEASURED", "global daily minutes on social, 2024 vs 2026")
    t24, t26 = val("Daily time spent on social media", 2024), \
        val("Daily time spent on social media", 2026)
    fig2 = px.bar(x=["2024", "2026"], y=[t24, t26], text=[t24, t26],
                  color=["2024", "2026"],
                  color_discrete_map={"2024": "#8b949e", "2026": "#0969da"})
    fig2.update_layout(height=300, yaxis_title="Minutes/day on social", xaxis_title="",
                       showlegend=False, yaxis_range=[0, 160])
    st.plotly_chart(fig2, width='stretch')
    conclusion(
        f"Global social time has flattened and even dipped slightly ({t24:.0f}→{t26:.0f} "
        "min/day), and Instagram's own engagement fell ~26% YoY (7.3%→5.4%). Growth is no longer "
        "free from more scrolling — incremental value must come from *new behaviors* (like "
        "documenting progress), not from competing harder for shrinking feed attention.")

    # --- US Instagram adoption by age --------------------------------------
    st.subheader("3. Who is on Instagram (US, by age)")
    caption_tag("MEASURED", "Pew Research Center, Americans' Social Media Use 2025")
    age = {"18–29": val("US adults 18-29 who use Instagram"),
           "All adults": val("US adults who use Instagram"),
           "65+": val("US adults 65+ who use Instagram")}
    fig3 = px.bar(x=list(age.keys()), y=list(age.values()),
                  text=[f"{v:.0f}%" for v in age.values()], color=list(age.keys()),
                  color_discrete_sequence=["#C13584", "#8250df", "#8b949e"])
    fig3.update_layout(height=300, yaxis_title="% who use Instagram", xaxis_title="",
                       showlegend=False, yaxis_range=[0, 100])
    st.plotly_chart(fig3, width='stretch')
    conclusion(
        f"Instagram skews young — {age['18–29']:.0f}% of US 18–29s use it and US usage rose 40% "
        "from 2021–2025. Young users are precisely the cohort starting skills, fitness goals, "
        "and life chapters — the native audience for a progress format.")

    # --- Sharing shift table -----------------------------------------------
    st.subheader("4. The shift away from the curated public grid")
    st.dataframe(sh[["signal", "description", "type"]], width='stretch',
                 hide_index=True)
    caption_tag("MEASURED", "platform statements & reporting; one row FLAGGED as not disclosed")
    conclusion(
        "Meta's own leadership has publicly declared the future is private and that Instagram is "
        "'no longer a photo-sharing app.' Authentic, in-progress sharing has been pushed into "
        "Stories, DMs and Close Friends. The behavior exists in fragments but has no home — "
        "which is the structural opening Journeys is designed to fill. Note: the exact "
        "quantitative split of activity by surface is NOT publicly disclosed (flagged).")

    tab_conclusion(
        "Behavior patterns",
        "The data leaves clear room for Journeys. Attention is huge but flat and partly leaking "
        "to TikTok; the young, growing Instagram base is the natural audience for documenting "
        "progress; and authentic in-progress sharing already happens — just homeless, scattered "
        "across Stories and DMs. An off-grid, low-pressure progress format addresses a behavior "
        "users are demonstrably reaching for but the curated feed actively suppresses.")
