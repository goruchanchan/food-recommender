import minimist from "minimist";

export default class Input {
  constructor() {
    this.option = minimist(process.argv.slice(2));
  }
  getShopKey(){
    return this.option.key;
  }
  getPlaceKey(){
    return this.option.key2;
  }
  isList(){
    return this.option.l;
  }
  isRandom(){
    return this.option.r;
  }
}
