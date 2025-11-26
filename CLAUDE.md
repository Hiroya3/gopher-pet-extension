# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
# Compile TypeScript to JavaScript
npm run compile

# Watch mode for development (auto-recompile on changes)
npm run watch

# Run linting
npm run lint

# Run tests (compiles first, then lints, then runs tests)
npm test

# Prepare for publishing
npm run vscode:prepublish
```

## Architecture

This is a VS Code extension that displays an animated Gopher pet in the Explorer sidebar with an optional jump game mode.

### Key Components

- **src/extension.ts**: Entry point. Registers the webview view provider and the `gopher-pet.startGame` command.
- **src/gopherViewProvider.ts**: `GopherViewProvider` class implements `WebviewViewProvider`. Loads the HTML template from `media/webview.html` and injects media URIs via placeholder replacement (`{{gopherUri}}`, `{{cspSource}}`, etc.).
- **media/webview.html**: Self-contained webview with embedded CSS and JavaScript. Handles game state, jump mechanics, stone obstacles, collision detection, and scoring. Communicates with the extension via VS Code's `postMessage` API.
- **media/**: Contains GIF animations (gopher_running.GIF, gopher_spinning.GIF) and static images (background, stone).

### Webview Communication

The extension sends messages to the webview using `webview.postMessage({ type: 'startGame' })`. The webview listens via `window.addEventListener('message', ...)`.

### Game Controls

- **Space**: Jump (during game) or restart (after game over)
- **Esc**: Exit game mode and return to idle animation

## Credits

The Go gopher was designed by Renee French and is licensed under CC BY 4.0.
