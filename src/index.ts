import keyboard from './keyboard'
import player from './lib/Audio/player';
import { DB } from './lib/DB';
import { Server } from './server';
import { Category } from './structs/Category';
import { CategoryTable, StatementTable } from './lib/DB/Table';

const server = new Server();
server.listen();


class Application {

  currentCategory: Category;
  caps: boolean = false;
  hoard: boolean = false;
  bank: number[] = [];
  categoryTable: CategoryTable;
  statementTable: StatementTable;

  constructor() {

    const db = new DB;
    this.categoryTable = new CategoryTable(db);
    this.statementTable = new StatementTable(db);
    keyboard.on('key', (key, date) => this.onKey(key, date));

    keyboard.on('connected', () => {
      console.log('connected');
      player.playNote('c')
    })
    keyboard.on('pageup', () => {
      if (this.currentCategory == null) return;
      player.playNote('a')

      this.resetCategory()
    })

  }

  main() {

  }
  async onKey(key: string, date: Date) {
    if (this.currentCategory == null) {
      const category = await this.categoryTable.getCategoryByKey(key);
      if (category == null) {
        player.playNote('error')
      } else {
        this.currentCategory = category;
        player.playNote('ab')
      }
    } else {
      const statement = await this.statementTable.getStatementByKey(key, this.currentCategory.id);
      if (statement == null) {
        player.playNote('error')

      } else {
        this.bank.push(statement.id);
        if (!this.hoard) this.speak();
      }
      this.resetCategory();

    }
  }
  resetCategory() {
    this.currentCategory = null
  }
  async speak() {
    for (let id of this.bank) {
      await player.playById(id);
      this.bank = [];
    }
  }

}


(new Application).main();