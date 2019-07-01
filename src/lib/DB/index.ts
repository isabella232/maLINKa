import * as mariadb from 'mariadb';
import { Table } from './Tabe';
import { Category } from '../../structs/Category';
import { Statement } from '../../structs/Statement';



export class DB {
  pool: mariadb.Pool;

  constructor() {
    this.pool = mariadb.createPool({
      host: '127.0.0.1',
      user: 'root',
      password: '0812',
      database: 'vanilin',
      connectionLimit: 5
    });
    this.init();
  }
  async   init() {
    const conn = await this.connection;

    await conn.query("CREATE TABLE IF NOT EXISTS `Category` (      `id` int(10) NOT NULL auto_increment,      `title` varchar(255),      `keys` varchar(255),      PRIMARY KEY( `id` )    );")
    await conn.query("CREATE TABLE IF NOT EXISTS `Statement` (      `id` int(10) NOT NULL auto_increment,      `title` varchar(255),      `keys` varchar(255),      PRIMARY KEY( `id` )    );")
  }


  async query(sql: string, values: string[]) {
    return (await this.connection).query(sql, values)
  }

  private get connection(): Promise<mariadb.PoolConnection> {
    return this.pool.getConnection();
  }

}

const db = new DB();

export const tables = {
  categoriesTable: new Table(db, Category),
  statementsTable: new Table(db, Statement)
};