import { homedir } from "os";
import { tables } from "../DB";
import { createWriteStream } from "fs";
import { get } from "http";

const { statementTable, categoryTable } = tables;


export const ROOT = homedir() + '/audio/'
const URL = 'http://mac:8484?text='

class Fetcher {

  async fetch() {
    const statements = await statementTable.getAllStatements()

    for (const index in statements) {
      const statement = statements[index]
      if(statement.isMultivalued){
        await this.download(statement.textUp.toString(), statement.id+"u")
        await this.download(statement.textDown.toString(), statement.id+"d")

      }
      else{
      await this.download(statement.title.toString(), statement.id)
      }
      console.log(`${+index + 1}/${statements.length} downloaded`);

    }
    process.exit()

  }
  download(title: string, id: Number|String): Promise<Buffer> {
    return new Promise((resolve, reject) => {

      var file = createWriteStream(ROOT + id + '.wav');
      var request = get(URL + encodeURI(title), (response) => {
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