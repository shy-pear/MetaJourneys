"""Cached CSV / YAML / JSON loaders.

Caches are keyed on the file's modification time, so editing a data file busts its cache and
the app always reflects the latest content (a plain @st.cache_data keys only on the function
args, so file edits would otherwise be ignored until the server restarts).
"""
import json
from pathlib import Path
import pandas as pd
import yaml
import streamlit as st

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"


def _mtime(path: Path) -> float:
    try:
        return path.stat().st_mtime
    except OSError:
        return 0.0


@st.cache_data
def _read_csv(path: str, mtime: float) -> pd.DataFrame:
    return pd.read_csv(path)


def load_csv(name: str) -> pd.DataFrame:
    p = DATA / name
    return _read_csv(str(p), _mtime(p))


@st.cache_data
def _read_yaml(path: str, mtime: float) -> dict:
    with open(path) as f:
        return yaml.safe_load(f)


def load_assumptions() -> dict:
    p = ROOT / "config" / "assumptions.yaml"
    return _read_yaml(str(p), _mtime(p))


@st.cache_data
def _read_text(path: str, mtime: float) -> str:
    return Path(path).read_text()


def load_sources_md() -> str:
    p = DATA / "SOURCES.md"
    return _read_text(str(p), _mtime(p))


@st.cache_data
def _read_json(path: str, mtime: float) -> dict:
    with open(path) as f:
        return json.load(f)


def load_json(name: str) -> dict:
    p = DATA / name
    return _read_json(str(p), _mtime(p))


@st.cache_data
def _read_bytes(path: str, mtime: float) -> bytes:
    return Path(path).read_bytes()


def load_bytes(name: str) -> bytes:
    p = DATA / name
    return _read_bytes(str(p), _mtime(p))
