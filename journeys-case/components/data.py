"""Cached CSV / YAML loaders."""
from pathlib import Path
import pandas as pd
import yaml
import streamlit as st

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"


@st.cache_data
def load_csv(name: str) -> pd.DataFrame:
    return pd.read_csv(DATA / name)


@st.cache_data
def load_assumptions() -> dict:
    with open(ROOT / "config" / "assumptions.yaml") as f:
        return yaml.safe_load(f)


@st.cache_data
def load_sources_md() -> str:
    return (DATA / "SOURCES.md").read_text()
