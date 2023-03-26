import Enquirer from "enquirer";
import got from "got";

export default class Shop {
  constructor(key) {
    this.url = `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${key}&format=json&count=100`;
    this.genre = [];
  }

  async loadShop(place) {
    const shops = await this.fetchShop(place);
    const genres = await this.extractGenre(shops);
    const selectedGenres = await this.selectGenre(genres);
    return await this.extractShop(shops, selectedGenres);
  }

  async fetchShop(place) {
    const url = `${this.url}&address=${encodeURIComponent(place)}`;
    const data = await got({ url: url });

    return JSON.parse(data.body).results.shop;
  }

  async extractGenre(shops) {
    return Array.from(new Set(shops.map((shop) => shop.genre.name)));
  }

  async extractShop(shops, selectedGenre) {
    return shops.filter((shop) => selectedGenre.includes(shop.genre.name));
  }

  async list(shops) {
    shops.sort((a, b) => {
      return a.genre.name > b.genre.name ? 1 : -1;
    });
    const id = await this.selectShop(shops);
    this.viewShop(shops.find((object) => object.id === id));
  }

  async random(shops) {
    const index = this.randomInt(0, shops.length);
    this.viewShop(shops[index]);
  }

  viewShop(shop) {
    if (shop.name !== undefined) console.log("店名 : " + shop.name);
    if (shop.catch !== undefined) console.log("PR : " + shop.catch);
    if (shop.address !== undefined) console.log("住所 : " + shop.address);
    if (shop.urls.pc !== undefined) console.log("URL : " + shop.urls.pc);
  }

  randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  async selectShop(selectedShop) {
    const prompt = new Enquirer.Select({
      name: "shop",
      message: "ピンときた店は？",
      choices: this.makeShopChoices(selectedShop),
    });

    await prompt.run();
    return prompt.value;
  }

  makeShopChoices(selectedShop) {
    const maxLength = this.countMaxLength(selectedShop);

    return selectedShop.map((shop) => ({
      name: shop.id,
      message: `${shop.genre.name.padStart(maxLength["genre"], "　")} ${
        shop.name
      } : ${shop.catch}`,
    }));
  }

  countMaxLength(object) {
    let length = { genre: 0, name: 0 };
    object.forEach((shop) => {
      if (length["genre"] < shop.genre.name.length) {
        length["genre"] = shop.genre.name.length;
      }
      if (length["name"] < shop.name.length) {
        length["name"] = shop.name.length;
      }
    });
    return length;
  }

  async selectGenre(genres) {
    const prompt = new Enquirer.MultiSelect({
      name: "value",
      message: "ジャンルは？",
      choices: genres,
    });
    await prompt.run();
    return prompt.value;
  }
}
