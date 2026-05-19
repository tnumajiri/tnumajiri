# tnumajiri

[X (Twitter)](https://x.com/rimuruafi)

---

## 🌱 農薬検索アプリ

公開URL: **https://tnumajiri.github.io/**

シンプルな HTML/JS で動作する農薬検索アプリです。

### 機能

- 農薬名・有効成分・登録番号でのインクリメンタル検索
- 対象作物・病害虫での絞り込み (ドロップダウン)
- 種類フィルタ (殺虫剤 / 殺菌剤 / 除草剤)
- よく使う検索の例ボタン (キャベツのコナガ、トマトの疫病 など)
- ヒットした適用範囲の行をハイライト表示

### 🌐 GitHub Pages の設定

1. **Settings → Pages** を開く
2. **Source**: `Deploy from a branch`
3. **Branch**: `claude/pesticide-search-app-liL6n` (or default branch after merge), Folder: `/ (root)`
4. **Save** → 数分待つと **https://tnumajiri.github.io/** で公開

### 💻 ローカルで起動する

```sh
python3 -m http.server 8000
# → http://localhost:8000/
```

`index.html` を `file://` で直接開いてもOK (外部API・fetch未使用)。

### データについて

`data.js` のサンプル (29件) は [FAMIC 農薬登録情報提供システム](https://www.acis.famic.go.jp/) の
フィールド構成 (登録番号・農薬の種類・名称・有効成分・適用作物・適用病害虫 など) に合わせています。
**実データではなく学習用のサンプル**なので、実際の防除には公式の最新登録情報・ラベルを必ず確認してください。

### 実データへの差し替え

`data.js` の `window.PESTICIDE_DATA` 配列を以下の形式で差し替えてください。

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
