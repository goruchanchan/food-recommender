import Input from "./input.js";
import Place from "./place.js";
import Shop from "./shop.js";

export default class Controller {
  constructor() {
    this.input = new Input();
    this.place = new Place(this.input.getPlaceKey());
  }

  async run() {
    try {
      if (this.input.getShopKey()) {
        const place = await this.place.pickPlace();
        this.shop = new Shop(this.input.getShopKey(), place);
        await this.shop.loadShop(place);

        if (this.input.isList()) {
          await this.shop.list();
        } else {
          await this.shop.random();
        }
        this.shop.viewShop();
      }
    } catch (error) {
      console.error(error);
    }
  }
}
