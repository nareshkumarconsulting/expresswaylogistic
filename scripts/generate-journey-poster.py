#!/usr/bin/env python3
"""Copy the journey poster base to the published PNG (no logo overlay)."""

from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "docs" / "expressway-journey-base.png"
OUT = ROOT / "docs" / "expressway-end-to-end-journey.png"

CURSOR_BASE = (
    Path.home()
    / ".cursor/projects/Users-naresh-Documents-Projects-expressWayLogistic/assets/expressway-journey-base.png"
)


def resolve_base() -> Path:
    if BASE.exists():
        return BASE
    if CURSOR_BASE.exists():
        return CURSOR_BASE
    raise SystemExit("Missing expressway-journey-base.png in docs/.")


def main() -> None:
    base = resolve_base()
    if base != BASE:
        shutil.copy2(base, BASE)
    shutil.copy2(BASE, OUT)
    print(f"Wrote {OUT} (no logo)")


if __name__ == "__main__":
    main()
