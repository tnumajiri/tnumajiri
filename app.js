(() => {
  const data = window.PESTICIDE_DATA || [];

  const els = {
    name: document.getElementById("q-name"),
    crop: document.getElementById("q-crop"),
    pest: document.getElementById("q-pest"),
    reset: document.getElementById("btn-reset"),
    list: document.getElementById("result-list"),
    count: document.getElementById("result-count"),
    empty: document.getElementById("empty-state"),
    chips: document.querySelectorAll(".chip"),
    examples: document.querySelectorAll(".example"),
  };

  const state = { type: "" };

  const TYPE_CLASS = {
    "殺虫剤": "insect",
    "殺虫剤 (殺ダニ剤)": "insect",
    "殺菌剤": "fungus",
    "除草剤": "herbicide",
  };

  function typeClass(type) {
    return TYPE_CLASS[type] || "";
  }

  function populateSelect(select, values) {
    const sorted = [...new Set(values)].sort((a, b) => a.localeCompare(b, "ja"));
    for (const v of sorted) {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    }
  }

  function initFilters() {
    const crops = data.flatMap(p => p.applications.map(a => a.crop));
    const pests = data.flatMap(p => p.applications.map(a => a.pest));
    populateSelect(els.crop, crops);
    populateSelect(els.pest, pests);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[c]);
  }

  function highlight(text, query) {
    const safe = escapeHtml(text);
    if (!query) return safe;
    const q = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return safe.replace(new RegExp(q, "gi"), m => `<mark>${m}</mark>`);
  }

  function matches(pesticide, { name, crop, pest, type }) {
    if (type && pesticide.type !== type && !pesticide.type.startsWith(type)) return false;
    if (name) {
      const n = name.toLowerCase();
      const hit =
        pesticide.name.toLowerCase().includes(n) ||
        pesticide.activeIngredient.toLowerCase().includes(n) ||
        pesticide.registrationNo.toLowerCase().includes(n);
      if (!hit) return false;
    }
    if (crop || pest) {
      const ok = pesticide.applications.some(a =>
        (!crop || a.crop === crop) && (!pest || a.pest === pest)
      );
      if (!ok) return false;
    }
    return true;
  }

  function renderCard(pesticide, query) {
    const apps = pesticide.applications;
    const tCls = typeClass(pesticide.type);
    const rows = apps
      .map(a => {
        const isHit =
          (query.crop && a.crop === query.crop) ||
          (query.pest && a.pest === query.pest);
        return `
          <tr class="${isHit ? "hit" : ""}">
            <td>${highlight(a.crop, query.crop)}</td>
            <td>${highlight(a.pest, query.pest)}</td>
            <td>${escapeHtml(a.dilution)}</td>
            <td>${escapeHtml(a.usage)}</td>
          </tr>`;
      })
      .join("");

    return `
      <li class="result-card type-${tCls}">
        <div class="card-header">
          <h2>
            ${highlight(pesticide.name, query.name)}
            <span class="type-badge type-${tCls}">${escapeHtml(pesticide.type)}</span>
          </h2>
          <span class="reg-no">${escapeHtml(pesticide.registrationNo)}</span>
        </div>
        <p class="meta">
          <strong>有効成分:</strong> ${highlight(pesticide.activeIngredient, query.name)}
          ／ ${escapeHtml(pesticide.manufacturer)}
        </p>
        <div class="applications">
          <p class="applications-title">適用範囲 (${apps.length} 件)</p>
          <table>
            <thead>
              <tr>
                <th>作物</th>
                <th>病害虫・雑草</th>
                <th>希釈倍数</th>
                <th>使用方法</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </li>
    `;
  }

  function search() {
    const query = {
      name: els.name.value.trim(),
      crop: els.crop.value,
      pest: els.pest.value,
      type: state.type,
    };
    const results = data.filter(p => matches(p, query));

    els.count.textContent = `${results.length} 件`;
    els.list.innerHTML = results.map(p => renderCard(p, query)).join("");
    els.empty.hidden = results.length !== 0;
  }

  function reset() {
    els.name.value = "";
    els.crop.value = "";
    els.pest.value = "";
    state.type = "";
    els.chips.forEach(c => c.classList.toggle("active", c.dataset.type === ""));
    search();
  }

  initFilters();
  search();

  els.name.addEventListener("input", search);
  els.crop.addEventListener("change", search);
  els.pest.addEventListener("change", search);
  els.reset.addEventListener("click", reset);

  els.chips.forEach(chip => {
    chip.addEventListener("click", () => {
      state.type = chip.dataset.type;
      els.chips.forEach(c => c.classList.toggle("active", c === chip));
      search();
    });
  });

  els.examples.forEach(btn => {
    btn.addEventListener("click", () => {
      els.name.value = "";
      els.crop.value = btn.dataset.crop || "";
      els.pest.value = btn.dataset.pest || "";
      // crop/pestがdata内に存在しない場合は無視されて空のまま — selectのフォールバック
      if (els.crop.value !== (btn.dataset.crop || "")) els.crop.value = "";
      if (els.pest.value !== (btn.dataset.pest || "")) els.pest.value = "";
      search();
      document.querySelector(".results").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
