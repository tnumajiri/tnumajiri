# tnumajiri

[X (Twitter)](https://x.com/rimuruafi)

---

## 農薬検索アプリ

シンプルな HTML/JS で動作する農薬検索アプリです。`index.html` をブラウザで開くだけで動きます。

### 機能

- 農薬名・有効成分・登録番号でのインクリメンタル検索
- 対象作物による絞り込み
- 病害虫による絞り込み
- 一致した適用範囲（作物・病害虫・希釈倍数・使用方法）の表示

### 起動方法

```sh
# このディレクトリで簡易サーバを起動するだけ
python3 -m http.server 8000
# → http://localhost:8000/ をブラウザで開く
```

`file://` で直接開いても動作します（外部API・fetchは使っていません）。

### データについて

`data.js` のサンプルは [FAMIC 農薬登録情報提供システム](https://www.acis.famic.go.jp/) の
フィールド構成（登録番号・農薬の種類・名称・有効成分・適用作物・適用病害虫 など）
に合わせています。**実データではなく学習用のサンプル**なので、実際の防除に使う場合は
公式の最新登録情報・ラベルを必ず確認してください。

### 実データへの差し替え

`data.js` の `window.PESTICIDE_DATA` 配列を、以下の形式で差し替えてください。

```js
{
  registrationNo: "第XXXXX号",
  name: "農薬名",
  type: "殺虫剤 / 殺菌剤 / 除草剤 など",
  activeIngredient: "有効成分名 と 含有量(%)",
  manufacturer: "製造者",
  applications: [
    { crop: "作物名", pest: "病害虫名", dilution: "希釈倍数", usage: "使用方法" }
  ]
}
```

FAMIC からダウンロードしたCSVをこの形式に変換するスクリプトを書けば、
そのままアプリに取り込めます。
