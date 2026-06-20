#!/bin/bash
set -e
cd ./capture-search-result

echo "Only perform the production build..."
npm run vscode:prepublish

echo "Done."
