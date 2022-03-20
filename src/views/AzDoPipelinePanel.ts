import * as vscode from "vscode";
import * as path from "path";
import { ViewColumn } from "vscode";

export class AzDoPipelinePanel {
    public static currentPanel: AzDoPipelinePanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];
    private readonly _extensionPath: string;
    private readonly _fileUri: vscode.Uri;

    private constructor(panel: vscode.WebviewPanel, fileUri: vscode.Uri, extensionPath: string) {
        this._panel = panel;
        this._extensionPath = extensionPath;
        this._fileUri = fileUri;

        this._renderWebview();

        this._panel.onDidDispose(
            () => {
                this.dispose();
            },
            null,
            this._disposables
        );
    }

    public static render(fileUri: vscode.Uri, extensionPath: string) {
        vscode.workspace.openTextDocument(fileUri).then((document) => {
            const json = document.getText();
            if (AzDoPipelinePanel.currentPanel) {
                AzDoPipelinePanel.currentPanel._renderWebview();
                AzDoPipelinePanel.currentPanel._panel.reveal(ViewColumn.One);
                vscode.commands.executeCommand('workbench.action.webview.reloadWebviewAction');
            } else {
                const panel = vscode.window.createWebviewPanel("ado-pipeline", fileUri.toString() || "Undefined", vscode.ViewColumn.One, {
                    enableScripts: true,
                    localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'out', 'app'))],
                    retainContextWhenHidden: true
                });
                AzDoPipelinePanel.currentPanel = new AzDoPipelinePanel(panel, fileUri, extensionPath);
            }
        });
    }

    private _renderWebview() {
        this._panel.title = "YAML" || "Undefined";
        this._panel.webview.html = this._getWebviewContent();
    }

    public dispose() {
        if (AzDoPipelinePanel.currentPanel) {
            const adoTaskPanel = AzDoPipelinePanel.currentPanel;
            AzDoPipelinePanel.currentPanel = undefined;
            adoTaskPanel._panel.dispose();
            while (adoTaskPanel._disposables.length) {
                const disposable = adoTaskPanel._disposables.pop();
                if (disposable) {
                    disposable.dispose();
                }
            }
        }
    }

    private _getWebviewContent(): string {
        const mainAppPath = path.join(this._extensionPath, 'out', 'app', 'bundle.js');
        const mainAppUri = vscode.Uri.file(mainAppPath).with({ scheme: "vscode-resource" });
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
            <div id="root"></div>
            <script>
                const vscode = acquireVsCodeApi();
            </script>
            <script src="${mainAppUri}"></script>
        </body>
        </html>`;
    }
}