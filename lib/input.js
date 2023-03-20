import minimist from "minimist";

export default class Input {
  constructor() {
    this.option = minimist(process.argv.slice(2));
  }
  getKey(){
    return this.option.k;
  }
  isList(){
    return this.option.l;
  }
  isRandom(){
    return this.option.r;
  }
}
