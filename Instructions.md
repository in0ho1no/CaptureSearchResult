# CaptureSearchResult

## git環境

### 初回リポジトリ作成

    git init
    git remote add origin <接続するリポジトリ名>
    git pull
    git config --local user.name [name]
    git config --local user.email [email]
    git add Instructions.md
    git commit -m "first commit"
    git branch -M main
    git push -u origin main

## 初回準備

### 前提

WSL2 + docker環境は構築済みであること

### VSCode上で有効にしておく拡張機能

Dockerコンテナ上の環境で作業するために必要となる拡張機能を有効化しておくこと。  

    ms-vscode-remote.vscode-remote-extensionpack
    ms-vscode-remote.remote-wsl
    ms-vscode-remote.remote-containers
    ms-vscode-remote.remote-ssh
    ms-vscode.remote-server
    ms-vscode.remote-explorer
