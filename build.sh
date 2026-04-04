#!/bin/bash
set -e
cd ./capture-search-result

# --- 作業確認 ---
check() {
    echo "$1 (y/n)"
    read answer
    if [ "$answer" != "y" ]; then
        echo "Process aborted."
        exit 1
    fi
}

check "Did you update the CHANGELOG?"
check "Did you update the version in package.json?"
check "Did you update the README if needed?"

# --- 自動チェック ---
echo "Installing dependencies..."
npm ci

echo "Running lint..."
npm run lint

# --- パッケージング ---
echo "Packaging extension..."
npx @vscode/vsce package

echo "Done."
