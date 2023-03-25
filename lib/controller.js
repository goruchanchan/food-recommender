import Input from "./input.js";
import Place from "./place.js";
import Shop from "./shop.js";

export default class Controller {
  constructor() {
    this.input = new Input();
    this.place = new Place(this.input.getPlaceKey());
    this.shop = new Shop(this.input.getShopKey());
  }

  async run() {
    try {
      if (this.input.getShopKey()) {
        const place = await this.place.pickPlace();
        const shops = await this.shop.loadShop(place);

        if (this.input.isList()) {
          await this.shop.list(shops);
        } else if (this.input.isRandom()) {
          await this.shop.random(shops);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
