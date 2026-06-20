#!/bin/bash
set -e
cd ./capture-search-result

if ! command -v xvfb-run >/dev/null 2>&1; then
  echo "Error: xvfb-run is not installed."
  echo "Run the tests inside the Docker container."
  exit 1
fi

echo "Running tests..."
xvfb-run -a npm run test

echo "Done."
