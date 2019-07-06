import { Router } from "express";
import { tables } from '../lib/DB'
import { StatementTable, CategoryTable } from "../lib/DB/Table";

const { statementTable, categoryTable } = tables;


export class API {
  router: Router;
  constructor() {
    this.router = Router();
    this.router.get('/categories', this.sendAllRows(categoryTable.tableName))
    this.router.get('/statements', this.sendAllRows(statementTable.tableName))
  }


  sendAllRows(table: string): import("express-serve-static-core").RequestHandler {
    return async (req, res) => {
      try {

        const rows = await (table == statementTable.tableName ? statementTable.getAllStatements() : categoryTable.getAllCategories());

        res.send(rows);

      } catch (error) {
        res.status(500).send({ error: error.message })
      }
    }
  }
}