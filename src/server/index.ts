import express from 'express';

const cd = process.cwd()

export class Server {
  app: express.Application;
  constructor() {
    this.app = express();
    this.mountMiddleware();
    this.mountRoutes();
  }
  private mountMiddleware() {
    this.app.use(cd + '/public')
  }
  private mountRoutes() {

  }
  listen() {
    this.app.listen(3000)
    }
  }