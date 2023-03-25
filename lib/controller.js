import Input from "./input.js";
import Place from "./place.js";
import Shop from "./shop.js";

export default class Controller {
  constructor() {
    this.input = new Input();
    this.place = new Place(this.input.getPlaceKey());
    this.inquiry = new Shop(this.input.getShopKey());
  }

  async run() {
    try {
      if (this.input.getShopKey()) {
        const place = await this.place.pickPlace();

        if (this.input.isList()) {
          await this.inquiry.listShop(place);
        } else if (this.input.isRandom()) {
          await this.inquiry.randomShop(place);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
