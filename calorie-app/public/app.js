/* ===== カロリー手帳 — フロントエンド ===== */
"use strict";

// ---------- ストレージ ----------
const store = {
  get settings() {
    return JSON.parse(localStorage.getItem("ct_settings") || "null") || { goal: 2000 };
  },
  set settings(v) {
    localStorage.setItem("ct_settings", JSON.stringify(v));
  },
  get entries() {
    return JSON.parse(localStorage.getItem("ct_entries") || "[]");
  },
  set entries(v) {
    localStorage.setItem("ct_entries", JSON.stringify(v));
  },
};

// ---------- 日付ユーティリティ ----------
const fmtDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const todayStr = () => fmtDate(new Date());
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

let currentDate = todayStr();

// ---------- DOM ----------
const $ = (id) => document.getElementById(id);

// ---------- 描画 ----------
function entriesOf(dateStr) {
  return store.entries.filter((e) => e.date === dateStr);
}

function sumOf(list, key) {
  return Math.round(list.reduce((s, e) => s + (Number(e[key]) || 0), 0));
}

function render() {
  const goal = store.settings.goal;
  const list = entriesOf(currentDate);
  const kcal = sumOf(list, "calories");
  const balance = goal - kcal;

  // 日付ラベル
  const d = new Date(currentDate + "T00:00:00");
  const isToday = currentDate === todayStr();
  $("dateLabel").textContent = isToday
    ? `今日 ${d.getMonth() + 1}/${d.getDate()}(${WEEKDAYS[d.getDay()]})`
    : `${d.getMonth() + 1}月${d.getDate()}日(${WEEKDAYS[d.getDay()]})`;
  $("nextDay").disabled = isToday;
  $("nextDay").style.opacity = isToday ? 0.3 : 1;

  // リング
  const CIRC = 527.8;
  const ratio = Math.min(kcal / goal, 1);
  const ringFg = $("ringFg");
  ringFg.style.strokeDashoffset = CIRC * (1 - ratio);
  ringFg.classList.toggle("over", kcal > goal);
  $("ringKcal").textContent = kcal.toLocaleString();
  const status = $("ringStatus");
  if (kcal > goal) {
    status.textContent = `目標を ${(kcal - goal).toLocaleString()} kcal オーバー`;
    status.classList.add("over");
  } else {
    status.textContent = `目標まで あと ${balance.toLocaleString()} kcal`;
    status.classList.remove("over");
  }

  // 統計
  $("statGoal").textContent = goal.toLocaleString();
  $("statIntake").textContent = kcal.toLocaleString();
  const bal = $("statBalance");
  bal.textContent = (balance >= 0 ? "+" : "") + balance.toLocaleString();
  bal.className = "stat-value " + (balance >= 0 ? "plus" : "minus");

  // PFC(目安: P=目標kcalの20%/4, F=25%/9, C=55%/4)
  const targets = {
    p: (goal * 0.2) / 4,
    f: (goal * 0.25) / 9,
    c: (goal * 0.55) / 4,
  };
  const vals = {
    p: sumOf(list, "protein"),
    f: sumOf(list, "fat"),
    c: sumOf(list, "carbs"),
  };
  for (const k of ["p", "f", "c"]) {
    const el = $("macro" + k.toUpperCase());
    el.querySelector(".macro-val").textContent = `${vals[k]} g / ${Math.round(targets[k])} g`;
    el.querySelector(".bar-fill").style.width =
      Math.min((vals[k] / targets[k]) * 100, 100) + "%";
  }

  renderWeek(goal);
  renderMeals(list);
}

