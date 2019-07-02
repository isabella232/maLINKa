import { exec, spawn } from "child_process";
import { ROOT } from "./fetcher";
import { homedir } from "os";

const PIANO = homedir() + '/piano/'

class Player {
  private process: import("child_process").ChildProcess;

  playById(id: Number): Promise<void> {
    return this.playFile(ROOT + id + '.wav')
  }

  playNote(note: string): Promise<void> {
    return this.playFile(PIANO + note + '.wav')
  }

  playFile(path: string): Promise<void> {
    this.stop();
    return new Promise((resolve, reject) => {
      this.process = spawn("aplay", ["-D", "bluealsa", path])
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