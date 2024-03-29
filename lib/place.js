import Enquirer from "enquirer";
import readline from "readline";
import got from "got";
import { cityName } from "../data/cityName.js";

export default class Place {
  constructor(key) {
    this.key = key;
    this.url = "https://opendata.resas-portal.go.jp/api/v1/cities?prefCode=";
  }

  static prefectures = 47;

  async pick() {
    process.stdout.write(`データ取得中。しばらくお待ちください`);

    const towns = await this.selectType();

    readline.clearLine(process.stdout);
    readline.cursorTo(process.stdout, 0);

    const prompt = new Enquirer.AutoComplete({
      name: "shop",
      message: "どこに食べいく？",
      limit: 10,
      initial: 2,
      choices: towns,
    });

    await prompt.run();
    return prompt.value;
  }

  async selectType() {
    return this.key ? this.fetch() : this.fileLoad();
  }

  async fileLoad() {
    return cityName;
  }

  async fetch() {
    let places = [];
    for (let i = 0; i < Place.prefectures; i++) {
      const data = await got({
        url: this.url + (i + i),
        headers: { "X-API-KEY": this.key },
      });
      JSON.parse(data.body).result.map((item) => places.push(item["cityName"]));
    }
    return places;
  }
}
