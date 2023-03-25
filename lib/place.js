import Enquirer from "enquirer";
import fs from "fs";
import readline from "readline";
import got from "got";

export default class Place {
  constructor(key) {
    this.key = key;
  }

  async pickPlace() {
    const towns = await this.selectType();

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
    return this.key ? this.fetchPlace() : this.loadPlace;
  }

  async loadPlace() {
    const fileStream = fs.createReadStream("data/city_name.txt");
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    let towns = [];
    for await (const town of rl) {
      towns.push(town);
    }
    return towns;
  }

  async fetchPlace() {
    process.stdout.write(
      `waiting ... 市町村データ取得中。しばらくお待ちください`
    );

    let url = "https://opendata.resas-portal.go.jp/api/v1/cities?prefCode=";
    let towns = [];
    for (let i = 1; i < 48; i++) {
      const data = await got({
        url: url + i,
        headers: { "X-API-KEY": this.key },
      });
      JSON.parse(data.body).result.map((item) => towns.push(item["cityName"]));
    }

    readline.clearLine(process.stdout);
    readline.cursorTo(process.stdout, 0);

    return towns;
  }
}
