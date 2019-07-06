import { homedir } from "os";
import { tables } from "../DB";
import { createWriteStream, mkdirSync } from "fs";
import { get } from "http";
import { SYSTEM_STATEMENTS } from "./System";
import player from "./player";

const { statementTable, categoryTable } = tables;


export const ROOT = homedir() + '/audio/'
export const SYSTEM_ROOT = homedir() + '/system_sounds/'

try {
  mkdirSync(ROOT)
} catch (error) { }
try {
  mkdirSync(SYSTEM_ROOT)

} catch (error) {

}

const URL = 'http://mac:8484?text='

export class Fetcher {

  async fetch() {
    player.playSystem(SYSTEM_STATEMENTS.START_FETCH)
    const statements = await statementTable.getAllStatements()

    for (const index in statements) {
      const statement = statements[index]
      if (statement.isMultivalued) {
        await this.download(statement.textUp.toString(), statement.id + "u")
        await this.download(statement.textDown.toString(), statement.id + "d")

      }
      else {
        await this.download(statement.title.toString(), statement.id)
      }
      console.log(`${+index + 1}/${statements.length} downloaded`);

    }
    console.log('fetch system');
    for (const index in SYSTEM_STATEMENTS) {
      if (SYSTEM_STATEMENTS.hasOwnProperty(index)) {
        const element = SYSTEM_STATEMENTS[index];
        await this.download(element.title.toString(), element.code, true)
        console.log(element.code + ' downloaded');

      }
      player.playSystem(SYSTEM_STATEMENTS.FINISH_FETCH)

    }

    process.exit()

  }
  download(title: string, id: Number | String, system: boolean = false): Promise<Buffer> {
    return new Promise((resolve, reject) => {

      const file = createWriteStream((system ? SYSTEM_ROOT : ROOT) + id + '.wav');
      const request = get(URL + encodeURI(title) + '&system=' + system, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve()  // close() is async, call cb after close completes.
        });
      }).on('error', (err) => { // Handle errors
        reject(err)
      });
    });
  }
}
if (module.parent == null) {

  (new Fetcher).fetch()
}