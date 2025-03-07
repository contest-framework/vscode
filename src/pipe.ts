import { promises as fs } from "fs"
import * as path from "path"
import { UserError } from "./user_error"
import * as workspace from "./workspace"
import * as notification from "./notification"

const PIPE_FILENAME = ".contest.tmp"

export async function send(text: string) {
  // get pipe file path
  const wsRoot = workspace.root()
  if (!wsRoot) {
    notification.display("No workspace found")
  }
  const pipePath = path.join(wsRoot, PIPE_FILENAME)
  // ensure pipe exists
  try {
    var stat = await fs.stat(pipePath)
  } catch (e: any) {
    if (e.code === "ENOENT") {
      notification.display("Please start the Contest server first")
    } else {
      notification.display(`Cannot read pipe: ${e}`)
    }
    return
  }
  // ensure is pipe
  if (!stat.isFIFO()) {
    notification.display(`The file ${pipePath} exists but is not a FIFO pipe.`)
    return
  }
  // write to pipe
  await fs.appendFile(pipePath, text, {
    flag: "a",
    encoding: "utf8"
  })
}
