import * as mariadb from 'mariadb';
import { CategoryTable, StatementTable } from './Table';



export class DB {
  
  pool: mariadb.Pool;

  constructor() {
    this.init();
  }
  async   init() {
    const conn = await this.connection;

    await conn.query("CREATE TABLE IF NOT EXISTS `Category` (      `id` int(10) NOT NULL auto_increment,      `title` varchar(255),      `keys` varchar(255),      PRIMARY KEY( `id` )    );")
    await conn.query("CREATE TABLE IF NOT EXISTS `Statement` (      `id` int(10) NOT NULL auto_increment,      `title` varchar(255),      `keys` varchar(255),`categoriesId` varchar(255),      PRIMARY KEY( `id` )    );")
  }


  async query(sql: string, values: string[]): Promise<any> {
    return (await this.connection).query(sql, values)
  }


  insert(tableName: string, object: any): Promise<any> {
    const keys = Object.keys(object)
    return this.query('INSERT INTO ' + tableName + ' (' + keys.map(k => `\`${k}\``).join(', ') + ') value (' + (new Array(keys.length).fill('?').join(', ')) + ')', Object.values(object))
  }
  findWhere(tableName: string, query: string, values: string[]): Promise<[any]> {
    return this.query('SELECT * FROM ' + tableName + ' where ' + query, values);
  }
  deleteRow(tableName:string, query:string, values:string[]):Promise<any>{
    return this.query('DELETE FROM '+tableName+' where '+query, values)
  }
  updateRow(tableName: string, query: string, values: string[], object: object) {
    const keys = Object.keys(object)
    return this.query('UPDATE ' + tableName + ' SET ' + keys.map(k => `\`${k}='?'\``).join(', ')+';' , Object.values(object))

  }

  private get connection(): Promise<mariadb.Connection> {
    return mariadb.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '0812',
      database: 'vanilin',
      
    });
  }

}

const db = new DB();

export const tables = {
  categoryTable: new CategoryTable(db),
  statementTable: new StatementTable(db)
};