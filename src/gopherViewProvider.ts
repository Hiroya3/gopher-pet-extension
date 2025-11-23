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

        const gopherUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'gopher_running.GIF'));
        const backgroundUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'background_glass.png'));
        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview, gopherUri, backgroundUri);
    }

    private getHtmlForWebview(webview: vscode.Webview, imageUri: vscode.Uri, backgroundUri: vscode.Uri): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="
                    default-src 'none';
                    img-src ${webview.cspSource};
                    style-src 'unsafe-inline';
                    script-src 'unsafe-inline';
                ">
            </head>
    
            <body>
                <img id="gopher" src="${imageUri}" alt="Gopher Pet">
            </body>
    
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    height: 100vh;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    overflow: hidden;
    
                    background-image: url('${backgroundUri}');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                }
    
                #gopher {
                    width: 60px;
                    z-index: 2;
                }
            </style>
    
            </html>
        `;
    }
    
}
