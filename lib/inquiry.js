import got from "got";
import readline from "readline";

export default class Inquiry {
  async fetch(url, key = "") {
    process.stdout.write(
      `データ取得中。しばらくお待ちください`
    );

    const data = await got({
      url: url,
      headers: { "X-API-KEY": key },
    });

    readline.clearLine(process.stdout);
    readline.cursorTo(process.stdout, 0);

    return data.body;
  }
}
