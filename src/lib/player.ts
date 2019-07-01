import { exec, spawn } from "child_process";


class Player {
  private process: import("child_process").ChildProcess;

  playFile(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.process = spawn("aplay", ["-D bluealsa", path])
      this.process.on("exit", (code) => {
        if (code === 0) resolve();
        this.process = null

      })
      this.process.on('error', reject)
      this.process.stderr.pipe(process.stderr)
    })
  }
  stop() {
    if (this.process) {
      this.process.kill('SIGHUP')
      this.process = null

    }
  }
}

export default new Player