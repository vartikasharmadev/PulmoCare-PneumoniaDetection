#!/usr/bin/env bash
# Always uses fl_env (Python 3.9 + TensorFlow). Do not use .venv for this service.
set -euo pipefail
BACKEND="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$BACKEND/.." && pwd)"
PY="$ROOT/fl_env/bin/python"
if [[ ! -x "$PY" ]]; then
  echo "Missing $PY — create fl_env or use: python3 -m venv fl_env && pip install -r ../requirements.txt" >&2
  exit 1
fi
cd "$BACKEND"
exec "$PY" main.py
