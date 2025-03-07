import * as util from "util"
import * as vscode from "vscode"

const delay = util.promisify(setTimeout)

export async function display(text: string) {
  vscode.window.setStatusBarMessage(`Contest: ${text}`, 5000)
}
