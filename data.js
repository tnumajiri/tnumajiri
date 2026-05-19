// 農薬データ（サンプル）
// FAMIC「農薬登録情報提供システム」(https://www.acis.famic.go.jp/) のフィールド構成に基づく。
// 実データへの差し替えは README.md を参照。
window.PESTICIDE_DATA = [
  {
    registrationNo: "第18371号",
    name: "スミチオン乳剤",
    type: "殺虫剤",
    activeIngredient: "MEP (フェニトロチオン) 50.0%",
    manufacturer: "住友化学",
    applications: [
      { crop: "稲", pest: "ニカメイチュウ", dilution: "1000倍", usage: "散布" },
      { crop: "稲", pest: "ツマグロヨコバイ", dilution: "1000倍", usage: "散布" },
      { crop: "キャベツ", pest: "アオムシ", dilution: "1000倍", usage: "散布" },
      { crop: "りんご", pest: "シンクイムシ類", dilution: "1500倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第21458号",
    name: "アドマイヤー水和剤",
    type: "殺虫剤",
    activeIngredient: "イミダクロプリド 10.0%",
    manufacturer: "バイエル クロップサイエンス",
    applications: [
      { crop: "稲", pest: "ウンカ類", dilution: "2000倍", usage: "散布" },
      { crop: "キャベツ", pest: "アブラムシ類", dilution: "4000倍", usage: "散布" },
      { crop: "なす", pest: "コナジラミ類", dilution: "2000倍", usage: "散布" },
      { crop: "きゅうり", pest: "アザミウマ類", dilution: "2000倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第19234号",
    name: "ダコニール1000",
    type: "殺菌剤",
    activeIngredient: "TPN (クロロタロニル) 40.0%",
    manufacturer: "エス・ディー・エス バイオテック",
    applications: [
      { crop: "トマト", pest: "疫病", dilution: "1000倍", usage: "散布" },
      { crop: "トマト", pest: "葉かび病", dilution: "1000倍", usage: "散布" },
      { crop: "きゅうり", pest: "べと病", dilution: "1000倍", usage: "散布" },
      { crop: "ねぎ", pest: "さび病", dilution: "1000倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第22056号",
    name: "ラウンドアップマックスロード",
    type: "除草剤",
    activeIngredient: "グリホサートカリウム塩 48.0%",
    manufacturer: "日産化学",
    applications: [
      { crop: "果樹類", pest: "一年生雑草", dilution: "100倍", usage: "雑草茎葉散布" },
      { crop: "樹木等", pest: "多年生雑草", dilution: "50倍", usage: "雑草茎葉散布" },
      { crop: "畑作物", pest: "一年生雑草", dilution: "100倍", usage: "雑草茎葉散布" }
    ]
  },
  {
    registrationNo: "第20567号",
    name: "プレバソンフロアブル5",
    type: "殺虫剤",
    activeIngredient: "クロラントラニリプロール 5.0%",
    manufacturer: "デュポン",
    applications: [
      { crop: "キャベツ", pest: "コナガ", dilution: "2000倍", usage: "散布" },
      { crop: "キャベツ", pest: "アオムシ", dilution: "2000倍", usage: "散布" },
      { crop: "ブロッコリー", pest: "ヨトウムシ", dilution: "2000倍", usage: "散布" },
      { crop: "なす", pest: "オオタバコガ", dilution: "2000倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第17890号",
    name: "ボルドー水和剤",
    type: "殺菌剤",
    activeIngredient: "塩基性硫酸銅 58.0%",
    manufacturer: "クミアイ化学",
    applications: [
      { crop: "りんご", pest: "黒星病", dilution: "500倍", usage: "散布" },
      { crop: "ぶどう", pest: "べと病", dilution: "500倍", usage: "散布" },
      { crop: "なし", pest: "黒斑病", dilution: "500倍", usage: "散布" },
      { crop: "かんきつ", pest: "そうか病", dilution: "500倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第23012号",
    name: "アファーム乳剤",
    type: "殺虫剤",
    activeIngredient: "エマメクチン安息香酸塩 1.0%",
    manufacturer: "シンジェンタジャパン",
    applications: [
      { crop: "キャベツ", pest: "コナガ", dilution: "2000倍", usage: "散布" },
      { crop: "ねぎ", pest: "ネギアザミウマ", dilution: "1000倍", usage: "散布" },
      { crop: "なす", pest: "ハダニ類", dilution: "2000倍", usage: "散布" },
      { crop: "りんご", pest: "ハマキムシ類", dilution: "2000倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第18765号",
    name: "トップジンM水和剤",
    type: "殺菌剤",
    activeIngredient: "チオファネートメチル 70.0%",
    manufacturer: "日本曹達",
    applications: [
      { crop: "稲", pest: "いもち病", dilution: "1500倍", usage: "散布" },
      { crop: "りんご", pest: "うどんこ病", dilution: "1500倍", usage: "散布" },
      { crop: "いちご", pest: "灰色かび病", dilution: "1500倍", usage: "散布" },
      { crop: "トマト", pest: "葉かび病", dilution: "1500倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第21987号",
    name: "ベンレート水和剤",
    type: "殺菌剤",
    activeIngredient: "ベノミル 50.0%",
    manufacturer: "住友化学",
    applications: [
      { crop: "いちご", pest: "うどんこ病", dilution: "2000倍", usage: "散布" },
      { crop: "きゅうり", pest: "つる枯病", dilution: "2000倍", usage: "散布" },
      { crop: "なす", pest: "菌核病", dilution: "2000倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第24103号",
    name: "モスピラン顆粒水溶剤",
    type: "殺虫剤",
    activeIngredient: "アセタミプリド 20.0%",
    manufacturer: "日本曹達",
    applications: [
      { crop: "キャベツ", pest: "アブラムシ類", dilution: "4000倍", usage: "散布" },
      { crop: "なす", pest: "コナジラミ類", dilution: "2000倍", usage: "散布" },
      { crop: "りんご", pest: "シンクイムシ類", dilution: "4000倍", usage: "散布" },
      { crop: "茶", pest: "チャノミドリヒメヨコバイ", dilution: "4000倍", usage: "散布" }
    ]
  }
];
