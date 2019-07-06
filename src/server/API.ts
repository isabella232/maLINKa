import { Router } from "express";
import { tables } from '../lib/DB'
import { StatementTable, CategoryTable } from "../lib/DB/Table";

const { statementTable, categoryTable } = tables;


export class API {
  router: Router;
  constructor() {
    this.router = Router();
    this.router.get('/categories', this.sendRows(categoryTable.tableName))
    this.router.get('/statements', this.sendRows(statementTable.tableName))
  }


  sendRows(table: string): import("express-serve-static-core").RequestHandler {
    return async (req, res) => {
      try {
        let rows;
        if (table === categoryTable.tableName) {
          rows = await categoryTable.getAllCategories()
        } else {
          if (req.query.by != null){
            rows = await statementTable.getStatementsByCategory(parseInt(req.query.by))
          } else{
            rows = await statementTable.getAllStatements();
          }
        }
        res.send(rows)

      } catch (error) {
        res.status(500).send({ error: error.message })
      }
    }
  }
}