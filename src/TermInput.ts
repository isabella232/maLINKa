import * as readline from 'readline';

import { tables } from './lib/DB'
import { Category } from './structs/Category';

const { statementTable, categoryTable } = tables;


class TermInput {
  private reader: readline.Interface
  currentCategory: Category;

  constructor() {
    this.reader = readline.createInterface(process.stdin, process.stdout);
    this.reader.setPrompt('>> ')
    this.reader.prompt(true)
    this.reader.on('line', async (line) => {
      this.reader.pause()
      await this.onLine(line)
      this.reader.resume()
    })
  }

  async onLine(line: string) {
    const [command, ...args] = line.split(/\s(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    if (command === 'cc') {
      const category = await categoryTable.createCategory(args[0], args[1].split(','))
      console.log('category %s created', category.title)
    } else if (command === 'sc') {
      if (args[0] == '') {
        this.currentCategory = null
        this.reader.setPrompt('>> ')
      } else {
        const category = await categoryTable.getCategoryByKey(args[0])
        if (category == null) {
          console.log('not found');
          return;
        }
        this.currentCategory = category;
        console.log('category %s selected', category.title)
        this.reader.setPrompt(category.title + '>> ')
      }

    }
    else if (command === 'cs') {
      if (this.currentCategory == null) {
        console.log('category doesn\'t selected');
        return
      }
      let [title, keys] = args;

      const statement = await statementTable.createStatement(title, keys.split(','), [this.currentCategory.id])
      console.log('statement %s created', statement.title)

    }
    else if (command === 'ls') {
      if (this.currentCategory == null) {
        const categories = await categoryTable.getAllCategories()
        for (const index in categories) {
          const category = categories[index];
          console.log(`${category.id}: ${category.keys.join(', ')}. ${category.title}`);
        }
        return
      }
      const statements = await statementTable.getStatementsByCategory(this.currentCategory.id)
      for (const index in statements) {
        const statement = statements[index]

        console.log(`${statement.id}: ${statement.keys.join(', ')}. ${statement.title}`);

      }

    } else if (command === 'rm') {
      if (this.currentCategory == null) {
        await categoryTable.deleteRowById(parseInt(args[0]))
      }
      else {
        await statementTable.deleteRowById(parseInt(args[0]))

      }
    } else if (command === 'mt') {
      if (this.currentCategory == null) {
        await categoryTable.updateTitle(parseInt(args[0]), args[1])
      } else {
        await statementTable.updateTitle(parseInt(args[0]), args[1])

      }

    } else if (command === 'mk') {
      if (this.currentCategory == null) {
        await categoryTable.updateKeys(parseInt(args[0]), args[1].split(','))
      } else {
        await statementTable.updateKeys(parseInt(args[0]), args[1].split(','))

      }
    } else {
      console.log('command doesn\'t found');

    }
    this.reader.prompt()

  }
}
new TermInput

export default TermInput;