import * as tr from "text-runner"
import * as assertNoDiff from "assert-no-diff"
import * as fs from "fs"

export function commands(action: tr.actions.Args) {
  const documented = documentedCommands(action.region)
  const exported = exportedCommands()
  assertNoDiff.json(documented, exported)
}

function exportedCommands() {
  const config = JSON.parse(fs.readFileSync("../package.json", "utf-8"))
  const result = []
  const commandRE = /^contest-vscode\./
  const titleRE = /^Contest: /
  for (const command of config.contributes.commands) {
    const name = command.command.replace(commandRE, "")
    const title = command.title.replace(titleRE, "")
    result.push(`${name}: ${title}`)
  }
  return result
}

function documentedCommands(nodes: tr.ast.NodeList) {
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
