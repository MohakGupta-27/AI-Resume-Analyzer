"""
keep_alive.py — Pings backend & frontend every 2 minutes to prevent
Render free-tier services from sleeping.

Usage (local):
    python keep_alive.py

Deploy on Render as a Background Worker or Cron Job to run 24/7.
"""

import urllib.request
import time
import datetime

# ──────────── CONFIGURE YOUR URLS HERE ────────────
BACKEND_URL = "https://ai-resume-analyzer-w8vq.onrender.com/health"
FRONTEND_URL = "https://ai-resume-analyzer-hpq4.onrender.com"
# ──────────────────────────────────────────────────

INTERVAL_SECONDS = 120  # 2 minutes


def ping(url: str) -> None:
    """Send a GET request to the given URL and print the result."""
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=30) as resp:
            status = resp.status
            print(f"[{timestamp}] ✅ {url} → {status}")
    except Exception as e:
        print(f"[{timestamp}] ❌ {url} → {e}")


def main() -> None:
    print("=" * 60)
    print("🔄 Keep-Alive Pinger Started")
    print(f"   Backend  : {BACKEND_URL}")
    print(f"   Frontend : {FRONTEND_URL}")
    print(f"   Interval : every {INTERVAL_SECONDS}s ({INTERVAL_SECONDS // 60} min)")
    print("=" * 60)

    while True:
        ping(BACKEND_URL)
        ping(FRONTEND_URL)
        print(f"   ⏳ Next ping in {INTERVAL_SECONDS // 60} minutes...\n")
        time.sleep(INTERVAL_SECONDS)


if __name__ == "__main__":
    main()
