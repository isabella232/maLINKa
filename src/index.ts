import keyboard from './keyboard'
import player from './lib/Audio/player';
import { DB } from './lib/DB';
import { Server } from './server';
import { Category } from './structs/Category';
import { CategoryTable, StatementTable } from './lib/DB/Table';
import { Statement } from './structs/Statement';
import caps from './lib/Caps';

const server = new Server();
server.listen();


class Application {

  currentCategory: Category;
  hoard: boolean = false;
  bank: Statement[] = [];
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
    });

    keyboard.on('pagedown', () => {
      const val = caps.switched
      if (val) {
        caps.off()
        player.playNote('d')
      } else {
        caps.on()
        player.playNote('db')
      }
    })

    keyboard.on('tab', () => { this.randomChoose() })

    keyboard.on('space', () => {
      if (this.hoard) {
        this.hoard = false;
        this.bank = [];

      } else {
        this.hoard = true;
        player.playNote('b')

      }
    })
    keyboard.on('enter',()=>{
      this.speak()
      this.hoard=false;
    })
  }

  async randomChoose() {
    if (this.currentCategory == null) {
      player.playNote('error')
      return;
    }
    const statements = await this.statementTable.getStatementsByCategory(this.currentCategory.id)
    const statement = statements[Math.floor(Math.random() * statements.length)]
    this.print(statement)
    this.resetCategory()
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
      this.print(statement)
      this.resetCategory();

    }
  }
  print(statement: Statement) {
    if (statement == null) {
      player.playNote('error')
    } else {
      this.bank.push(statement);
      if (!this.hoard) {
        this.speak();

      } else {
        player.playNote('b')
      }
    }
  }
  resetCategory() {
    this.currentCategory = null
  }
  async speak() {
    for (let statement of this.bank) {
      await player.playStatement(statement);
      this.bank = [];
    }
  }

}


(new Application);