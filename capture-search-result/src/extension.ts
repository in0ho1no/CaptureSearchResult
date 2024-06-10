import * as vscode from 'vscode';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "capture-search-result" is now active!');

	const copySearchResultsCommand = vscode.commands.registerCommand('capture-search-result.copySearchResults', async () => {
		// 表示中のエディタを取得する
		const searchEditor = vscode.window.activeTextEditor;
		if (!searchEditor) {
			vscode.window.showWarningMessage('No active search results to copy');
			return;
		}

		// 表示中のテキストを取得する
		const searchResults = searchEditor.document.getText();

		// テキストを加工する
		let separeta_char = vscode.workspace.getConfiguration().get<string>("capture-search-result.separator", "⋮");
		if ("" === separeta_char) {
			separeta_char = "⋮";
		}
		const processedResults = processSearchResults(searchResults, separeta_char);

		if (processedResults.length !== 0) {
			// 加工した文字列を保持する
			vscode.env.clipboard.writeText(processedResults.join('\n'));
			vscode.window.showInformationMessage(`Copied. separeted by "${separeta_char}".`);
		} else {
			vscode.window.showErrorMessage('Nothing to copy was found.');
		}
	});
	context.subscriptions.push(copySearchResultsCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}

/**
 * 検索結果を解析し、ファイル名、行番号、検索結果を加工して返す
 * @param searchResults 解析対象の検索結果文字列
 * @param separator 区切り文字として使用する文字列
 * @returns 加工された文字列
 */
function processSearchResults(searchResults: string, separeta_char: string): Array<string> {
	const lines = searchResults.split('\n');
	const processedLines:Array<string> = [];
	let currentFileName = '';

	lines.forEach(line => {
		if (line.trim().length === 0) {
			return;
		}

		if (!line.startsWith(' ')) {
			const match = line.match(/^\d+ 件の結果 - \d+ ファイル$/);
			if (match) {
				// 検索サマリとみなす
				processedLines.push(line);
			} else {
				// ファイル名とみなす
				currentFileName = line.trim().replace(':', '');
			}
		} else {
			// 検索結果とみなす
			const match = line.match(/^\s*(\d+):*\s*(.*)$/);
			if (match) {
				const row_no = match[1];
				const search_res = match[2];
				processedLines.push(`${currentFileName}${separeta_char}${row_no}${separeta_char}${search_res}`);
			}
		}
	});
	return processedLines;
}
