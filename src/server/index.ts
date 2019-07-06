import express from 'express';

import { API } from "./API";

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
    this.app.use('/', express.static(cd + '/public'))
  }
  private mountRoutes() {
    this.app.use('/', api.router);
  }
  listen() {
    this.app.listen(3000)
  }
}