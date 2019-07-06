import express, { Request, Response } from 'express';

import { API } from "./API";
import { NextFunction } from 'connect';
import bodyParser = require('body-parser');

const cd = process.cwd()

const api = new API();

export class Server {
  app: express.Application;
  constructor() {
    this.app = express();
    this.mountMiddleware();
    this.mountRoutes();
  }
  private mountMiddleware() {
    this.app.use(bodyParser());
    this.app.use('/', express.static(cd + '/public'))
  }
  private mountRoutes() {
    
    this.app.use('/', api.router);
    this.app.use((error:Error, req:Request, res:Response, next:NextFunction)=> {
      res.status(500).send({error})
    });
    }
  listen() {
    this.app.listen(3000)
  }
}