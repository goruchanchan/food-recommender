import fetch from "node-fetch";
import minimist from "minimist";
import fs from "fs";

class City {
  constructor() {
    this.option = minimist(process.argv.slice(2));
    this.url = "https://opendata.resas-portal.go.jp/api/v1/cities?prefCode=";
    this.loadShopData();
    this.city = [];
  }

  async loadShopData() {
    for (let i = 1; i < 48; i++) {
      try {
        const url = this.url + i;
        const res = await fetch(url, {
          headers: {
            "X-API-KEY": this.option.k,
          },
        });
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        }
        const data = await res.text();
        this.city = JSON.parse(data).result.map((item) => item["cityName"]);
        this.city.forEach((item) => {
          fs.appendFile("./data/city_name.txt", item + "\n", (err, data) => {
            if (err) console.log(err);
          });
        });
      } catch (err) {
        console.error("err");
      }
    }
  }
}

export default City;
