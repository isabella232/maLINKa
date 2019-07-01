import { exec } from "child_process";


class Player {
  private process: import("child_process").ChildProcess;

  playFile(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.process = exec("aplay -D bluealsa " + path, (err, res) => {
        if (err) {
          reject(err)
          return;
        }
        resolve(res)
      })
    })
  }
  stop() {
    if (this.process) {
      this.process.kill("-9")
      this.process.kill('SIGINT')
      this.process = null

    }
  }
}

export default new Player