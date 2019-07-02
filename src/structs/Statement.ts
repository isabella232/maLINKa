import { Item } from "./Item";

export class Statement extends Item {
  categoriesId: Number[]
  constructor(id: Number, title: String, keys: String[], categoriesId: Number[]) {
    super({id, title, keys});
    this.categoriesId = categoriesId
  }
}