import minimist from "minimist";

export default class Input {
  constructor() {
    this.option = minimist(process.argv.slice(2));
  }
  getShopKey() {
    return this.option.hot_key;
  }
  getPlaceKey() {
    return this.option.resas_key;
  }
  isList() {
    return this.option.l;
  }
}
