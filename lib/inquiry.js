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
    this.input();
  }

  async input() {
    const prompt = new Enquirer.AutoComplete({
      name: "shop",
      message: "Pick place where you want to search eating house.",
      limit: 10,
      initial: 2,
      choices: await this.loadPlace(),
    });

    prompt
      .run()
      .then((answer) => this.loadShopData(answer))
      .catch(console.error);
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

  async loadShopData(answer) {
    try {
      const url = this.url + "&address=" + encodeURIComponent(answer);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      const data = await res.text();

      this.shop = JSON.parse(data).results.shop;

      this.shop.forEach((element) => {
        if (!this.genre.includes(element.genre.name)) {
          this.genre.push(element.genre.name);
        }
      });

      const foodType = await this.selectType();
      const selectedShop = this.shop.filter((shop) =>
        foodType.includes(shop.genre.name)
      );

      if (this.option.l) {
        selectedShop.sort((a, b) => {
          return a.genre.name > b.genre.name ? 1 : -1;
        });

        this.detailShop(selectedShop);

        // this.shop.forEach(element => {
        //   // console.log('店名:' +element.name);
        //   // console.log('PR:' +element.catch);
        //   // console.log('ジャンル:' +element.genre.name);
        //   // console.log('住所:' +element.address);
        //   // console.log('URL ' +element.urls.pc);
        //   // console.log('--------------');
        //   if (!this.genre.includes(element.genre.name)) {
        //     this.genre.push(element.genre.name);
        //   }
        // });
      }

      if (this.option.r) {
        const index = this.getRandomInt(0,selectedShop.length);
        const message = selectedShop[index].genre.name + " " + selectedShop[index].name + " : " + selectedShop[index].catch;
        console.log(message);
      }
    } catch (err) {
      console.error("err");
    }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  async detailShop(selectedShop) {
    // selectedShop.forEach((shop) => {
    //   console.log(shop.genre.name + " " + shop.name + " " + shop.catch);
    // });

    const prompt = new Enquirer.Select({
      name: "shop",
      message: "Pick shop where you want to go.",
      choices: this.makeShopChoices(selectedShop),
    });

    prompt
      .run()
      .then((answer) => console.log(answer))
      .catch(console.error);
  }

  makeShopChoices(selectedShop) {
    // console.log(selectedShop);

    // selectedShop.forEach(elm => {
    //   Object.keys(elm).forEach(key => {
    //     console.log(`key: ${key} value: ${elm[key]}`)
    //   })
    // })

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

    console.log(length);

    return length;
  }

  async selectType() {
    const prompt = new Enquirer.MultiSelect({
      name: "value",
      message: "what type you want to eat?",
      choices: this.genre,
    });

    try {
      await prompt.run();
      return prompt.value;
    } catch (error) {
      console.error(error);
    }
  }
}
