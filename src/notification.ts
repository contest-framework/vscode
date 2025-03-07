import * as util from "util"
import * as vscode from "vscode"

const delay = util.promisify(setTimeout)

export async function display(text: string) {
  const notification = vscode.window.setStatusBarMessage(`Contest: ${text}`)
  await delay(5000)
  notification.dispose()
}
