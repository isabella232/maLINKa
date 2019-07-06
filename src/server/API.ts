import { Router, NextFunction } from "express";
import { tables } from '../lib/DB'
import { StatementTable, CategoryTable } from "../lib/DB/Table";
import { Request, Response } from "express-serve-static-core";

const { statementTable, categoryTable } = tables;


export class API {
  router: Router;
  constructor() {
    this.router = Router();
    this.router.get('/categories', this.sendRows(categoryTable.tableName))
    this.router.get('/statements', this.sendRows(statementTable.tableName))
    this.router.post('/statement/create', this.createStatement)
    this.router.delete('/delete/:table/:id', this.delete)
    this.router.post('/update/:table/:id', this.update)
  }


  sendRows(table: string): import("express-serve-static-core").RequestHandler {
    return async (req, res, next) => {
      try {
        let rows;
        if (table === categoryTable.tableName) {
          rows = await categoryTable.getAllCategories()
        } else {
          if (req.query.by != null) {
            rows = await statementTable.getStatementsByCategory(parseInt(req.query.by))
          } else {
            rows = await statementTable.getAllStatements();
          }
        }
        res.send(rows)

      } catch (error) {
        next(error)
      }
    }
  }

  async createStatement(req: Request, res: Response, next: NextFunction) {
    try {
      const statement = await statementTable.createStatement(req.body.title, req.body.keys, req.body.categoriesId);
      res.send(statement)
    } catch (e) {
      next(e)
    }
  }

  async delete(req: Request, res: Response) {
    if (req.params.table == 'category') {
      await categoryTable.deleteRowById(req.params.id);
    } else if (req.params.table == 'statement') {
      await statementTable.deleteRowById(req.params.id)
    }
      res.send({status:'ok'})
  }
  async update(req: Request, res: Response) {
    if (req.params.table == 'category') {
      await categoryTable.updateRow( '`id`=?', [req.params.id], req.body);
    } else if (req.params.table == 'statement') {
      await statementTable.updateRow( '`id`=?', [req.params.id], req.body);
      
    }
      res.send({status:'ok'})
  }
  
}