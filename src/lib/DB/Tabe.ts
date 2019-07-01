import { Item } from "../../structs/Item";
import {DB} from ".";

export class Table<T extends Item>{
  struct: typeof Item;
  db: DB;
  tableName: string; 

  constructor(db:DB, struct: typeof  Item){
    this.db =db ;
    this.struct = struct;
    this.tableName = struct.name;
  }

  async getAllRows():Promise<T[]>{
    const res =  await this.db.query('select * from `?` where 1', [this.tableName])
    console.log(res);
    
    return [];
  }
}