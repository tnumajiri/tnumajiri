// 農薬データ（学習用サンプル）
// FAMIC「農薬登録情報提供システム」(https://www.acis.famic.go.jp/) のフィールド構成に基づく。
// 実データではないため、実際の防除には公式の最新登録情報・ラベルを確認してください。
window.PESTICIDE_DATA = [
  // ===== 殺虫剤 =====
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
      { crop: "りんご", pest: "シンクイムシ類", dilution: "1500倍", usage: "散布" },
      { crop: "なす", pest: "アブラムシ類", dilution: "1000倍", usage: "散布" }
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
      { crop: "きゅうり", pest: "アザミウマ類", dilution: "2000倍", usage: "散布" },
      { crop: "トマト", pest: "コナジラミ類", dilution: "2000倍", usage: "散布" }
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
      { crop: "なす", pest: "オオタバコガ", dilution: "2000倍", usage: "散布" },
      { crop: "稲", pest: "イネツトムシ", dilution: "2000倍", usage: "散布" }
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
      { crop: "りんご", pest: "ハマキムシ類", dilution: "2000倍", usage: "散布" },
      { crop: "ピーマン", pest: "アザミウマ類", dilution: "1000倍", usage: "散布" }
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
      { crop: "茶", pest: "チャノミドリヒメヨコバイ", dilution: "4000倍", usage: "散布" },
      { crop: "きゅうり", pest: "アブラムシ類", dilution: "4000倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第22678号",
    name: "コテツフロアブル",
    type: "殺虫剤",
    activeIngredient: "クロルフェナピル 10.0%",
    manufacturer: "BASFジャパン",
    applications: [
      { crop: "キャベツ", pest: "コナガ", dilution: "2000倍", usage: "散布" },
      { crop: "なす", pest: "ハダニ類", dilution: "2000倍", usage: "散布" },
      { crop: "ピーマン", pest: "アザミウマ類", dilution: "2000倍", usage: "散布" },
      { crop: "いちご", pest: "ハダニ類", dilution: "2000倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第19876号",
    name: "オルトラン水和剤",
    type: "殺虫剤",
    activeIngredient: "アセフェート 50.0%",
    manufacturer: "アリスタライフサイエンス",
    applications: [
      { crop: "キャベツ", pest: "アオムシ", dilution: "1000倍", usage: "散布" },
      { crop: "稲", pest: "ニカメイチュウ", dilution: "1000倍", usage: "散布" },
      { crop: "なす", pest: "アブラムシ類", dilution: "1000倍", usage: "散布" },
      { crop: "茶", pest: "チャノミドリヒメヨコバイ", dilution: "1000倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第25431号",
    name: "ディアナSC",
    type: "殺虫剤",
    activeIngredient: "スピネトラム 11.7%",
    manufacturer: "ダウ・アグロサイエンス",
    applications: [
      { crop: "キャベツ", pest: "コナガ", dilution: "5000倍", usage: "散布" },
      { crop: "ねぎ", pest: "ネギアザミウマ", dilution: "2500倍", usage: "散布" },
      { crop: "ピーマン", pest: "アザミウマ類", dilution: "2500倍", usage: "散布" },
      { crop: "なす", pest: "オオタバコガ", dilution: "5000倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第26012号",
    name: "ベネビアOD",
    type: "殺虫剤",
    activeIngredient: "シアントラニリプロール 10.0%",
    manufacturer: "デュポン",
    applications: [
      { crop: "キャベツ", pest: "コナガ", dilution: "2000倍", usage: "散布" },
      { crop: "ブロッコリー", pest: "アオムシ", dilution: "2000倍", usage: "散布" },
      { crop: "トマト", pest: "コナジラミ類", dilution: "2000倍", usage: "散布" },
      { crop: "ねぎ", pest: "ネギアザミウマ", dilution: "2000倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第20156号",
    name: "コルト顆粒水和剤",
    type: "殺虫剤",
    activeIngredient: "ピリフルキナゾン 20.0%",
    manufacturer: "石原産業",
    applications: [
      { crop: "キャベツ", pest: "アブラムシ類", dilution: "4000倍", usage: "散布" },
      { crop: "なす", pest: "コナジラミ類", dilution: "2000倍", usage: "散布" },
      { crop: "りんご", pest: "アブラムシ類", dilution: "4000倍", usage: "散布" }
    ]
  },

  // ===== 殺菌剤 =====
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
      { crop: "ねぎ", pest: "さび病", dilution: "1000倍", usage: "散布" },
      { crop: "ばれいしょ", pest: "疫病", dilution: "1000倍", usage: "散布" }
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
    registrationNo: "第18765号",
    name: "トップジンM水和剤",
    type: "殺菌剤",
    activeIngredient: "チオファネートメチル 70.0%",
    manufacturer: "日本曹達",
    applications: [
      { crop: "稲", pest: "いもち病", dilution: "1500倍", usage: "散布" },
      { crop: "りんご", pest: "うどんこ病", dilution: "1500倍", usage: "散布" },
      { crop: "いちご", pest: "灰色かび病", dilution: "1500倍", usage: "散布" },
      { crop: "トマト", pest: "葉かび病", dilution: "1500倍", usage: "散布" },
      { crop: "なす", pest: "うどんこ病", dilution: "1500倍", usage: "散布" }
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
      { crop: "なす", pest: "菌核病", dilution: "2000倍", usage: "散布" },
      { crop: "ぶどう", pest: "灰色かび病", dilution: "2000倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第22341号",
    name: "アミスター20フロアブル",
    type: "殺菌剤",
    activeIngredient: "アゾキシストロビン 20.0%",
    manufacturer: "シンジェンタジャパン",
    applications: [
      { crop: "きゅうり", pest: "うどんこ病", dilution: "2000倍", usage: "散布" },
      { crop: "きゅうり", pest: "べと病", dilution: "2000倍", usage: "散布" },
      { crop: "トマト", pest: "葉かび病", dilution: "2000倍", usage: "散布" },
      { crop: "ねぎ", pest: "さび病", dilution: "2000倍", usage: "散布" },
      { crop: "ばれいしょ", pest: "疫病", dilution: "2000倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第23789号",
    name: "ストロビーフロアブル",
    type: "殺菌剤",
    activeIngredient: "クレソキシムメチル 50.0%",
    manufacturer: "BASFジャパン",
    applications: [
      { crop: "りんご", pest: "うどんこ病", dilution: "3000倍", usage: "散布" },
      { crop: "りんご", pest: "黒星病", dilution: "3000倍", usage: "散布" },
      { crop: "ぶどう", pest: "うどんこ病", dilution: "3000倍", usage: "散布" },
      { crop: "なし", pest: "黒星病", dilution: "3000倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第24567号",
    name: "ジマンダイセン水和剤",
    type: "殺菌剤",
    activeIngredient: "マンゼブ 75.0%",
    manufacturer: "ダウ・アグロサイエンス",
    applications: [
      { crop: "ばれいしょ", pest: "疫病", dilution: "400倍", usage: "散布" },
      { crop: "トマト", pest: "疫病", dilution: "600倍", usage: "散布" },
      { crop: "ぶどう", pest: "べと病", dilution: "600倍", usage: "散布" },
      { crop: "りんご", pest: "黒星病", dilution: "600倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第20987号",
    name: "ロブラール水和剤",
    type: "殺菌剤",
    activeIngredient: "イプロジオン 50.0%",
    manufacturer: "バイエル クロップサイエンス",
    applications: [
      { crop: "いちご", pest: "灰色かび病", dilution: "1000倍", usage: "散布" },
      { crop: "トマト", pest: "灰色かび病", dilution: "1000倍", usage: "散布" },
      { crop: "きゅうり", pest: "灰色かび病", dilution: "1000倍", usage: "散布" },
      { crop: "なす", pest: "菌核病", dilution: "1000倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第25789号",
    name: "プロポーズ顆粒水和剤",
    type: "殺菌剤",
    activeIngredient: "イミノクタジン酢酸塩 40.0%",
    manufacturer: "日本曹達",
    applications: [
      { crop: "稲", pest: "いもち病", dilution: "1000倍", usage: "散布" },
      { crop: "稲", pest: "紋枯病", dilution: "1000倍", usage: "散布" },
      { crop: "りんご", pest: "斑点落葉病", dilution: "1500倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第26543号",
    name: "ベルクート水和剤",
    type: "殺菌剤",
    activeIngredient: "イミノクタジンアルベシル酸塩 40.0%",
    manufacturer: "日本曹達",
    applications: [
      { crop: "りんご", pest: "斑点落葉病", dilution: "2000倍", usage: "散布" },
      { crop: "ぶどう", pest: "黒とう病", dilution: "2000倍", usage: "散布" },
      { crop: "いちご", pest: "うどんこ病", dilution: "2000倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第26789号",
    name: "オンリーワンフロアブル",
    type: "殺菌剤",
    activeIngredient: "テブコナゾール 20.0%",
    manufacturer: "日本曹達",
    applications: [
      { crop: "りんご", pest: "うどんこ病", dilution: "2000倍", usage: "散布" },
      { crop: "りんご", pest: "黒星病", dilution: "2000倍", usage: "散布" },
      { crop: "ぶどう", pest: "うどんこ病", dilution: "2000倍", usage: "散布" },
      { crop: "なし", pest: "黒星病", dilution: "2000倍", usage: "散布" }
    ]
  },

  // ===== 除草剤 =====
  {
    registrationNo: "第22056号",
    name: "ラウンドアップマックスロード",
    type: "除草剤",
    activeIngredient: "グリホサートカリウム塩 48.0%",
    manufacturer: "日産化学",
    applications: [
      { crop: "果樹類", pest: "一年生雑草", dilution: "100倍", usage: "雑草茎葉散布" },
      { crop: "樹木等", pest: "多年生雑草", dilution: "50倍", usage: "雑草茎葉散布" },
      { crop: "畑作物", pest: "一年生雑草", dilution: "100倍", usage: "雑草茎葉散布" },
      { crop: "水田畦畔", pest: "一年生雑草", dilution: "100倍", usage: "雑草茎葉散布" }
    ]
  },
  {
    registrationNo: "第23456号",
    name: "バスタ液剤",
    type: "除草剤",
    activeIngredient: "グルホシネート 18.5%",
    manufacturer: "バイエル クロップサイエンス",
    applications: [
      { crop: "果樹類", pest: "一年生雑草", dilution: "100倍", usage: "雑草茎葉散布" },
      { crop: "樹木等", pest: "多年生雑草", dilution: "50倍", usage: "雑草茎葉散布" },
      { crop: "畑作物", pest: "一年生雑草", dilution: "100倍", usage: "雑草茎葉散布" }
    ]
  },
  {
    registrationNo: "第24890号",
    name: "ナブ乳剤",
    type: "除草剤",
    activeIngredient: "セトキシジム 20.0%",
    manufacturer: "BASFジャパン",
    applications: [
      { crop: "だいず", pest: "イネ科一年生雑草", dilution: "100倍", usage: "雑草茎葉散布" },
      { crop: "キャベツ", pest: "イネ科一年生雑草", dilution: "100倍", usage: "雑草茎葉散布" },
      { crop: "にんじん", pest: "イネ科一年生雑草", dilution: "100倍", usage: "雑草茎葉散布" }
    ]
  },
  {
    registrationNo: "第25123号",
    name: "ザーベックスフロアブル",
    type: "除草剤",
    activeIngredient: "ピラクロニル 5.0%",
    manufacturer: "クミアイ化学",
    applications: [
      { crop: "稲", pest: "ノビエ", dilution: "希釈せず", usage: "湛水散布" },
      { crop: "稲", pest: "一年生雑草", dilution: "希釈せず", usage: "湛水散布" }
    ]
  },
  {
    registrationNo: "第21567号",
    name: "プリグロックスL",
    type: "除草剤",
    activeIngredient: "パラコート・ジクワット 5.0%・7.0%",
    manufacturer: "シンジェンタジャパン",
    applications: [
      { crop: "果樹類", pest: "一年生雑草", dilution: "50倍", usage: "雑草茎葉散布" },
      { crop: "樹木等", pest: "一年生雑草", dilution: "50倍", usage: "雑草茎葉散布" }
    ]
  },

  // ===== その他 =====
  {
    registrationNo: "第27012号",
    name: "カスケード乳剤",
    type: "殺虫剤",
    activeIngredient: "フルフェノクスロン 10.0%",
    manufacturer: "BASFジャパン",
    applications: [
      { crop: "キャベツ", pest: "コナガ", dilution: "4000倍", usage: "散布" },
      { crop: "なす", pest: "オオタバコガ", dilution: "4000倍", usage: "散布" },
      { crop: "茶", pest: "ハマキムシ類", dilution: "4000倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第27456号",
    name: "フェニックス顆粒水和剤",
    type: "殺虫剤",
    activeIngredient: "フルベンジアミド 20.0%",
    manufacturer: "日本農薬",
    applications: [
      { crop: "キャベツ", pest: "コナガ", dilution: "2000倍", usage: "散布" },
      { crop: "ブロッコリー", pest: "アオムシ", dilution: "2000倍", usage: "散布" },
      { crop: "なす", pest: "オオタバコガ", dilution: "2000倍", usage: "散布" },
      { crop: "稲", pest: "イネツトムシ", dilution: "2000倍", usage: "散布" }
    ]
  },
  {
    registrationNo: "第28123号",
    name: "ダニサラバフロアブル",
    type: "殺虫剤 (殺ダニ剤)",
    activeIngredient: "シフルメトフェン 20.0%",
    manufacturer: "OATアグリオ",
    applications: [
      { crop: "いちご", pest: "ハダニ類", dilution: "1000倍", usage: "散布" },
      { crop: "なす", pest: "ハダニ類", dilution: "1000倍", usage: "散布" },
      { crop: "りんご", pest: "ハダニ類", dilution: "1000倍", usage: "散布" },
      { crop: "茶", pest: "カンザワハダニ", dilution: "1000倍", usage: "散布" }
    ]
  }
];
