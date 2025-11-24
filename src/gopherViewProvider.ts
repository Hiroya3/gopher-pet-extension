import * as vscode from 'vscode';

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
        const backgroundUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'background_glass.png'));
        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview, gopherUri, backgroundUri);

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
                <img id="gopher" class="run" src="${imageUri}" alt="Gopher Pet">
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
                    position: absolute;
                    bottom: 0;
                    transition: bottom 0.3s ease-out;
                }

                @keyframes run-right {
                    /* Start from completely off-screen to the left (100% of viewport width to the left) */
                    0% { transform: translateX(-100vw); }
                    /* End at the right edge: subtract gopher width (60px) so the right edge of gopher aligns with viewport right edge */
                    100% { transform: translateX(calc(100vw - 60px)); }
                }

                .run {
                    animation: run-right 10s linear infinite;
                }

                .game-mode {
                    animation: none !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                }

                .jumping {
                    bottom: 150px !important;
                }
            </style>

            <script>
                const vscode = acquireVsCodeApi();
                const gopher = document.getElementById('gopher');
                let gameMode = false;
                let isJumping = false;

                // Listen for messages from the extension
                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.type === 'startGame') {
                        startGame();
                    }
                });

                function startGame() {
                    gameMode = true;
                    gopher.classList.remove('run');
                    gopher.classList.add('game-mode');
                }

                // Listen for space key press
                document.addEventListener('keydown', (event) => {
                    if (gameMode && event.code === 'Space' && !isJumping) {
                        event.preventDefault();
                        jump();
                    }
                });

                function jump() {
                    if (isJumping) return;

                    isJumping = true;
                    gopher.classList.add('jumping');

                    // Remove jumping class after animation completes
                    setTimeout(() => {
                        gopher.classList.remove('jumping');
                        isJumping = false;
                    }, 600); // Match with transition duration
                }

                // Focus the webview to receive keyboard events
                window.focus();
            </script>

            </html>
        `;
    }
    
}
