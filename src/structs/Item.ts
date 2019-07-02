export abstract class Item {
  id: number;
  title: String;
  keys: String[];
  constructor(object: any) {
    this.id = object.id;
    this.title = object.title;
    this.keys = (typeof object.keys == "string") ? object.keys.split(',') : object.keys;
  }
}