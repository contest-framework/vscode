"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.commands = commands
const assertNoDiff = require("assert-no-diff")
function commands(action) {
  const documented = documentedCommands(action.region)
  const exported = exportedCommands()
  assertNoDiff.json(documented, exported)
}
function exportedCommands() {
  const config = require("../package.json")
  const result = []
  const commandRE = /^contest-vscode\./
  const titleRE = /^Contest: /
  for (const command of config.contributes.commands) {
    result.push(`${command.command.replace(commandRE, "")}: ${command.title.replace(titleRE, "")}`)
  }
  return result
}
function documentedCommands(nodes) {
  const result = []
  for (const node of nodes.nodesOfTypes("tr_open")) {
    const row = nodes.nodesFor(node)
    const cells = row.nodesOfTypes("td_open")
    if (cells.length === 0) {
      continue
    }
    if (cells.length !== 2) {
      throw new Error(`Row with unexpected length: ${cells}`)
    }
    const command = row.nodesFor(cells[0]).text()
    const desc = row.nodesFor(cells[1]).text()
    result.push(`${command}: ${desc}`)
  }
  return result
}
//# sourceMappingURL=commands.js.map
