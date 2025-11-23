// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GopherViewProvider } from './gopherViewProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const provider = new GopherViewProvider(context);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			GopherViewProvider.viewType,
			provider,
		)
	)

	let currentPanel: vscode.WebviewPanel | undefined = undefined;

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const showGopherPet = vscode.commands.registerCommand(
		'gopher-pet.showGopherPet', 
		() => {

			// the column num (one: left, two: right....) in which user shows the editor
			const columnToShowIn = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

			if (currentPanel){
				currentPanel.reveal(columnToShowIn);
			} else {
				currentPanel = vscode.window.createWebviewPanel(
					'gopherView',
					'Gopher Pet',
					columnToShowIn || vscode.ViewColumn.One,
					{
						enableScripts: true,
						// localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
					}
				);
				currentPanel.webview.html = getWebviewContent(currentPanel.webview,context);

				// dispose the panel when the user closes it
				currentPanel.onDidDispose(() => {
					currentPanel = undefined;
				}, null, context.subscriptions);
			}
		}
	);

	context.subscriptions.push(showGopherPet);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getWebviewContent(webview: vscode.Webview, context: vscode.ExtensionContext): string {
	// const gopherImage = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'media', 'gopher.png'));

	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Gopher Pet</title>
		</head>
		<body>
			<img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" alt="Gopher Pet">
		</body>
		</html>
	`;
}
