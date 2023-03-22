import Enquirer from "enquirer";
import fs from "fs";
import readline from "readline";

export default class Place {
  constructor(key) {
    this.key = key;
  }

  async pickPlace() {
    const prompt = new Enquirer.AutoComplete({
      name: "shop",
      message: "どこに食べいく？",
      limit: 10,
      initial: 2,
      choices: await this.selectType(),
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
    let url = "https://opendata.resas-portal.go.jp/api/v1/cities?prefCode=";
    let towns = [];
    for (let i = 1; i < 48; i++) {
      const res = await fetch(url + i, {
        headers: { "X-API-KEY": this.key },
      });
      const data = await res.text();
      JSON.parse(data).result.map((item) => towns.push(item["cityName"]));
    }
    return towns;
  }
}
