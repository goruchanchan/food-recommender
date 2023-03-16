import fetch from "node-fetch";
import minimist from "minimist";
import Enquirer from "enquirer";
import fs from "fs";
import readline from "readline";

export default class Inquiry {
  constructor() {
    this.option = minimist(process.argv.slice(2));
    this.url =
      "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=" +
      this.option.k +
      "&format=json" +
      "&count=100";
    this.genre = [];
  }

  async run() {
    try {
      const place = await this.pickPlace();
      const shops = await this.loadShopData(place);
      const genres = await this.extractGenre(shops);
      const selectedGenres = await this.selectGenre(genres);
      const selectedShops = await this.extractShop(shops, selectedGenres);
      this.execCommand(selectedShops);
    } catch(error) {
      console.error(error);
    }
  }

  async pickPlace() {
    const prompt = new Enquirer.AutoComplete({
      name: "shop",
      message: "Pick place where you want to search eating house.",
      limit: 10,
      initial: 2,
      choices: await this.loadPlace(),
    });

    await prompt.run();
    return prompt.value;
  }

  async loadPlace() {
    const fileStream = fs.createReadStream("data/city_name.txt");
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let cities = [];

    for await (const line of rl) {
      cities.push(line);
    }

    return cities;
  }

  async loadShopData(place) {
    const url = this.url + "&address=" + encodeURIComponent(place);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.text();
    return JSON.parse(data).results.shop;
  }

  async extractGenre(shops) {
    let genre = [];
    shops.forEach((element) => {
      if (!genre.includes(element.genre.name)) {
        genre.push(element.genre.name);
      }
    });
    return genre;
  }

  async extractShop(shops, selectedGenre) {
    return shops.filter((shop) => selectedGenre.includes(shop.genre.name));
  }

  async execCommand(selectedShop) {
    if (this.option.l) {
      selectedShop.sort((a, b) => {
        return a.genre.name > b.genre.name ? 1 : -1;
      });
      const id = await this.listShop(selectedShop);
      this.viewShop(selectedShop.find((object) => object.id === id));
    }

    if (this.option.r) {
      const index = this.getRandomInt(0, selectedShop.length);
      this.viewShop(selectedShop[index]);
    }
  }

  sortShop(shops) {
    shops.sort((a, b) => {
      return a.genre.name > b.genre.name ? 1 : -1;
    });
  }

  viewShop(shop) {
    if (shop.name !== undefined) console.log("店名 : " + shop.name);
    if (shop.catch !== undefined) console.log("PR : " + shop.catch);
    if (shop.address !== undefined) console.log("住所 : " + shop.address);
    if (shop.urls.pc !== undefined) console.log("URL : " + shop.urls.pc);
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  async listShop(selectedShop) {
    const prompt = new Enquirer.Select({
      name: "shop",
      message: "Pick shop where you want to go.",
      choices: this.makeShopChoices(selectedShop),
    });

    await prompt.run();
    return prompt.value;
  }

  makeShopChoices(selectedShop) {
    const maxLength = this.countMaxLength(selectedShop);

    return selectedShop.map((shop) => ({
      name: shop.id,
      message:
        shop.genre.name.padStart(maxLength["genre"], "　") +
        " " +
        shop.name +
        " : " +
        shop.catch,
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
      message: "what type you want to eat?",
      choices: genres,
    });
    await prompt.run();
    return prompt.value;
  }
}
