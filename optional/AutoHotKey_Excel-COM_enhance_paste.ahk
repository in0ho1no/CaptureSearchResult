#Requires AutoHotkey v2.0

#HotIf WinActive("ahk_class XLMAIN")
^+v::
{
    try {
        ; クリップボードが空の場合終了
        if (A_Clipboard = "")
            return

        ; クリップボードのデータを保持
        text := A_Clipboard

        ; ♪ が含まれていなければ何もしない
        if (!InStr(text, "♪"))
            return

        ; Excelオブジェクトを取得
        xl := ComObjActive("Excel.Application")
        cell := xl.ActiveCell

        ; 描画更新を一時的に停止させる
        xl.ScreenUpdating := False

        ; 改行で分割
        rows := StrSplit(StrReplace(text, "`r"), "`n")

        rowCount := rows.Length

        ; COM用2次元配列（1列）
        arr := ComObjArray(12, rowCount, 1)  ; 12 = VT_VARIANT

        Loop rowCount
        {
            arr[A_Index-1, 0] := rows[A_Index]
        }

        ; 書き込んだ範囲
        rng := xl.Range(
            cell,
            xl.Cells(cell.Row + rowCount - 1, cell.Column)
        )

        rng.Value := arr

        ; 範囲内に「♪」が含まれていれば列分割
        found := rng.Find("♪", , , 2)
        if (found) {
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

        ; 描画更新を再開させる
        xl.ScreenUpdating := True
    } catch Error as e {
        ; エラー表示
        MsgBox "エラー:`n" e.Message
        try xl.ScreenUpdating := True
    }
}
#HotIf