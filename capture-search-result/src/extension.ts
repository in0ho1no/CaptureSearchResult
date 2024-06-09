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

		// 表示中のテキストをコピーする
		const searchResults = searchEditor.document.getText();
		vscode.env.clipboard.writeText(searchResults);
	});
	
	context.subscriptions.push(copySearchResultsCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
