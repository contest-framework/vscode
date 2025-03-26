import * as vscode from "vscode"

import * as notification from "./notification"
import * as pipe from "./pipe"
import { UserError } from "./user_error"
import * as workspace from "./workspace"

/** the action that should happen when the user saves a file */
const enum ActionOnSave {
  none,
  testActiveFile,
  testActiveFileOnDouble,
  repeatLastTest,
  repeatLastTestOnDouble
}

let actionOnSave: ActionOnSave = ActionOnSave.none
let lastTest: string | undefined = undefined
let lastTestTime = 0
const DOUBLE_THRESHOLD = 500 // how fast two saves need to follow each other to be considered a double-save, in ms

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("contest-vscode.active-file-on-save", wrapLogger(activeFileOnSave)),
    vscode.commands.registerCommand("contest-vscode.all-once", wrapLogger(allOnce)),
    vscode.commands.registerCommand("contest-vscode.all-on-save", wrapLogger(allOnSave)),
    vscode.commands.registerCommand("contest-vscode.all-on-double-save", wrapLogger(allOnDoubleSave)),
    vscode.commands.registerCommand("contest-vscode.this-file-once", wrapLogger(thisFileOnce)),
    vscode.commands.registerCommand("contest-vscode.this-file-on-save", wrapLogger(thisFileOnSave)),
    vscode.commands.registerCommand("contest-vscode.this-file-on-double-save", wrapLogger(thisFileOnDoubleSave)),
    vscode.commands.registerCommand("contest-vscode.this-line-once", wrapLogger(thisLineOnce)),
    vscode.commands.registerCommand("contest-vscode.this-line-on-save", wrapLogger(thisLineOnSave)),
    vscode.commands.registerCommand("contest-vscode.this-line-on-double-save", wrapLogger(thisLineOnDoubleSave)),
    vscode.commands.registerCommand("contest-vscode.repeat-once", wrapLogger(repeatOnce)),
    vscode.commands.registerCommand("contest-vscode.repeat-on-save", repeatOnSave),
    vscode.commands.registerCommand("contest-vscode.repeat-on-double-save", repeatOnDoubleSave),
    vscode.commands.registerCommand("contest-vscode.stop", wrapLogger(stopTest)),
    vscode.commands.registerCommand("contest-vscode.quit", quitServer),
    vscode.workspace.onDidSaveTextDocument(documentSaved)
  )
}

async function activeFileOnSave() {
  if (actionOnSave === ActionOnSave.testActiveFile) {
    actionOnSave = ActionOnSave.none
    notification.display("test active file on save OFF")
  } else {
    actionOnSave = ActionOnSave.testActiveFile
    notification.display("test active file on save ON")
    try {
      const relPath = workspace.currentFile()
      await pipe.send(`{ "command": "test-file", "file": "${relPath}" }`)
    } catch {
      // no problem if this command is run without a file open
    }
  }
}

async function allOnce() {
  notification.display("testing all files")
  lastTest = `{ "command": "test-all" }`
  await pipe.send(lastTest)
}

async function allOnSave() {
  notification.display("running all tests on save")
  actionOnSave = ActionOnSave.repeatLastTest
  lastTest = `{ "command": "test-all" }`
  await pipe.send(lastTest)
}

function documentSaved() {
  const currentTestTime = Date.now()
  const msSinceLastTest = currentTestTime - lastTestTime
  const isDoubleSave = msSinceLastTest < DOUBLE_THRESHOLD
  switch (actionOnSave) {
    case ActionOnSave.none:
      break
    case ActionOnSave.repeatLastTest:
      wrapLogger(repeatOnce)()
      break
    case ActionOnSave.repeatLastTestOnDouble:
      if (isDoubleSave) {
        wrapLogger(repeatOnce)()
      }
      break
    case ActionOnSave.testActiveFile:
      wrapLogger(thisFileOnce)()
      break
    case ActionOnSave.testActiveFileOnDouble:
      if (isDoubleSave) {
        wrapLogger(thisFileOnce)()
      }
      break
  }
}

async function quitServer() {
  notification.display(`stopping the Contest server`)
  await pipe.send(`{ "command": "quit" }`)
}

async function repeatOnce() {
  if (!lastTest) {
    notification.display("no test to repeat")
    return
  }
  notification.display("repeating the last test")
  await pipe.send(lastTest)
}

function repeatOnSave() {
  if (actionOnSave === ActionOnSave.repeatLastTest) {
    actionOnSave = ActionOnSave.none
    notification.display("repeat last test on save OFF")
  } else {
    actionOnSave = ActionOnSave.repeatLastTest
    notification.display("repeat last test on save ON")
  }
}

async function stopTest() {
  notification.display("stopping the current test")
  await pipe.send(`{ "command": "stop-test" }`)
}

async function thisFileOnce() {
  const relPath = workspace.currentFile()
  notification.display(`testing file ${relPath}`)
  lastTest = `{ "command": "test-file", "file": "${relPath}" }`
  await pipe.send(lastTest)
}

async function thisFileOnSave() {
  actionOnSave = ActionOnSave.repeatLastTest
  const relPath = workspace.currentFile()
  notification.display(`testing file ${relPath} on save`)
  lastTest = `{ "command": "test-file", "file": "${relPath}" }`
  await pipe.send(lastTest)
}

async function thisLineOnce() {
  const relPath = workspace.currentFile()
  const line = workspace.currentLine() + 1
  notification.display(`testing function at ${relPath}:${line}`)
  lastTest = `{ "command": "test-file-line", "file": "${relPath}", "line": ${line} }`
  await pipe.send(lastTest)
}

async function thisLineOnSave() {
  actionOnSave = ActionOnSave.repeatLastTest
  const relPath = workspace.currentFile()
  const line = workspace.currentLine() + 1
  notification.display(`testing function at ${relPath}:${line} on save`)
  lastTest = `{ "command": "test-file-line", "file": "${relPath}", "line": ${line} }`
  await pipe.send(lastTest)
}

/// provides a function that executes the given function and logs UserErrors
function wrapLogger(f: () => Promise<void>): () => Promise<void> {
  const runAndCatch = async function(f: () => Promise<void>) {
    try {
      await f()
    } catch (e) {
      if (e instanceof UserError) {
        vscode.window.showErrorMessage(e.message)
        if (actionOnSave !== ActionOnSave.none) {
          actionOnSave = ActionOnSave.none
          notification.display("auto-repeat OFF")
        }
      } else {
        throw e
      }
    }
  }
  return runAndCatch.bind(null, f)
}
