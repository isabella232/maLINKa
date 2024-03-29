import { homedir } from "os";
import { tables } from "../DB";
import { promises, mkdirSync, createWriteStream } from "fs";
import { get } from "http";
import { SYSTEM_STATEMENTS } from "./System";
import player from "./player";

const { statementTable, categoryTable } = tables;
const { readFile, writeFile } = promises


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


  }
  download(title: string, id: Number | String, system: boolean = false): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {

      const path = (system ? SYSTEM_ROOT : ROOT) + id + '.wav';

      const metaPath = path + '.txt';
      try {
        const content = await readFile(metaPath, { encoding: 'UTF-8' })
        if (content === title) {
          console.log('not modified');
          return resolve()

        }
      } catch (error) {

      }

      await writeFile(metaPath, title);
      const file = createWriteStream(path);

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

  (new Fetcher).fetch().then(()=>{

    process.exit()
  })

}