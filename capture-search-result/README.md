# Capture Search Result

[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/in0ho1no/CaptureSearchResult/blob/main/capture-search-result/LICENSE)
[![Test](https://github.com/in0ho1no/CaptureSearchResult/actions/workflows/test.yml/badge.svg)](https://github.com/in0ho1no/CaptureSearchResult/actions/workflows/test.yml)
[![Release](https://img.shields.io/github/v/release/in0ho1no/CaptureSearchResult)](https://github.com/in0ho1no/CaptureSearchResult/releases)

A Visual Studio Code extension that copies search results to the clipboard in a structured format with a single shortcut. Results are formatted with a configurable separator, making them easy to paste into Excel or other spreadsheet tools.

## Features

- Copy search results to the clipboard with `Ctrl+Alt+C`
- Output includes: sequential number, file path, line number, and matched text
- Configurable field separator (default: `♪`)
- Optionally prepend a column title row and search summary

> The shortcut is only available within the Search Editor.

> Restart Visual Studio Code after installing this extension.

## Output Format

Each result row is formatted as:

```
No.♪ファイル名♪行数♪検索結果
```

If the summary and column title options are enabled (default), the full output looks like:

```
3 件の結果 - 1 ファイル
No.♪ファイル名♪行数♪検索結果
1♪/path/to/file.ts♪10♪matched text here
2♪/path/to/file.ts♪25♪another match
3♪/path/to/file.ts♪42♪yet another match
```

## Settings

| Setting | Type | Default | Description |
|---|---|---|---|
| `capture-search-result.separator` | string | `♪` | Field separator character |
| `capture-search-result.copy-summary` | boolean | `true` | Prepend search summary line |
| `capture-search-result.add-columnTitleRow` | boolean | `true` | Prepend column title row |

## Requirements

- Visual Studio Code `^1.110.0`
