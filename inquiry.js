import fetch from 'node-fetch';
import minimist from "minimist";

class Inquiry{

  constructor(){
    this.option = minimist(process.argv.slice(2));
    this.url = 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=' + this.option.k + '&address=' + encodeURIComponent(this.option.a) + '&format=json' + '&count=100';
    this.genre = [];
    this.loadShopData();
  }

  async loadShopData() {
    try {
      const res = await fetch(this.url);
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      const data = await res.text();

      this.shop = JSON.parse(data).results.shop;
      this.shop.forEach(element => {
        if (!this.genre.includes(element.genre.name)) {
          this.genre.push(element.genre.name);
        }
      });
  
      // obj.results.shop.forEach(element => {
      //   console.log('店名:' +element.name);
      //   console.log('PR:' +element.catch);
      //   console.log('ジャンル:' +element.genre.name);
      //   console.log('住所:' +element.address);
      //   console.log('URL ' +element.urls.pc);
      //   console.log('--------------');
      //   if (!this.genre.includes(element.genre.name)) {
      //     this.genre.push(element.genre.name);
      //   }
      // });
    } catch (err) {
      console.error("err");
    }
  }

}

export default Inquiry;

