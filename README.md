
[The extension's README is here](/capture-search-result/README.md)

## Repository Structure

```
CaptureSearchResult/
├── capture-search-result/   # VSCode extension
└── optional/                # Optional tools
    └── AutoHotKey_Excel-COM_enhance_paste.ahk
```

## Optional: Excel Paste Integration (AutoHotKey)

`optional/AutoHotKey_Excel-COM_enhance_paste.ahk` は、本拡張機能でコピーした検索結果を Excel へ貼り付けるための AutoHotKey スクリプトです。

### 必要環境

- Windows
- [AutoHotkey v2.0](https://www.autohotkey.com/)

### 動作

Excel がアクティブな状態で `Ctrl+Shift+V` を押すと：

1. クリップボードの内容を貼り付ける
2. 貼り付けた範囲に区切り文字 `♪` が含まれている場合、自動で「区切り位置」を実行して列分割する
3. `♪` が含まれていない場合は通常の貼り付けのみ行う

### 使い方

1. `AutoHotKey_Excel-COM_enhance_paste.ahk` をダブルクリックして起動する
2. VSCode の Search Editor で `Ctrl+Alt+C` を押して検索結果をコピーする
3. Excel のセルを選択し、`Ctrl+Shift+V` で貼り付ける
