import * as vscode from 'vscode';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "capture-search-result" is now active!');

	const copySearchResultsCommand = vscode.commands.registerCommand('capture-search-result.copySearchResults', () => {
		// 表示中のエディタを取得する
		const searchEditor = vscode.window.activeTextEditor;
		if (!searchEditor) {
			vscode.window.showWarningMessage('No active search results to copy');
			return;
		}

		// 表示中のテキストを取得する
		const searchResults = searchEditor.document.getText();

		// テキストを加工する
		const separateChar = getSeparateChar();
		const processedResults = processSearchResults(searchResults, separateChar);

		if (processedResults.length !== 0) {
			// 加工した文字列を保持する
			vscode.env.clipboard.writeText(processedResults.join('\n'));
			vscode.window.showInformationMessage(`Copied. separeted by "${separateChar}".`);
		} else {
			vscode.window.showErrorMessage('Nothing to copy was found.');
		}
	});
	context.subscriptions.push(copySearchResultsCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}

/**
 *  区切り文字を取得する
 * @returns 区切り文字
 */
function getSeparateChar(): string {
	let separator = vscode.workspace.getConfiguration().get<string>("capture-search-result.separator", "♪");
	if ("" === separator) {
		separator = "♪";
	}
	return separator;
}

/**
 * 検索結果を解析し、ファイル名、行番号、検索結果を加工して返す
 * @param searchResults 解析対象の検索結果文字列
 * @param separateChar 区切り文字として使用する文字列
 * @returns 加工された文字列
 */
export function processSearchResults(searchResults: string, separateChar: string): Array<string> {
	// CRLF/LF どちらの改行でも行末に \r を残さないよう、改行コードを正規化して分割する。
	// これにより以降の行解析（ファイル名・結果行・サマリ判定）が \r の影響を受けない。
	const lines = searchResults.split(/\r?\n/);
	let processedLines:Array<string> = [];

	// 検索結果を1行ずつに加工する
	processedLines = processSearchResultsLineByLine(lines, separateChar);

	if (processedLines.length !== 0) {
		// 列のタイトル行を先頭に付与する
		processedLines = addColumnTitleRow(processedLines, separateChar);
	}

	// 検索結果のサマリを先頭に付与する
	processedLines = addSummary(lines, processedLines);

	return processedLines;
}

/**
 * 検索結果の文字列配列を1行ずつの情報に加工して返す
 * ファイル名と行数／検索結果を1行にする
 * 
 * @param {Array<string>} searchResults - 解析対象の文字列配列.
 * @param separateChar 区切り文字として使用する文字列
 * @returns {Array<string>} - 1行ずつに加工した文字列配列
 */
export function processSearchResultsLineByLine(searchResults: Array<string>, separateChar: string): Array<string> {
	const processedLines:Array<string> = [];
	let currentFileName = '';
	let findCount = 0;

	searchResults.forEach(line => {
		try {
			if (line.trim().length === 0) {
				return;
			}

			if (!line.startsWith(' ')) {
				// ファイル名とみなす
				currentFileName = line.trim().replace(':', '');
			} else {
				// 検索結果とみなす
				// コロン後の先頭空白は trimStart() で除去する。
				// 正規表現側で \s*(.*) と書くと「空白にマッチする量指定子の隣接」となり
				// 多項式バックトラック(ReDoS)としてCodeQLに検出されるため、ここでは行わない。
				const match = line.match(/^\s*(\d+):(.*)$/);
				if (match) {
					findCount = findCount + 1;
					const row_no = match[1];
					const search_res = match[2].trimStart();
					const findResult = [
						findCount,
						currentFileName,
						row_no,
						search_res,
					];
					const findResultRow = findResult.join(separateChar);
					processedLines.push(findResultRow);
				}
			}
		} catch (error) {
			console.error(`Failed to process line: "${line}"`, error);
		}
	});
	return processedLines;
}

/**
 * 列のタイトル行を文字列配列の先頭に付与して返す
 * 設定がOFFの場合、与えられた文字列配列のまま返す
 * 
 * @param {Array<string>} targetLines - タイトル行を付与したい文字列配列
 * @param separateChar 区切り文字として使用する文字列
 * @returns {Array<string>} - タイトル行を付与した文字列配列.
 */
function addColumnTitleRow(targetLines: Array<string>, separateChar: string): Array<string> {
	const copyColumnTitleRow = vscode.workspace.getConfiguration().get<boolean>("capture-search-result.add-columnTitleRow", true);
	if (copyColumnTitleRow) {
		const columnTitle = [
			"No.",
			"ファイル名",
			"行数",
			"検索結果",
		];
		const columnTitleRow = columnTitle.join(separateChar);

		return [
			columnTitleRow,
			...targetLines
		];
	}
	return targetLines;
}

/**
 * サマリの情報を取得し、文字列配列の先頭に付与して返す
 * 設定がOFFの場合、与えられた文字列配列のまま返す
 * 
 * @param {Array<string>} searchResults - 解析対象の文字列配列.
 * @param {Array<string>} targetLines - サマリを付与したい文字列配列
 * @returns {Array<string>} - サマリの情報を保持した文字列配列.
 */
function addSummary(searchResults: Array<string>, targetLines: Array<string>): Array<string> {
	const copySummary = vscode.workspace.getConfiguration().get<boolean>("capture-search-result.copy-summary", true);
	if (copySummary) {
		const summary = getSummary(searchResults);
		if (summary !== undefined) {
			return [
				summary,
				...targetLines
			];
		}
	}
	return targetLines;
}

/**
 * 検索結果の文字列配列からサマリ行を取得する。
 * サマリは1行のみのため、最初に見つかった行を返す。
 *
 * @param {Array<string>} searchResults - 検索結果の文字列配列.
 * @returns {string | undefined} - 取得したサマリ行。見つからない場合はundefined.
 */
export function getSummary(searchResults: Array<string>): string | undefined {
	// 「<件数> <件数の単位> - <ファイル数> <ファイル数の単位>」形式のみをサマリとみなす。
	// 単位語にアンカーすることで「12 apples - 3 oranges」のような行の誤検出を防ぐ。
	// 単位は対応ロケール（日本語・英語）に限定する。
	const regex = /^\d[\d,]* (?:results?|件の結果) - \d[\d,]* (?:files?|ファイル)$/;
	return searchResults.find(str => regex.test(str));
}
