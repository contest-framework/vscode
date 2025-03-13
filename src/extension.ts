import * as vscode from "vscode"

import * as notification from "./notification"
import * as pipe from "./pipe"
import { UserError } from "./user_error"
import * as workspace from "./workspace"

/** the action that should happen when the user saves a file */
enum ActionOnSave {
  none,
  testCurrentFile,
  repeatLastTest
}

let actionOnSave: ActionOnSave = ActionOnSave.none
let lastTest: string | undefined = undefined

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("contest-vscode.test-all", wrapLogger(testAll)),
    vscode.commands.registerCommand("contest-vscode.test-file", wrapLogger(testFile)),
    vscode.commands.registerCommand("contest-vscode.test-file-on-save", wrapLogger(testFileOnSave)),
    vscode.commands.registerCommand("contest-vscode.test-file-line", wrapLogger(testFileLine)),
    vscode.commands.registerCommand("contest-vscode.test-file-line-on-save", wrapLogger(testFileLineOnSave)),
    vscode.commands.registerCommand("contest-vscode.repeat-test", wrapLogger(repeatTest)),
    vscode.commands.registerCommand("contest-vscode.stop-test", wrapLogger(stopTest)),
    vscode.commands.registerCommand("contest-vscode.auto-repeat", switchAutoRepeat),
    vscode.commands.registerCommand("contest-vscode.auto-test-current-file", switchAutoTestCurrentFile),
    vscode.commands.registerCommand("contest-vscode.quit", quitServer),
    vscode.workspace.onDidSaveTextDocument(documentSaved)
  )
}

function documentSaved() {
  switch (actionOnSave) {
    case ActionOnSave.none:
      break
    case ActionOnSave.repeatLastTest:
      wrapLogger(repeatTest)()
      break
    case ActionOnSave.testCurrentFile:
      wrapLogger(testFile)()
      break
  }
}

async function quitServer() {
  notification.display(`stopping the Contest server`)
  await pipe.send(`{ "command": "quit" }`)
}

async function repeatTest() {
  if (!lastTest) {
    notification.display("no test to repeat")
    return
  }
  notification.display("repeating the last test")
  await pipe.send(lastTest)
}

async function stopTest() {
  notification.display("stopping the current test")
  await pipe.send(`{ "command": "stopTest" }`)
}

function switchAutoRepeat() {
  if (actionOnSave === ActionOnSave.repeatLastTest) {
    actionOnSave = ActionOnSave.none
    notification.display("auto-repeat last test OFF")
  } else {
    actionOnSave = ActionOnSave.repeatLastTest
    notification.display("auto-repeat last test ON")
  }
}

function switchAutoTestCurrentFile() {
  if (actionOnSave === ActionOnSave.testCurrentFile) {
    actionOnSave = ActionOnSave.none
    notification.display("auto-test current file OFF")
  } else {
    actionOnSave = ActionOnSave.testCurrentFile
    notification.display("auto-test current file ON")
  }
}

async function testAll() {
  notification.display("testing all files")
  lastTest = `{ "command": "test-all" }`
  await pipe.send(lastTest)
}

async function testFile() {
  const relPath = workspace.currentFile()
  notification.display(`testing file ${relPath}`)
  lastTest = `{ "command": "test-file", "file": "${relPath}" }`
  await pipe.send(lastTest)
}

async function testFileLine() {
  const relPath = workspace.currentFile()
  const line = workspace.currentLine() + 1
  notification.display(`testing function at ${relPath}:${line}`)
  lastTest = `{ "command": "test-file-line", "file": "${relPath}", "line": ${line} }`
  await pipe.send(lastTest)
}

async function testFileLineOnSave() {
  actionOnSave = ActionOnSave.repeatLastTest
  const relPath = workspace.currentFile()
  const line = workspace.currentLine() + 1
  notification.display(`testing function at ${relPath}:${line} on save`)
  lastTest = `{ "command": "test-file-line", "file": "${relPath}", "line": ${line} }`
  await pipe.send(lastTest)
}

async function testFileOnSave() {
  actionOnSave = ActionOnSave.repeatLastTest
  const relPath = workspace.currentFile()
  notification.display(`testing file ${relPath} on save`)
  lastTest = `{ "command": "test-file", "file": "${relPath}" }`
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
          notification.display("auto-testing OFF")
        }
      } else {
        throw e
      }
    }
  }
  return runAndCatch.bind(null, f)
}