function renderWeek(goal) {
  const chart = $("weekChart");
  chart.innerHTML = "";
  const base = new Date(currentDate + "T00:00:00");
  let weekBalance = 0;
  let daysWithData = 0;
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  const maxKcal = Math.max(goal * 1.2, ...days.map((d) => sumOf(entriesOf(fmtDate(d)), "calories")));

  for (const d of days) {
    const ds = fmtDate(d);
    const kcal = sumOf(entriesOf(ds), "calories");
    if (kcal > 0) {
      weekBalance += goal - kcal;
      daysWithData++;
    }
    const el = document.createElement("div");
    el.className = "wday" + (ds === todayStr() ? " today" : "");
    el.innerHTML = `
      <div class="wbar-track">
        <div class="goal-line" style="bottom:${(goal / maxKcal) * 100}%"></div>
        <div class="wbar ${kcal === 0 ? "empty" : kcal > goal ? "over" : ""}"
             style="height:${kcal === 0 ? 3 : Math.max((kcal / maxKcal) * 100, 4)}%"></div>
      </div>
      <span class="wday-kcal">${kcal > 0 ? Math.round(kcal / 100) / 10 + "k" : "–"}</span>
      <span class="wday-label">${WEEKDAYS[d.getDay()]}</span>`;
    el.addEventListener("click", () => {
      currentDate = ds;
      render();
    });
    chart.appendChild(el);
  }

  $("weekBalance").textContent = daysWithData
    ? `7日間の収支 ${weekBalance >= 0 ? "+" : ""}${weekBalance.toLocaleString()} kcal`
    : "";
}

const SOURCE_ICONS = { photo: "📷", recipe: "🔗", manual: "✏️" };

function renderMeals(list) {
  const ul = $("mealList");
  ul.innerHTML = "";
  $("mealEmpty").hidden = list.length > 0;
  for (const e of [...list].sort((a, b) => (a.time < b.time ? -1 : 1))) {
    const li = document.createElement("li");
    li.className = "meal";
    li.innerHTML = `
      <div class="meal-icon">${SOURCE_ICONS[e.source] || "🍽"}</div>
      <div class="meal-info">
        <div class="meal-name"></div>
        <div class="meal-meta">${e.time} ・ P${Math.round(e.protein)} F${Math.round(e.fat)} C${Math.round(e.carbs)}</div>
      </div>
      <div class="meal-kcal">${Math.round(e.calories).toLocaleString()}<small> kcal</small></div>
      <button class="meal-del" aria-label="削除">✕</button>`;
    li.querySelector(".meal-name").textContent = e.name;
    li.querySelector(".meal-del").addEventListener("click", () => {
      if (confirm(`「${e.name}」を削除しますか?`)) {
        store.entries = store.entries.filter((x) => x.id !== e.id);
        render();
      }
    });
    ul.appendChild(li);
  }
}

// ---------- 日付ナビ ----------
$("prevDay").addEventListener("click", () => {
  const d = new Date(currentDate + "T00:00:00");
  d.setDate(d.getDate() - 1);
  currentDate = fmtDate(d);
  render();
});
$("nextDay").addEventListener("click", () => {
  if (currentDate === todayStr()) return;
  const d = new Date(currentDate + "T00:00:00");
  d.setDate(d.getDate() + 1);
  currentDate = fmtDate(d);
  render();
});
$("dateLabel").addEventListener("click", () => {
  currentDate = todayStr();
  render();
});

// ---------- モーダル共通 ----------
function openModal(el) {
  el.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeModal(el) {
  el.hidden = true;
  document.body.style.overflow = "";
}
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (ev) => {
    if (ev.target === modal) closeModal(modal);
  });
  modal.querySelectorAll("[data-close]").forEach((btn) =>
    btn.addEventListener("click", () => closeModal(modal))
  );
});

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => (t.hidden = true), 2200);
}

// ---------- 追加モーダル ----------
const addModal = $("addModal");
let currentResult = null; // 解析結果(保存待ち)
let currentSource = "manual";

function switchTab(name) {
  currentSource = name;
  document.querySelectorAll("#addTabs .tab").forEach((t) =>
    t.classList.toggle("active", t.dataset.tab === name)
  );
  document.querySelectorAll(".tab-pane").forEach((p) => {
    p.hidden = p.dataset.pane !== name;
  });
  hideResult();
}

