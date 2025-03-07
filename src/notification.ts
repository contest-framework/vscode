import * as vscode from "vscode"

export async function display(text: string) {
  vscode.window.setStatusBarMessage(`Contest: ${text}`, 5000)
}
