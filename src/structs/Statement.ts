import { Item } from "./Item";



const EXP = /\[(.*?)\/(.*?)\]/g;

export class Statement extends Item {
  categoriesId: Number[]
  constructor(id: Number, title: String, keys: String[], categoriesId: Number[]) {
    super({ id, title, keys });
    this.categoriesId = categoriesId
  }

  get isMultivalued(): boolean {
    return this.title.match(EXP) != undefined;
  }


  get textUp(): string {
    return this.title.replace(EXP, '$1')
  }
  get textDown(): string {
    return this.title.replace(EXP, '$2')
  }
}