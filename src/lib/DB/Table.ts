import { Item } from "../../structs/Item";
import { DB } from ".";
import { Category } from "../../structs/Category";
import { Statement } from "../../structs/Statement";



abstract class Table {

  db: DB;
  tableName: string;

  constructor(db: DB, tableName: string) {
    this.db = db;

    this.tableName = tableName;
  }

  protected async getAllRows(): Promise<Object[]> {
    const res = await this.db.query('select * from `' + this.tableName + '` where 1', [])

    return res
  }

  async createRow(object: Object): Promise<number> {
    const { insertId } = await this.db.insert(this.tableName, object)

    return insertId;
  }
}

export class CategoryTable extends Table {
  constructor(db: DB) {
    super(db, 'Category')
  }

  private parseRow(row: any): Category {
    return new Category(row.id, row.title, row.keys.split(','));
  }

  async createCategory(title: string, keys: string[]): Promise<Category> {
    const id = await this.createRow({ title, keys: keys.join(',') })

    return new Category(id, title, keys);
  }

  async getCategoryByKey(key: String): Promise<Category> {
    return (await this.getAllCategories())
      .find(category => {
        return category.keys.includes(key)
      })
  }


  async getAllCategories(): Promise<Category[]> {
    const rows = await this.getAllRows();
    return rows.map((row) => this.parseRow(row))
  }

}

export class StatementTable extends Table {


  constructor(db: DB) {
    super(db, 'Statement')
  }

  private parseRow(row: any): Statement {
    return new Statement(row.id, row.title, row.keys.split(','), row.categoriesId.split(',').map((s:string) => parseInt(s)));
  }

  async createStatement(title: String, keys: String[], categoriesId: Number[]): Promise<Statement> {
    const id = await this.createRow({ title, keys: keys.join(','), categoriesId: categoriesId.join(',') })

    return new Statement(id, title, keys, categoriesId);
  }

  async getStatementByKey(key: String, categoryId: number): Promise<Statement> {
    return (await this.getStatementsByCategory(categoryId))
      .find(statement => {
        return statement.keys.includes(key)
      })
  }

  async getStatementsByCategory(categoryId: Number): Promise<Statement[]> {
    return (await this.getAllStatements())
      .filter((statement): boolean => {
        return statement.categoriesId.includes(categoryId);
      })
  }

  async getAllStatements(): Promise<Statement[]> {
    const rows = await this.getAllRows();
    return rows.map((row) => this.parseRow(row))
  }

}
