import * as path from 'path';
import * as vscode from 'vscode';

var previewPanel : any;

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('webview.show', () => {
			show(context);
		})
	);

}

async function show(context : vscode.ExtensionContext) {
       
	// Otherwise, create a new panel.
	if (!previewPanel) {
		previewPanel = vscode.window.createWebviewPanel(
			"test",
			'test',
			{
				viewColumn : vscode.ViewColumn.One
			},
			{
				enableScripts: true
			}
		);
		const i18nPath = previewPanel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'resources', "i18n.properties")));
		previewPanel.webview.html = _getHtmlForWebview(i18nPath);
		previewPanel.onDidDispose(() => {
			previewPanel = null;
		});
	} else {
		if (!previewPanel.visible) {
			previewPanel.reveal();
		}
	}

}


function _getHtmlForWebview(i18nPath: string) {
	return `<!DOCTYPE html>
	<html>
		<head>
			<title>Test</title>
		</head>
		<script type="text/javascript">
			function getI18n() {
				var xhr = new XMLHttpRequest();
				xhr.open('GET', "${i18nPath}", true); 
				var oResult = document.querySelector('#result');
				xhr.onreadystatechange = function() {
					if (xhr.readyState === 4) {
						var response = typeof xhr.response !== 'undefined' ? xhr.response : xhr.responseText; //$NON-NLS-0$
						var responseText = typeof response === 'string' ? response : null; //$NON-NLS-0$
						var statusCode = xhr.status;
						
						if (200 <= statusCode && statusCode < 400) {
							oResult.textContent = responseText;
						} else {
							oResult.textContent = "Stauts Code: " + statusCode;
						}
					} else {
						oResult.textContent = "Stauts Code: " +  xhr.status;
					}
				};
				try {
					xhr.send();	
				} catch(e) {
					oResult.textContent = e.message ? e.message: JSON.stringify(e);
				}
			}
		</script>
		<body style="width:100%;min-width:480px;height:100%;padding:0">
		
			<div>
				<span>
					<input type="button" value="get I18n"  onclick="getI18n();"/>
					<span id="result" style="width:100%"></span>
				</span>
			</div>
			<div id="content" style="height:90%">
			</div>
		</body>
	</html>`;
}


