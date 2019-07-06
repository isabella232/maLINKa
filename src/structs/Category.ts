import { Item } from "./Item";

export class Category extends Item {
  constructor(id: number, title: String, keys: String[]) {
    super({ id, title, keys });
  }
}


