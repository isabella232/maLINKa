import * as mariadb from 'mariadb';
import { Table } from './Tabe';
import { Category } from '../../structs/Category';
import { Statement } from '../../structs/Statement';
import { Item } from '../../structs/Item';



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


  async query(sql: string, values: string[]):Promise<any> {
    return (await this.connection).query(sql, values)
  }


  insert(tableName: string, object:any):Promise<any> {
    const keys = Object.keys(object)
    return this.query('INSERT INTO '+tableName+' ('+keys.map(k=>`'${k}'`).join(', ')+') value ('+(new Array(keys.length).fill('?'))+')', Object.values(object))
  }
  findWhere(tableName: string, query: string, values: string[]): Promise<[any]> {
    return this.query('SELECT * FROM '+tableName+' where '+query, values);
  }
  private get connection(): Promise<mariadb.PoolConnection> {
    return this.pool.getConnection();
  }

}

const db = new DB();

export const tables = {
  categoriesTable: new Table<Category>(db, Category),
  statementsTable: new Table<Statement>(db, Statement)
};