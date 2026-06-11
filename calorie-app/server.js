// カロリー手帳 — サーバー
// 写真・レシピURLの解析を Claude API で行い、フロントエンドを配信する。
// APIキーはサーバー側に保持し、ブラウザへは渡さない。

const fs = require("fs");
const path = require("path");

// .env があれば読み込む(依存パッケージなしの簡易ローダー)
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic();
const app = express();
const PORT = process.env.PORT || 3000;
const MODEL = "claude-opus-4-8";

app.use(express.json({ limit: "25mb" }));
app.use(express.static(path.join(__dirname, "public")));

// 解析結果の共通スキーマ(structured outputs)
const nutritionSchema = {
  type: "object",
  properties: {
    dish_name: {
      type: "string",
      description: "料理・食事全体の名前(日本語、簡潔に)",
    },
    items: {
      type: "array",
      description: "含まれる料理・食材ごとの内訳",
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "品目名(日本語)" },
          amount: { type: "string", description: "推定量(例: 1杯(約150g))" },
          calories: { type: "number", description: "推定カロリー(kcal)" },
          protein_g: { type: "number", description: "たんぱく質(g)" },
          fat_g: { type: "number", description: "脂質(g)" },
          carbs_g: { type: "number", description: "炭水化物(g)" },
        },
        required: ["name", "amount", "calories", "protein_g", "fat_g", "carbs_g"],
        additionalProperties: false,
      },
    },
    total_calories: { type: "number", description: "合計カロリー(kcal)" },
    total_protein_g: { type: "number" },
    total_fat_g: { type: "number" },
    total_carbs_g: { type: "number" },
    confidence: {
      type: "string",
      enum: ["high", "medium", "low"],
      description: "推定の確からしさ",
    },
    notes: {
      type: "string",
      description: "推定の根拠や注意点(日本語、1〜2文)",
    },
  },
  required: [
    "dish_name",
    "items",
    "total_calories",
    "total_protein_g",
    "total_fat_g",
    "total_carbs_g",
    "confidence",
    "notes",
  ],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `あなたは日本の管理栄養士です。食事の写真やレシピから、栄養成分を現実的に推定します。

推定のルール:
- 日本食品標準成分表の一般的な値を基準にする
- 量が不明な場合は、日本で一般的な1人前の量を仮定し、amount にその仮定を明記する
- 調理油・調味料・ドレッシングなど見落としやすいカロリーも含める
- コンビニ商品やチェーン店の商品と特定できる場合は、公表されている栄養成分に近い値を使う
- 過小評価しがちなので、迷ったらやや多めに見積もる
- 数値はすべて整数に丸めてよい。items の合計と total が一致するようにする`;

function parseResult(response) {
  if (response.stop_reason === "refusal") {
    const err = new Error("解析できない内容でした。別の画像やURLでお試しください。");
    err.status = 422;
    throw err;
  }
  const text = response.content.find((b) => b.type === "text")?.text;
  if (!text) {
    const err = new Error("解析結果を取得できませんでした。");
    err.status = 502;
    throw err;
  }
  return JSON.parse(text);
}

// ---- 写真解析 ----
app.post("/api/analyze-photo", async (req, res) => {
  try {
    const { image, mediaType, hint } = req.body || {};
    if (!image || !mediaType) {
      return res.status(400).json({ error: "画像データがありません。" });
    }

    const userText =
      "この写真に写っている食事のカロリーと栄養成分(PFC)を推定してください。" +
      (hint ? `\n補足情報: ${hint}` : "");

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      output_config: {
        format: { type: "json_schema", schema: nutritionSchema },
      },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: image },
            },
            { type: "text", text: userText },
          ],
        },
      ],
    });

    res.json(parseResult(response));
  } catch (err) {
    handleError(err, res);
  }
});

// ---- レシピURL解析 ----
app.post("/api/analyze-recipe", async (req, res) => {
  try {
    const { url, servingsHint } = req.body || {};
    let parsed;
    try {
      parsed = new URL(url);
      if (!/^https?:$/.test(parsed.protocol)) throw new Error();
    } catch {
      return res.status(400).json({ error: "有効なURLを入力してください。" });
    }

    const pageText = await fetchPageText(parsed.href);

    const userText = `次のWebページ(レシピサイトまたはレシピ動画ページ)の内容から、このレシピを再現して食べた場合の「1人前あたり」のカロリーと栄養成分(PFC)を推定してください。
ページにレシピ情報(材料・分量)があればそれを最優先に使い、何人前のレシピかも考慮してください。動画ページで材料が概要欄にしか無い場合は、タイトルと説明文から料理を特定し、一般的なレシピとして推定してください。
${servingsHint ? `補足情報: ${servingsHint}` : ""}
dish_name にはレシピ名を、notes には「何人前のレシピを1人前に換算したか」を必ず書いてください。

URL: ${parsed.href}

--- ページ内容(抜粋) ---
${pageText}`;

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      output_config: {
        format: { type: "json_schema", schema: nutritionSchema },
      },
      messages: [{ role: "user", content: userText }],
    });

    res.json(parseResult(response));
  } catch (err) {
    handleError(err, res);
  }
});

// レシピページの本文テキストを抽出する。
// JSON-LD(Recipe構造化データ)とmetaタグはレシピ情報の精度が高いので優先して残す。
async function fetchPageText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  let html;
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept-Language": "ja,en;q=0.8",
      },
    });
    if (!resp.ok) {
      const err = new Error(`ページを取得できませんでした(HTTP ${resp.status})。`);
      err.status = 422;
      throw err;
    }
    html = await resp.text();
  } catch (e) {
    if (e.status) throw e;
    const err = new Error("ページの取得に失敗しました。URLを確認してください。");
    err.status = 422;
    throw err;
  } finally {
    clearTimeout(timer);
  }

  const pick = (re) => {
    const m = html.match(re);
    return m ? m[1] : "";
  };
  const title = pick(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const ogTitle = pick(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i);
  const desc =
    pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
    pick(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i);

  const jsonLd = [];
  const ldRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = ldRe.exec(html)) && jsonLd.join("").length < 20000) {
    jsonLd.push(m[1].trim());
  }

  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  const parts = [
    title && `タイトル: ${title}`,
    ogTitle && ogTitle !== title && `OGタイトル: ${ogTitle}`,
    desc && `説明: ${desc}`,
    jsonLd.length && `構造化データ(JSON-LD): ${jsonLd.join("\n")}`,
    `本文: ${body.slice(0, 40000)}`,
  ].filter(Boolean);

  return parts.join("\n\n");
}

function handleError(err, res) {
  if (err.status && err.message) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err instanceof Anthropic.AuthenticationError) {
    console.error("APIキーが無効です。ANTHROPIC_API_KEY を確認してください。");
    return res
      .status(500)
      .json({ error: "サーバーのAPIキー設定に問題があります(ANTHROPIC_API_KEY)。" });
  }
  if (err instanceof Anthropic.RateLimitError) {
    return res
      .status(429)
      .json({ error: "アクセスが集中しています。少し待ってからお試しください。" });
  }
  if (err instanceof Anthropic.APIError) {
    console.error(`Claude API error ${err.status}:`, err.message);
    return res.status(502).json({ error: "解析サービスでエラーが発生しました。" });
  }
  console.error(err);
  res.status(500).json({ error: "サーバーエラーが発生しました。" });
}

app.listen(PORT, () => {
  console.log(`カロリー手帳: http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    console.warn(
      "⚠ ANTHROPIC_API_KEY が設定されていません。写真・URL解析は動作しません。"
    );
  }
});
