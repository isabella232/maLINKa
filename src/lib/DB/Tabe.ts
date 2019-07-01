import { Item } from "../../structs/Item";
import {DB} from ".";

export class Table{
  struct: typeof Item;
  db: DB;
  tableName: string;

  constructor(db:DB, struct: typeof  Item){
    this.db =db ;
    this.struct = struct;
    this.tableName = struct.name;
  }

  async getAllRows(){
    this.db.query('select * from `?` where 1', [this.tableName])
  }
}