import { exec, spawn } from "child_process";


class Player {
  private process: import("child_process").ChildProcess;

  playFile(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
     this.process = spawn("aplay -D bluealsa " + path);
     this.process.on('exit', (code)=>{
       resolve(this.process.stdout.read())
     });
     this.process.on('error', (err)=>{
       reject(err)
     })
    });
  }
  stop(){
    if(this.process){
      this.process.kill('SIGINT')
    }
  }
}

export default new Player