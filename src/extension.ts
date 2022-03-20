import * as vscode from 'vscode';
import { AzDoPipelinePanel } from './views/AzDoPipelinePanel';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('ado-pipeline-vscode.viewPipeline', (uri: vscode.Uri | undefined) => viewTask(uri, context)));
}

export function deactivate() { }

function viewTask(uri: vscode.Uri | undefined, context: vscode.ExtensionContext) {
	uri = uri || vscode.window.activeTextEditor?.document.uri;
	if (!uri) { return; }
	AzDoPipelinePanel.render(uri, context.extensionPath);
}
