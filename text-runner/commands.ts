import * as assertNoDiff from "assert-no-diff"
import * as fs from "fs"
import * as path from "path"
import * as tr from "text-runner"
import * as url from "url"
import * as extension from "../out/consts.js"

export function commands(action: tr.actions.Args) {
  const documented = documentedCommands(action.region)
  const exported = exportedCommands()
  assertNoDiff.json(documented, exported)
}

function exportedCommands() {
  const dirname = url.fileURLToPath(new URL(".", import.meta.url))
  const configPath = path.join(dirname, "..", "package.json")
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"))
  const result: string[] = []
  const titleRE = /^Contest: /
  for (const command of config.contributes.commands) {
    const title = command.title.replace(titleRE, "")
    result.push(title)
  }
  return result
}

function documentedCommands(nodes: tr.ast.NodeList) {
  const result: string[] = []
  for (const node of nodes.nodesOfTypes("tr_open")) {
    const row = nodes.nodesFor(node)
    const cells = row.nodesOfTypes("td_open")
    if (cells.length === 0) {
      continue
    }
    if (cells.length !== 2) {
      throw new Error(`Row with unexpected length: ${cells}`)
    }
    result.push(row.nodesFor(cells[0]).text())
    const descNodes = row.nodesFor(cells[1])
    if (descNodes.hasNodeOfType("anchor_open")) {
      const anchorNode = descNodes.nodeOfTypes("anchor_open")
      const anchorText = descNodes.nodesFor(anchorNode).text()
      const documentedDelay = Number(anchorText)
      if (documentedDelay !== extension.DOUBLE_SAVE_THRESHOLD_MS) {
        throw new Error(`documented ${documentedDelay} ms but its ${extension.DOUBLE_SAVE_THRESHOLD_MS} ms`)
      }
    }
  }
  return result
}
