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
  };

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

  function matches(pesticide, { name, crop, pest }) {
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

  function filteredApplications(pesticide, { crop, pest }) {
    if (!crop && !pest) return pesticide.applications;
    return pesticide.applications.filter(
      a => (!crop || a.crop === crop) && (!pest || a.pest === pest)
    );
  }

  function renderCard(pesticide, query) {
    const apps = filteredApplications(pesticide, query);
    const rows = apps
      .map(
        a => `
          <tr>
            <td>${highlight(a.crop, query.crop)}</td>
            <td>${highlight(a.pest, query.pest)}</td>
            <td>${escapeHtml(a.dilution)}</td>
            <td>${escapeHtml(a.usage)}</td>
          </tr>`
      )
      .join("");

    return `
      <li class="result-card">
        <h2>
          ${highlight(pesticide.name, query.name)}
          <span class="reg-no">${escapeHtml(pesticide.registrationNo)}</span>
        </h2>
        <p class="meta">
          ${escapeHtml(pesticide.type)} ／
          有効成分: ${highlight(pesticide.activeIngredient, query.name)} ／
          ${escapeHtml(pesticide.manufacturer)}
        </p>
        <div class="applications">
          <table>
            <thead>
              <tr>
                <th>作物</th>
                <th>病害虫</th>
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
    search();
  }

  initFilters();
  search();

  els.name.addEventListener("input", search);
  els.crop.addEventListener("change", search);
  els.pest.addEventListener("change", search);
  els.reset.addEventListener("click", reset);
})();
