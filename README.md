
拡張機能本体のREADMEは[こちら](/capture-search-result/README.md)

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

1. クリップボードが空の場合は何もしない
1. `♪` が含まれていない場合は何もしない
1. クリップボードの内容を選択中のセルから順に書き込む
1. 書き込んだ範囲に区切り文字 `♪` が含まれている場合、自動で「区切り位置」を実行して列分割する

### 使い方

1. `AutoHotKey_Excel-COM_enhance_paste.ahk` をダブルクリックして起動する
1. VSCode の Search Editor で `Ctrl+Alt+C` を押して検索結果をコピーする
1. Excel の貼り付け先の先頭セルを選択し、`Ctrl+Alt+V` で貼り付ける

### 注意事項

- **既存データへの上書き警告**：列分割（区切り位置）の際に、分割先のセルに既存データがある場合、Excel の確認メッセージ（「データが既にあります。置き換えますか？」）が表示されます。このメッセージで **キャンセルを選択するとエラーダイアログが表示されます**。エラーダイアログの「OK」を押すと処理は終了します。既存データが失われないよう、貼り付け先は空の列を選択することを推奨します。
