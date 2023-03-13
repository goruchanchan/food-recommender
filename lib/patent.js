import fetch from "node-fetch";
import minimist from "minimist";
import fs from "fs";

export default class Patent {
  constructor() {
    this.option = minimist(process.argv.slice(2));
    // this.url = "https://opendata.resas-portal.go.jp/api/v1/cities?prefCode=";
    this.url =
      "https://opendata.resas-portal.go.jp/api/v1/industry/patent/list?year=2021&mode=1&prefCode=1&cityCode=-&patentHolderId=-&sort1=1&sort2=1&offset=0";
    this.loadShopData();
    this.city = [];
  }

  async loadShopData() {
    for (let i = 2017; i < 2018; i++) {
      try {
        const url = this.url;
        console.log(url);
        const res = await fetch(url, {
          headers: {
            "X-API-KEY": this.option.k,
          },
        });
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        }
        const data = await res.text();
        console.log(data);
        // this.patent = JSON.parse(data).result.map((item) => item["data"]);
        // console.log(this.patent);
        // this.patent.forEach((item) => {
        //   fs.appendFile("./data/patent.txt", item.patentName + "\n", (err, data) => {
        //     if (err) console.log(err);
        //   });
        // });
      } catch (err) {
        console.error("err");
      }
    }
  }
}
