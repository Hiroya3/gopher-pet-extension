import * as vscode from 'vscode';

export class GopherViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'gopherPetView';
	
	constructor(private readonly _context: vscode.ExtensionContext) {}

	public resolveWebviewView(
        webviewView: vscode.WebviewView,
		_context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
    ) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(this._context.extensionUri, 'media')],
        };

        const gopherUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'gopher.PNG'));
        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview, gopherUri);
    }

    private getHtmlForWebview(webview: vscode.Webview, imageUri: vscode.Uri): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource};">
            </head>
            <body>
                <img src="${imageUri}" alt="Gopher Pet">
            </body>
            </html>
        `;
    }
}