document.querySelectorAll("#addTabs .tab").forEach((t) =>
  t.addEventListener("click", () => switchTab(t.dataset.tab))
);
document.querySelectorAll("[data-add]").forEach((btn) =>
  btn.addEventListener("click", () => {
    resetAddModal();
    switchTab(btn.dataset.add);
    openModal(addModal);
  })
);

function resetAddModal() {
  $("photoInput").value = "";
  $("photoPreview").hidden = true;
  $("photoPreview").src = "";
  $("photoHint").hidden = false;
  $("photoNote").value = "";
  $("analyzePhotoBtn").disabled = true;
  $("recipeUrl").value = "";
  $("recipeNote").value = "";
  $("manualName").value = "";
  $("manualKcal").value = "";
  $("manualP").value = "";
  $("manualF").value = "";
  $("manualC").value = "";
  $("addError").hidden = true;
  hideResult();
  photoData = null;
}

function hideResult() {
  $("result").hidden = true;
  $("analyzing").hidden = true;
  currentResult = null;
}

function showError(msg) {
  const el = $("addError");
  el.textContent = msg;
  el.hidden = false;
  $("analyzing").hidden = true;
}

// ---- 写真 ----
let photoData = null; // { base64, mediaType }

$("photoInput").addEventListener("change", async (ev) => {
  const file = ev.target.files?.[0];
  if (!file) return;
  $("addError").hidden = true;
  try {
    photoData = await resizeImage(file, 1400);
    const img = $("photoPreview");
    img.src = `data:${photoData.mediaType};base64,${photoData.base64}`;
    img.hidden = false;
    $("photoHint").hidden = true;
    $("analyzePhotoBtn").disabled = false;
  } catch {
    showError("画像を読み込めませんでした。別の画像でお試しください。");
  }
});

// 画像を縮小してbase64化(通信量とトークンの節約)
function resizeImage(file, maxSize) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(maxSize / Math.max(img.width, img.height), 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      resolve({ base64: dataUrl.split(",")[1], mediaType: "image/jpeg" });
    };
    img.onerror = reject;
    img.src = url;
  });
}

$("analyzePhotoBtn").addEventListener("click", async () => {
  if (!photoData) return;
  await analyze("/api/analyze-photo", {
    image: photoData.base64,
    mediaType: photoData.mediaType,
    hint: $("photoNote").value.trim() || undefined,
  }, "写真からカロリーを計算しています…");
});

// ---- レシピURL ----
$("analyzeRecipeBtn").addEventListener("click", async () => {
  const url = $("recipeUrl").value.trim();
  if (!url) {
    showError("URLを入力してください。");
    return;
  }
  await analyze("/api/analyze-recipe", {
    url,
    servingsHint: $("recipeNote").value.trim() || undefined,
  }, "レシピを読み取ってカロリーを計算しています…");
});

// ---- 解析の共通処理 ----
async function analyze(endpoint, body, message) {
  $("addError").hidden = true;
  $("result").hidden = true;
  $("analyzingText").textContent = message;
  $("analyzing").hidden = false;
  try {
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      throw new Error(data.error || "解析に失敗しました。");
    }
    $("analyzing").hidden = true;
    showResult(data);
  } catch (err) {
    showError(err.message || "通信エラーが発生しました。");
  }
}

const CONFIDENCE_LABELS = { high: "推定精度: 高", medium: "推定精度: 中", low: "推定精度: 低" };

