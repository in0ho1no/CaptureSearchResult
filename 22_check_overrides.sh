#!/bin/bash
set -e
cd ./capture-search-result

echo "Check overrides..."
node scripts/check-overrides.mjs

echo "Done."
