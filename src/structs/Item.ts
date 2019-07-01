export class Item {
  id: Number;
  title: String;
  keys: String[];
  constructor(id: Number, title: String, keys: String[]) {
    this.id = id;
    this.title = title;
    this.keys = keys;
  }
}