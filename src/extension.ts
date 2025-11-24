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
	);

	// Register the start game command
	context.subscriptions.push(
		vscode.commands.registerCommand('gopher-pet.startGame', () => {
			provider.startGame();
			vscode.window.showInformationMessage('Gopher game started! Press Space to jump!');
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
