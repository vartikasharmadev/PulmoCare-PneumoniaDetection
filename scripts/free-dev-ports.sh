#!/usr/bin/env bash
# Stop stray dev servers so `npm run dev` can bind 5000, 8000, and Vite’s port.
set -euo pipefail

kill_port() {
  local port="$1"
  local pids
  pids="$(lsof -t -iTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"
  if [[ -n "$pids" ]]; then
    echo "Port $port in use by PID(s): $pids — sending SIGTERM"
    kill $pids 2>/dev/null || true
    sleep 0.5
    pids="$(lsof -t -iTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"
    if [[ -n "$pids" ]]; then
      echo "Port $port still busy — SIGKILL"
      kill -9 $pids 2>/dev/null || true
    fi
  else
    echo "Port $port: free"
  fi
}

echo "=== Freeing API / model ports ==="
kill_port 5000
kill_port 8000

echo "=== Freeing common Vite ports (old npm run dev leaves these open) ==="
for p in 5173 5174 5175 5176 5177 5178; do
  kill_port "$p"
done

echo "=== Done. Now run: npm run dev ==="
