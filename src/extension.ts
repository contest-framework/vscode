import * as vscode from "vscode"
import * as pipe from "./pipe"
import * as notification from "./notification"
import * as workspace from "./workspace"
import { UserError } from "./user_error"

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("tertestrial-vscode.testAll", runSafe(testAll)),
    vscode.commands.registerCommand("tertestrial-vscode.testFile", runSafe(testFile)),
    vscode.commands.registerCommand("tertestrial-vscode.testFileLine", runSafe(testFileLine)),
    vscode.commands.registerCommand("tertestrial-vscode.repeatTest", runSafe(repeatTest)),
    vscode.commands.registerCommand("tertestrial-vscode.autoTest", runSafe(autoTest)),
    vscode.commands.registerCommand("tertestrial-vscode.stopTest", runSafe(stopTest)),
    vscode.commands.registerCommand("tertestrial-vscode.autoRepeat", switchAutoRepeat),
    vscode.commands.registerCommand("tertestrial-vscode.autoTestCurrentFile", switchAutoTestCurrentFile),
    vscode.workspace.onDidSaveTextDocument(documentSaved),
  )
}

async function testAll() {
  notification.display("testing all files")
  await pipe.send(`{ "command": "testAll" }`)
}

async function testFile() {
  const relPath = workspace.currentFile()
  notification.display(`testing file ${relPath}`)
  await pipe.send(`{ "command": "testFile", "file": "${relPath}" }`)
}

async function testFileLine() {
  const relPath = workspace.currentFile()
  const line = workspace.currentLine() + 1
  notification.display(`testing function at ${relPath}:${line}`)
  await pipe.send(`{ "command": "testFileLine", "file": "${relPath}", "line": ${line} }`)
}

async function repeatTest() {
  notification.display("repeating the last test")
  await pipe.send(`{ "command": "repeatTest" }`)
}

async function autoTest() {
  notification.display("auto-test the current file on save")
  await pipe.send(`{ "command": "autoTest" }`)
}

async function stopTest() {
  notification.display("stopping the current test")
  await pipe.send(`{ "command": "stopTest" }`)
}

function runSafe(f: () => Promise<void>): () => Promise<void> {
  const runAndCatch = async function (f: () => Promise<void>) {
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

/** which action should happen when the user saves a file */
enum ActionOnSave {
  none,
  testCurrentFile,
  repeatLastTest,
}

let actionOnSave: ActionOnSave = ActionOnSave.none

function switchAutoRepeat() {
  switch (actionOnSave) {
    case (ActionOnSave.none, ActionOnSave.testCurrentFile):
      actionOnSave = ActionOnSave.repeatLastTest
      notification.display("auto-repeat ON")
      break
    case ActionOnSave.repeatLastTest:
      actionOnSave = ActionOnSave.none
      notification.display("auto-repeat OFF")
      break
  }
}

function switchAutoTestCurrentFile() {
  switch (actionOnSave) {
    case (ActionOnSave.none, ActionOnSave.repeatLastTest):
      actionOnSave = ActionOnSave.testCurrentFile
      notification.display("auto-test current file ON")
      break
    case ActionOnSave.testCurrentFile:
      actionOnSave = ActionOnSave.none
      notification.display("auto-test current file OFF")
      break
  }
}

function documentSaved() {
  switch (actionOnSave) {
    case ActionOnSave.repeatLastTest:
      runSafe(repeatTest)()
      break
    case ActionOnSave.testCurrentFile:
      runSafe(testFile)
      break
    case ActionOnSave.none:
      break
  }
}
