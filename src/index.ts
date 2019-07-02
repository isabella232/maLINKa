import keyboard from './keyboard'
import player from './lib/Audio/player';
import {  DB } from './lib/DB';
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
    keyboard.on('key',(key, date)=> this.onKey(key,date));

    keyboard.on('connected', () => {
      console.log('connected');
      player.playNote('c')
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
        player.playNote('a')
      }
    } else {
      const statement = await this.statementTable.getStatementByKey(key, this.currentCategory.id);
      this.bank.push(statement.id);
      this.currentCategory=null;
      if (!this.hoard) this.speak();
    }
  }
  async speak() {
    for (let id of this.bank) {
      await player.playById(id);
      this.bank=[];
    }
  }

}


(new Application).main();