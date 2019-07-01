import { exec } from "child_process";


class Player {

  playFile(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec("aplay -D bluealsa " + path, (err, res) => {
        if (err) {
          reject(err)
          return;
        }
        resolve(res)
      })
    })
  }
}

export default new Player