import Enquirer from "enquirer";
import got from "got";

export default class Shop {
  constructor(key, place) {
    this.url = `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${key}&address=${encodeURIComponent(
      place
    )}&format=json&count=100`;
  }

  async loadShop() {
    await this.fetchShop();
    await this.extractGenre();
    await this.selectGenre();
    await this.extractShop();
  }

  async fetchShop() {
    const data = await got({ url: this.url });
    this.shops = JSON.parse(data.body).results.shop;
  }

  async extractGenre() {
    this.genres = Array.from(
      new Set(this.shops.map((shop) => shop.genre.name))
    );
  }

  async selectGenre() {
    const prompt = new Enquirer.MultiSelect({
      name: "value",
      message: "ジャンルは？",
      choices: this.genres,
    });
    await prompt.run();
    this.selectedGenre = prompt.value;
  }

  async extractShop() {
    this.genreShops = this.shops.filter((shop) =>
      this.selectedGenre.includes(shop.genre.name)
    );
  }

  async random() {
    const index = Math.floor(
      Math.random() * Math.floor(this.genreShops.length)
    );
    this.selectedShop = this.genreShops[index];
  }

  async list() {
    this.sortShop();
    this.selectedShop = await this.selectShop();
  }

  sortShop() {
    this.genreShops = this.genreShops.sort((a, b) =>
      a.genre.name > b.genre.name ? 1 : -1
    );
  }

  async selectShop() {
    const prompt = new Enquirer.Select({
      name: "shop",
      message: "ピンときた店は？",
      choices: this.makeShopChoices(),
    });

    await prompt.run();
    return this.genreShops.find((shop) => shop.id === prompt.value);
  }

  makeShopChoices() {
    const maxLength = this.countMaxLength(this.genreShops);

    return this.genreShops.map((shop) => ({
      name: shop.id,
      message: `${shop.genre.name.padStart(maxLength["genre"], "　")} ${
        shop.name
      } : ${shop.catch}`,
    }));
  }

  countMaxLength(object) {
    let length = { genre: 0, name: 0 };
    object.forEach((shop) => {
      if (length["genre"] < shop.genre.name.length)
        length["genre"] = shop.genre.name.length;
    });
    return length;
  }

  viewShop() {
    this.viewConsole("店名　　 : ", this.selectedShop.name);
    this.viewConsole("ヒトコト : ", this.selectedShop.catch);
    this.viewConsole("住所　　 : ", this.selectedShop.address);
    this.viewConsole("サイト　 : ", this.selectedShop.urls.pc);
  }

  viewConsole(title, message) {
    if (message.length > 0) console.log(title + message);
  }
}
