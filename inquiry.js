import fetch from 'node-fetch';
import minimist from "minimist";

class Inquiry{

  constructor(){
    this.option = minimist(process.argv.slice(2));
    console.log(this.option);
    const api_key = this.option.k;
    const address = this.option.a;
    this.url = 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=' + api_key + '&address=' + encodeURIComponent(address) + '&format=json';
    this.loadShopData();
  }

  async loadShopData() {
    try {
      const res = await fetch(this.url);
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      const data = await res.text();
      // console.log(data)
      const obj = JSON.parse(data)
  
      obj.results.shop.forEach(element => {
        console.log('店名:' +element.name)
        console.log('PR:' +element.catch)
        console.log('ジャンル:' +element.genre.name)
        console.log('住所:' +element.address)
        console.log('URL ' +element.urls.pc)
        console.log('--------------')
      });
    } catch (err) {
      console.error(err);
    }
  }

}

export default Inquiry;

