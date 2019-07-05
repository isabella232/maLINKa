import { exec, spawn } from "child_process";
import { ROOT, SYSTEM_ROOT } from "./fetcher";
import { homedir } from "os";
import caps from "../Caps";
import { Statement } from "../../structs/Statement";

import { SystemStatement } from './System'

const PIANO = homedir() + '/piano/'

class Player {
  private process: import("child_process").ChildProcess;

  playStatement(statement: Statement): Promise<void> {
    return this.playFile(ROOT + statement.id + (statement.isMultivalued ? caps.switched ? 'u' : 'd' : '') + '.wav')
  }

  playNote(note: string): Promise<void> {
    return this.playFile(PIANO + note + '.wav')
  }
  playSystem(statement: SystemStatement): Promise<void> {
    return this.playFile(SYSTEM_ROOT + statement.code + '.wav')
  }

  playFile(path: string): Promise<void> {
    this.stop();
    return new Promise((resolve, reject) => {
      this.process = spawn("aplay", [/*"-D", "bluealsa",*/ path])
      this.process.on("exit", (code) => {
        if (code === 0) resolve();
        this.process = null

      })
      this.process.on('error', reject)
    })
  }
  stop() {
    if (this.process) {
      this.process.stdin.write('\x03')
      this.process.kill()
      this.process = null

    }
  }
}

export default new Player