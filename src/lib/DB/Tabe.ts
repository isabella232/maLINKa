import { Item } from "../../structs/Item";
import {DB} from ".";
import { Category } from "../../structs/Category";
import { Statement } from "../../structs/Statement";

export class Table<T extends Item>{
  getAllCategories() :Promise<Category[]>{
    return  this.getAllRows()
  }
  createStatement(title: string, arg1: string[]) :Promise<Statement>{
    throw new Error("Method not implemented.");
  }
  async findByKey(key: string):Promise<Item> {
    const [row] = await this.db.findWhere(this.tableName, '`keys` LIKE \'?\'', [key]);
    if(!row) return null;
    return new this.struct(row.id, row.title, row.keys.split(','));
  }
  struct: typeof Item;
  db: DB;
  tableName: string; 

  constructor(db:DB, struct: typeof  Item){
    this.db =db ;
    this.struct = struct;
    this.tableName = struct.name;
  }

  async getAllRows():Promise<T[]>{
    const res =  await this.db.query('select * from `'+this.tableName+'` where 1', [])
    
    return res.map((row:any)=>{
      return new this.struct(row.id, row.title, row.keys);
    });
  }

  async createCategory(title: string, keys: string[]):Promise<Category> {
    const {insertId} = await this.db.insert(this.tableName, {title, keys:keys.join(',')})
    
    return new Category(insertId, title,  keys)
  }
}