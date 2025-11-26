import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class GopherViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'gopherPetView';
	private _view?: vscode.WebviewView;

	constructor(private readonly _context: vscode.ExtensionContext) {}

	public resolveWebviewView(
        webviewView: vscode.WebviewView,
		_context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
    ) {
		this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(this._context.extensionUri, 'media')],
        };

        const gopherUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'gopher_running.GIF'));
        const gopherSpinningUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'gopher_spinning.GIF'));
        const backgroundUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'background_glass.png'));
        const stoneUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'stone.png'));
        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview, gopherUri, gopherSpinningUri, backgroundUri, stoneUri);

		// Clean up when the webview is disposed
		webviewView.onDidDispose(() => {
			this._view = undefined;
		});
    }

	public startGame() {
		if (this._view) {
			this._view.show(true); // Focus the webview
			this._view.webview.postMessage({ type: 'startGame' });
		}
	}

    private getHtmlForWebview(webview: vscode.Webview, gopherUri: vscode.Uri, spinningUri: vscode.Uri, backgroundUri: vscode.Uri, stoneUri: vscode.Uri): string {
        // Read the HTML template file
        const htmlPath = path.join(this._context.extensionUri.fsPath, 'media', 'webview.html');
        let html = fs.readFileSync(htmlPath, 'utf8');

        // Replace placeholders with actual values
        html = html.replace(/\{\{cspSource\}\}/g, webview.cspSource);
        html = html.replace(/\{\{gopherUri\}\}/g, gopherUri.toString());
        html = html.replace(/\{\{spinningUri\}\}/g, spinningUri.toString());
        html = html.replace(/\{\{backgroundUri\}\}/g, backgroundUri.toString());
        html = html.replace(/\{\{stoneUri\}\}/g, stoneUri.toString());

        return html;
    }

}
