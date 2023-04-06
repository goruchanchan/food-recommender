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
    % hot-food-recommender --hot_key <Hot Pepper API key>
    ```

2. input city name
3. pick genre (use space-key for picking genre)

![image.png](https://www.evernote.com/shard/s400/sh/3d5a1d05-e0d3-40c4-b2ce-2a8ca6bd0064/QdTpFcMIfhpmS12j63Z4qfQKM7YV4rEHIAbCHC_o-qm-u8yuGGR5XK4psg/deep/0/image.png)

if you want to use latest city name in Japan, set `resas_key` option:

```zsh
% hot-food-recommender --hot_key <Hot Pepper API key> --resas_key <RESAS-API key>
```

### pick list

1. run hot-food-recommender with `l` option.

    ```zsh
    % hot-food-recommender --hot_key <Hot Pepper API key> -l
    ```

2. input city name
3. select genre (use enter-key for selecting genre)
4. select shop (use enter-key for selecting shop)

![image.png](https://www.evernote.com/shard/s400/sh/715ec08e-9853-4387-b266-8b774f9525d4/d9M9n5I7moS00x1LIF5STxa5s5N8OP87amRjLh4zYt9Pip7EA5zCy7iyRQ/deep/0/image.png)

## authority

* Powered by [ホットペッパー Webサービス](http://webservice.recruit.co.jp/)
* 出典：RESAS（地域経済分析システム）
