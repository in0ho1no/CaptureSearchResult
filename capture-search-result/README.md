# Capture Search Result

[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/in0ho1no/CaptureSearchResult/blob/main/capture-search-result/LICENSE)
[![Test](https://github.com/in0ho1no/CaptureSearchResult/actions/workflows/test.yml/badge.svg)](https://github.com/in0ho1no/CaptureSearchResult/actions/workflows/test.yml)
[![Release](https://img.shields.io/github/v/release/in0ho1no/CaptureSearchResult)](https://github.com/in0ho1no/CaptureSearchResult/releases)

VSCode の検索結果を、ショートカットキー1つで構造化された形式のままクリップボードにコピーする拡張機能です。区切り文字で整形されるため、Excel などの表計算ソフトへそのまま貼り付けることができます。

## 機能

- `Ctrl+Alt+C` で検索結果をクリップボードにコピー
- 出力内容：連番・ファイルパス・行番号・マッチしたテキスト
- 区切り文字をカスタマイズ可能（デフォルト：`♪`）
- 列タイトル行と検索サマリの先頭付与を設定で切り替え可能
- 検索サマリは日本語・英語の VSCode 表示言語に対応

> ショートカットは Search Editor 内でのみ有効です。

> インストール後は VSCode を再起動してください。

## 出力形式

各結果行は以下の形式で出力されます：

```
No.♪ファイル名♪行数♪検索結果
```

サマリと列タイトルが有効な場合（デフォルト）、全体の出力は以下のようになります：

```
3 件の結果 - 1 ファイル
No.♪ファイル名♪行数♪検索結果
1♪/path/to/file.ts♪10♪matched text here
2♪/path/to/file.ts♪25♪another match
3♪/path/to/file.ts♪42♪yet another match
```

## 設定

| 設定項目 | 型 | デフォルト | 説明 |
|---|---|---|---|
| `capture-search-result.separator` | string | `♪` | フィールドの区切り文字 |
| `capture-search-result.copy-summary` | boolean | `true` | 検索サマリを先頭に付与する |
| `capture-search-result.add-columnTitleRow` | boolean | `true` | 列タイトル行を先頭に付与する |

## Excel 連携（オプション）

コピーした検索結果を Excel へ `Ctrl+Alt+V` 1つで貼り付け・列分割まで行う AutoHotKey スクリプトをGithub上で公開しています。

詳細はリポジトリルートの [README](https://github.com/in0ho1no/CaptureSearchResult/blob/main/README.md) を参照してください。

## 動作要件

- Visual Studio Code `^1.110.0`

## 開発時の依存関係インストール

このリポジトリでは、依存関係インストール時の lifecycle script 実行リスクを下げるため、[.npmrc](.npmrc) で `ignore-scripts=true` を既定にしています。

通常の開発ではそのままで問題ありません。将来、特定の依存関係だけ `postinstall` などが本当に必要になった場合は、対象を確認したうえで個別に `npm rebuild <package-name> --ignore-scripts=false` を実行してください。
