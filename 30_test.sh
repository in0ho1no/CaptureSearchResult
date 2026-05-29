#!/bin/bash
set -e
cd ./capture-search-result

echo "Running tests..."
xvfb-run -a npm run test

echo "Done."
