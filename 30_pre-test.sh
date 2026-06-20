#!/bin/bash
set -e
cd ./capture-search-result

echo "Installing dependencies..."
npm ci

echo "Running lint..."
npm run lint

echo "Done."
