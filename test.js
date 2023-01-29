import fetch from 'node-fetch';

class Inquiry{

  constructor(api_key, keyword){
    this.api_key = api_key;
    this.keyword = keyword;
    this.url = 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=' + api_key + '&keyword=' + encodeURIComponent(keyword) + '&format=json';
    this.loadShopData();
  }

  async loadShopData() {
    try {
      const res = await fetch(this.url);
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      const data = await res.text();
      console.log(data)
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

