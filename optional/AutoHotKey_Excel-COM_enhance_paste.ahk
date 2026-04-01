#Requires AutoHotkey v2.0

#HotIf WinActive("ahk_class XLMAIN")
^+v::
{
    try {
        ; Excelオブジェクトを取得
        xl := ComObjActive("Excel.Application")
        cell := xl.ActiveCell

        ; クリップボードのデータを保持
        text := A_Clipboard

        ; 改行で分割
        rows := StrSplit(text, "`n")

        ; Excelに縦方向へ書き込み
        for i, row in rows
        {
            xl.Cells(cell.Row + i - 1, cell.Column).Value := RTrim(row, "`r")
        }

        ; 書き込んだ範囲
        rng := xl.Range(
            cell,
            xl.Cells(cell.Row + rows.Length - 1, cell.Column)
        )

        ; 範囲内に「♪」が含まれているか検索
        found := rng.Find("♪")

        if (found) {
            ; ♪で列分割
            rng.TextToColumns(
                rng,    ; Destination: 出力先
                1,      ; DataType: xlDelimited (区切り形式)
                1,      ; TextQualifier: xlTextQualifierDoubleQuote (引用符: ")
                false,  ; ConsecutiveDelimiter: 連続した区切り文字を1つとして扱うか
                false,  ; Tab: タブ
                false,  ; Semicolon: セミコロン
                false,  ; Comma: カンマ
                false,  ; Space: スペース
                true,   ; Other: その他
                "♪"     ; OtherChar: その他の文字
            )
        }
	} catch Error as e {
        ; エラー表示
        MsgBox "エラーが発生しました:`n" e.Message
    }
}
#HotIf