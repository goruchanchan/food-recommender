# hot-food-recommender

Recommend a restaurant on Hot Pepper in Japan.

## install

```bash
npm install -g hot-food-recommender
```

## advance preparation

* Get Hot Pepper API key [link](https://webservice.recruit.co.jp/index.html)

If you want to use latest City Name in Japan, get RESAS-API key.

* (Option)Get RESAS-API key [link](https://opendata.resas-portal.go.jp/)

## usage

### random recommend

1. run hot-food-recommender

    ```zsh
    % hot-food-recommender --hot-key <Hot Pepper API key>
    ```

2. input city name
3. pick genre (use space-key for picking genre)

![image.png](https://www.evernote.com/shard/s400/sh/8e1d59a1-885c-4182-8798-629c4f76a321/kUtyphcuVVjbj0eV7fx-QstY_lx05D5nPZnegCbIRAgdXOJol1rGaCgyTA/deep/0/image.png)

if you want to use latest city name in Japan, set `key2` option:

```zsh
% hot-food-recommender --hot-key <Hot Pepper API key> --resas-key <RESAS-API key>
```

### pick list

1. run hot-food-recommender with `l` option.

    ```zsh
    % hot-food-recommender --hot-key <Hot Pepper API key> -l
    ```

2. input city name
3. pick genre (use space-key for picking genre)
4. select shop

![image.png](https://www.evernote.com/shard/s400/sh/01380d06-e9c2-4ad0-aaa9-b8a22ec95028/Y8WdKrfgmGVr4Q0s_LSvqhAh_qo2WG3Tyr40j27W35qRa0RCMOLyYiv0hw/deep/0/image.png)

## authority

* Powered by [ホットペッパー Webサービス](http://webservice.recruit.co.jp/)
* 出典：RESAS（地域経済分析システム）
