# tnumajiri

[X (Twitter)](https://x.com/rimuruafi)

---

## 🌱 農薬検索アプリ (`/pesticide/`)

シンプルな HTML/JS で動作する農薬検索アプリです。

### 🌐 GitHub Pages で公開する

このリポジトリで GitHub Pages を有効にすれば、ブラウザから直接アクセスできます。

1. リポジトリの **Settings → Pages** を開く
2. **Source** を「Deploy from a branch」に設定
3. **Branch** を `main`（このブランチをマージ後）または `claude/pesticide-search-app-liL6n`、フォルダは `/ (root)` を選択
4. 数分待つと以下のURLでアクセス可能:

```
https://tnumajiri.github.io/pesticide/
```

> プロフィールREADMEは `https://github.com/tnumajiri` でこれまで通り表示されます (干渉しません)。

### 💻 ローカルで起動する

```sh
cd pesticide
python3 -m http.server 8000
# → http://localhost:8000/ をブラウザで開く
```

`pesticide/index.html` を `file://` で直接開いてもOK (外部API・fetch未使用)。

### 機能

- 農薬名・有効成分・登録番号でのインクリメンタル検索
- 対象作物・病害虫での絞り込み (ドロップダウン)
- 種類フィルタ (殺虫剤 / 殺菌剤 / 除草剤)
- よく使う検索の例ボタン (キャベツのコナガ、トマトの疫病 など)
- ヒットした適用範囲の行をハイライト表示

### データについて

`pesticide/data.js` のサンプル (29件) は [FAMIC 農薬登録情報提供システム](https://www.acis.famic.go.jp/) の
フィールド構成 (登録番号・農薬の種類・名称・有効成分・適用作物・適用病害虫 など) に合わせています。
**実データではなく学習用のサンプル**なので、実際の防除には公式の最新登録情報・ラベルを必ず確認してください。

### 実データへの差し替え

`pesticide/data.js` の `window.PESTICIDE_DATA` 配列を、以下の形式で差し替えてください。

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

FAMIC からダウンロードしたCSVをこの形式に変換すれば、そのままアプリに取り込めます。