function showResult(data) {
  currentResult = data;
  const badge = $("resultConfidence");
  badge.textContent = CONFIDENCE_LABELS[data.confidence] || "推定";
  badge.className = "badge " + (data.confidence || "");
  $("resultKcal").textContent = Math.round(data.total_calories).toLocaleString();
  $("resultName").value = data.dish_name || "";

  const ul = $("resultItems");
  ul.innerHTML = "";
  for (const item of data.items || []) {
    const li = document.createElement("li");
    const left = document.createElement("span");
    left.textContent = item.name + " ";
    const small = document.createElement("small");
    small.textContent = item.amount || "";
    left.appendChild(small);
    const right = document.createElement("span");
    right.className = "item-kcal";
    right.textContent = Math.round(item.calories) + " kcal";
    li.append(left, right);
    ul.appendChild(li);
  }

  $("resultNotes").textContent = data.notes || "";
  $("resultNotes").hidden = !data.notes;
  $("resKcalInput").value = Math.round(data.total_calories);
  $("resPInput").value = Math.round(data.total_protein_g);
  $("resFInput").value = Math.round(data.total_fat_g);
  $("resCInput").value = Math.round(data.total_carbs_g);
  $("result").hidden = false;
  $("result").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

$("resKcalInput").addEventListener("input", () => {
  $("resultKcal").textContent = (Number($("resKcalInput").value) || 0).toLocaleString();
});

$("retryBtn").addEventListener("click", hideResult);

$("saveResultBtn").addEventListener("click", () => {
  if (!currentResult) return;
  const name = $("resultName").value.trim() || currentResult.dish_name || "食事";
  saveEntry({
    name,
    calories: Number($("resKcalInput").value) || 0,
    protein: Number($("resPInput").value) || 0,
    fat: Number($("resFInput").value) || 0,
    carbs: Number($("resCInput").value) || 0,
    source: currentSource,
    items: currentResult.items || [],
  });
});

// ---- 手入力 ----
$("saveManualBtn").addEventListener("click", () => {
  const name = $("manualName").value.trim();
  const kcal = Number($("manualKcal").value);
  if (!name || !(kcal >= 0) || $("manualKcal").value === "") {
    showError("食事名とカロリーを入力してください。");
    return;
  }
  saveEntry({
    name,
    calories: kcal,
    protein: Number($("manualP").value) || 0,
    fat: Number($("manualF").value) || 0,
    carbs: Number($("manualC").value) || 0,
    source: "manual",
    items: [],
  });
});

function saveEntry(data) {
  const now = new Date();
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    date: currentDate,
    time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
    ...data,
  };
  store.entries = [...store.entries, entry];
  closeModal(addModal);
  render();
  toast(`「${entry.name}」を記録しました 🎉`);
}

// ---------- 設定 ----------
const settingsModal = $("settingsModal");
$("settingsBtn").addEventListener("click", () => {
  $("goalInput").value = store.settings.goal;
  $("calcResult").textContent = "";
  openModal(settingsModal);
});

$("calcBtn").addEventListener("click", () => {
  const sex = $("calcSex").value;
  const age = Number($("calcAge").value);
  const h = Number($("calcHeight").value);
  const w = Number($("calcWeight").value);
  const act = Number($("calcActivity").value);
  const adj = Number($("calcGoalType").value);
  if (!age || !h || !w) {
    $("calcResult").textContent = "年齢・身長・体重を入力してください。";
    return;
  }
  // Mifflin-St Jeor 式
  const bmr = 10 * w + 6.25 * h - 5 * age + (sex === "male" ? 5 : -161);
  const tdee = Math.round((bmr * act + adj) / 10) * 10;
  $("goalInput").value = tdee;
  $("calcResult").textContent = `基礎代謝 約${Math.round(bmr)} kcal → 1日の目安 ${tdee.toLocaleString()} kcal を設定しました。`;
});

$("saveSettingsBtn").addEventListener("click", () => {
  const goal = Number($("goalInput").value);
  if (!(goal >= 500 && goal <= 6000)) {
    $("calcResult").textContent = "目標カロリーは500〜6000の範囲で入力してください。";
    return;
  }
  store.settings = { ...store.settings, goal };
  closeModal(settingsModal);
  render();
  toast("目標を保存しました");
});

// ---------- 初期化 ----------
render();
