#!/usr/bin/env node

import fetch from 'node-fetch';
const API_KEY = '';
const KEYWORD = '';

// http://webservice.recruit.co.jp/hotpepper/gourmet/v1/
const URL = 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=' + API_KEY + '&keyword=' + encodeURIComponent(KEYWORD) + '&format=json';
// console.log(URL);

async function main() {
  try {
    const res = await fetch(URL);
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

main();
