# tnumajiri

[![X](https://img.shields.io/badge/X-@rimuruafi-000000?style=flat&logo=x&logoColor=white)](https://x.com/rimuruafi)
[![GitHub followers](https://img.shields.io/github/followers/tnumajiri?style=flat&logo=github&label=Follow)](https://github.com/tnumajiri)

### About

- Building things with code.
- Find me on [X (@rimuruafi)](https://x.com/rimuruafi).

### Stats

![tnumajiri's GitHub stats](https://github-readme-stats.vercel.app/api?username=tnumajiri&show_icons=true&hide_border=true)

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=tnumajiri&layout=compact&hide_border=true)

---

## SUPER MARIO CLONE FC

ファミコン版スーパーマリオブラザーズ1風のクローンゲームです。
HTML5 Canvas 製で、グラフィック・効果音・BGMはすべてコードで自作しています(任天堂のアセットは未使用)。

### 遊び方

`index.html` をブラウザで開くだけで遊べます。ローカルサーバーを使う場合:

```sh
npx serve .
# または
python3 -m http.server 8000
```

### 操作方法

| キー | 操作 |
| --- | --- |
| ← → | 移動 |
| Z / Space | ジャンプ(長押しで大ジャンプ) |
| X / Shift | ダッシュ・ファイアボール |
| Enter | スタート |
| M | サウンド ON/OFF |

### 主な機能

- 256×240 のファミコン解像度・60FPS固定ステップの物理(慣性・可変ジャンプ)
- ?ブロック・レンガ(大きい時は破壊可)・キノコ・ファイアフラワー
- クリボー風・ノコノコ風の敵(踏みつけ・甲羅キック)
- 旗ポール・ゴール演出・タイム・コイン・残機・1UP
- WebAudio によるオリジナルチップチューンBGMと効果音

### テスト

```sh
node test/sim.js     # ヘッドレスでゲームを実際に動かすスモークテスト
node test/render.js  # ソフトウェアレンダラでスクリーンショットを生成
```
