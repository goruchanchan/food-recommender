import Enquirer from "enquirer";
import fs from "fs";
import readline from "readline";

export default class Place {
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

  async pickPlace() {
    const prompt = new Enquirer.AutoComplete({
      name: "shop",
      message: "どこに食べいく？",
      limit: 10,
      initial: 2,
      choices: await this.loadPlace(),
    });

    await prompt.run();
    return prompt.value;
  }
}
