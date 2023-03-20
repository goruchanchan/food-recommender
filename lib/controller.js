import Input from "../lib/input.js";
import Place from "../lib/place.js";
import Inquiry from "./inquiry.js";

export default class Controller {
  constructor() {
    this.input = new Input();
    this.place = new Place();
    this.inquiry = new Inquiry(this.input.getKey());
  }

  async run() {
    try {
      if(this.input.getKey()){
        const place = await this.place.pickPlace();
        if(this.input.isList()){
          await this.inquiry.listShop(place);
        }else if(this.input.isRandom()){
          await this.inquiry.randomShop(place);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
