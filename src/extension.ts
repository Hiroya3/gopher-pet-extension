// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "gopher-pet" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('gopher-pet.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from gopher-pet!');
	});

	context.subscriptions.push(disposable);

	const showGopherPet = vscode.commands.registerCommand(
		'gopher-pet.showGopherPet', 
		() => {
			const panel = vscode.window.createWebviewPanel(
				'gopherView',
				'Gopher Pet',
				vscode.ViewColumn.Two,
				{
					enableScripts: true,
					// localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
				}
			)

			panel.webview.html = getWebviewContent(panel.webview,context);
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
