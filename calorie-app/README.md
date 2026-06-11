# 🥗 カロリー手帳

写真を撮るだけ・レシピURLを貼るだけで、AIが自動でカロリーと栄養成分(PFC)を計算してくれるカロリー記録アプリです。

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Claude API](https://img.shields.io/badge/Claude%20API-Opus%204.8-D97757)

## ✨ 機能

- **📷 写真でカロリー計算** — コンビニ商品・自炊・外食の写真を撮るだけで、AIが品目ごとにカロリーとPFC(たんぱく質・脂質・炭水化物)を推定
- **🔗 レシピURLでカロリー計算** — クックパッド・クラシル・YouTubeなどのレシピを再現したら、URLを貼るだけで1人前あたりのカロリーを自動計算
- **✏️ 手入力** — 栄養成分表示がわかっている場合はそのまま入力
- **🎯 目標と収支** — 1日の目標摂取カロリーに対する収支を自動計算。性別・年齢・身長・体重・活動量から目標カロリーの自動計算(Mifflin-St Jeor式)にも対応
- **📊 週間チャート** — 直近7日間の摂取量と収支をひと目で確認
- **解析結果は編集可能** — AIの推定値を確認・修正してから記録できる

データはブラウザの localStorage に保存されるため、サーバー側に個人データは残りません。

## 🚀 セットアップ

```bash
cd calorie-app
npm install

# Claude APIキーを設定(https://platform.claude.com で取得)
cp .env.example .env
# .env を編集して ANTHROPIC_API_KEY を設定

npm start
```

ブラウザで http://localhost:3000 を開きます。スマートフォンからは同一ネットワーク内のPCのIPアドレスでアクセスするとカメラ撮影が使えます。

## ☁️ Render にデプロイ(スマホからいつでも使う)

リポジトリ直下の `render.yaml` で [Render](https://render.com) の無料プランにデプロイできます。

1. [render.com](https://render.com) でアカウント作成(GitHub連携でログイン)
2. ダッシュボードで **New → Blueprint** を選択
3. このリポジトリ(`tnumajiri/tnumajiri`)を接続し、ブランチを選択
4. `ANTHROPIC_API_KEY` の入力を求められるので、自分のAPIキーを貼り付け
5. **Apply** を押すと数分でデプロイ完了。発行された `https://karori-techo-xxxx.onrender.com` のURLをスマホのホーム画面に追加すれば、アプリのように使えます

> 💡 無料プランは15分間アクセスがないとスリープし、次のアクセス時の起動に1分ほどかかります。記録データは端末のブラウザに保存されるため、サーバーがスリープしても消えません。

## 🏗 構成

```
calorie-app/
├── server.js          # Express サーバー + Claude API 連携(写真解析・レシピ解析)
├── public/
│   ├── index.html     # UI
│   ├── style.css      # デザイン
│   └── app.js         # フロントエンドロジック(localStorage 管理)
└── package.json
```

- 解析には Claude Opus 4.8 の vision + structured outputs を使用
- APIキーはサーバー側にのみ保持され、ブラウザには渡りません
- レシピ解析はページの JSON-LD(Recipe 構造化データ)・meta タグ・本文を抽出して解析します
