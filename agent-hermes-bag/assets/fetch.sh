#!/usr/bin/env bash
# Downloads the official portrait next to the app.
#
# Why bother: a same-origin image is one the browser lets us put on your
# clipboard and into the phone share sheet. Served from the CDN, the browser
# may refuse (CORS) and you'd have to copy the image by hand.
#
#   bash assets/fetch.sh   (run once, from the agent-hermes-bag folder)

set -e
cd "$(dirname "$0")"

URL="https://d8j0ntlcm91z4.cloudfront.net/user_39GrJSxSPVFsFnh94GJ8Kef3kcI/hf_20260727_203930_f1459ff7-0c2e-46b0-b653-c20db30ec694.png"

echo "Fetching the official portrait…"
curl -fsSL "$URL" -o agent-hermes-bag.png
echo "Saved: $(pwd)/agent-hermes-bag.png"
echo
echo "Commit it so it lives with the repo:"
echo "  git add agent-hermes-bag/assets/agent-hermes-bag.png && git commit -m 'Add Agent Hermes Bag portrait'"
