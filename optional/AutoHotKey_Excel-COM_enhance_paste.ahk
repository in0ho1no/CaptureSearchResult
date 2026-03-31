#Requires AutoHotkey v2.0

#HotIf WinActive("ahk_class XLMAIN")
^+v::
{
    try {
        ; Excelオブジェクトを取得
        xl := ComObjActive("Excel.Application")
        
        ; 1. 貼り付けを実行
        xl.ActiveSheet.Paste
        
        ; 2. 貼り付けた範囲（現在の選択範囲）を取得
        sel := xl.Selection
        
        ; 3. 範囲内に「♪」が含まれているか検索
        ; Findメソッドで最初に見つかったセルを返します
        found := sel.Find("♪")
        
        if (found) {
            ; 「♪」が見つかった場合のみ「区切り位置」を実行
            ; 引数を詳細に設定することで、Excelの「記憶」に頼らず挙動を固定します
            sel.TextToColumns(
                sel,    ; Destination: 出力先
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
        ; 見つからない場合は何もしない（＝通常の貼り付けのみで終了）

	} catch Error as e {
        ; エラーの内容を正しく表示するように修正
        MsgBox "エラーが発生しました:`n" e.Message
    }
}
#HotIf