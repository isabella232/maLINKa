import * as readline from 'readline';

import {tables} from './lib/DB'
import { Category } from './structs/Category';

const {statementsTable, categoriesTable} = tables;


class TermInput {
  private reader: readline.Interface
  currentCategory: Category;

  constructor() {
    this.reader = readline.createInterface(process.stdin, process.stdout);
    this.reader.setPrompt('>> ')
    this.reader.prompt(true)
    this.reader.on('line', (line) => this.onLine(line))
  }

  async onLine(line: string) {
    const [command, ...args] = line.split(/\s(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    if (command === 'cc') {
      const category = await categoriesTable.createCategory(args[0], args[1].split(','))
      console.log('category %s created', category.title)
    } else if (command === 'sc') {
      if (args[0] == '') {
        this.currentCategory = null
        this.reader.setPrompt(  '>> ')
      } else {
        const category = await categoriesTable.findByKey(args[0])
        if (category == null) {
          console.log('not found');
          return;
        }
        this.currentCategory = category;
        console.log('category %s selected', category.title)
        this.reader.setPrompt( category.title + '>> ')
      }

    }
    else if (command === 'cs') {
      if (this.currentCategory == null) {
        console.log('category doesn\'t selected');
        return
      }
      let [title, keys] = args;

      const statement = await statementsTable.createStatement(title, keys.split(','))
      console.log('statement %s created', statement.title)

    }
    else if (command === 'ls') {
      if (this.currentCategory == null) {
        const categories = await categoriesTable.getAllCategories()
        for (const index in categories) {
          const category = categories[index];
          console.log(`${index}: ${category.keys.join(', ')}. ${category.title}`);
        }
        return
      }
      // for (const index in this.currentCategory.statements) {
      //   const statement = new Statement(this.currentCategory.statements[index]);


      //   console.log(`${index}: ${statement.keys.join(', ')}. ${statement.textDown}`);

      // }

    } else if (command === 'rm') {
      if (this.currentCategory == null) {
      }
      else {

      }
    } else {
      console.log('command doesn\'t found');

    }
    this.reader.prompt()

  }
}
new TermInput

export default TermInput;