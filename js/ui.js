/**
 * ui.js
 * UI Controller — setup elemen kontrol dan event listener.
 * Tidak tahu tentang canvas atau rendering — hanya mengatur UI dan memanggil callback.
 */

const MOTIF_LIST = [
  { id: "kawung",      label: "Kawung" },
  { id: "parang",      label: "Parang" },
  { id: "ceplok",      label: "Ceplok" },
  { id: "megaMendung", label: "Mega Mendung" },
];

/**
 * Inisialisasi seluruh UI secara programatik.
 * @param {Function} onUpdate - callback yang dipanggil setiap ada perubahan
 */
function setupUI(onUpdate) {
  buildMotifControls();
  attachGlobalListeners(onUpdate);
  attachMotifListeners(onUpdate);
  attachExportButton();
  updateMotifPanelVisibility();
}

// ---------------------------------------------------------------------------
// Build — membuat panel kontrol per motif secara dinamis
// ---------------------------------------------------------------------------

function buildMotifControls() {
  const container = document.getElementById("motifControls");
  if (!container) return;

  container.innerHTML = "";

  MOTIF_LIST.forEach(({ id, label }) => {
    const panel = document.createElement("div");
    panel.className = "motif-panel";
    panel.id = `panel-${id}`;

    panel.innerHTML = `
      <div class="motif-header">
        <label class="motif-toggle">
          <input type="checkbox" class="motif-checkbox" value="${id}" id="check-${id}" />
          <span class="motif-label">${label}</span>
        </label>
      </div>
      <div class="motif-params" id="params-${id}" style="display:none;">
        <div class="param-row">
          <label for="size-${id}">Ukuran</label>
          <input type="range" id="size-${id}" min="20" max="120" value="50" />
          <span class="param-val" id="size-${id}-val">50</span>
        </div>
        <div class="param-row">
          <label for="spacing-${id}">Kepadatan</label>
          <input type="range" id="spacing-${id}" min="0" max="60" value="10" />
          <span class="param-val" id="spacing-${id}-val">10</span>
        </div>
        <div class="param-row">
          <label for="primary-${id}">Warna Utama</label>
          <input type="color" id="primary-${id}" value="#8B4513" />
        </div>
        <div class="param-row">
          <label for="secondary-${id}">Warna Aksen</label>
          <input type="color" id="secondary-${id}" value="#D2B48C" />
        </div>
      </div>
    `;

    container.appendChild(panel);
  });
}

// ---------------------------------------------------------------------------
// Listeners — global controls (bgColor, combinationMode)
// ---------------------------------------------------------------------------

function attachGlobalListeners(onUpdate) {
  const bgColor = document.getElementById("bgColor");
  const combinationMode = document.getElementById("combinationMode");

  if (bgColor) bgColor.addEventListener("input", onUpdate);
  if (combinationMode) combinationMode.addEventListener("change", onUpdate);
}

// ---------------------------------------------------------------------------
// Listeners — per motif (checkbox + sliders + color pickers)
// ---------------------------------------------------------------------------

function attachMotifListeners(onUpdate) {
  // Event delegation untuk semua elemen di dalam #motifControls
  const container = document.getElementById("motifControls");
  if (!container) return;

  container.addEventListener("change", (e) => {
    if (e.target.classList.contains("motif-checkbox")) {
      updateMotifPanelVisibility();
    }
    onUpdate();
  });

  container.addEventListener("input", (e) => {
    // Update label nilai slider secara real-time
    const match = e.target.id.match(/^(size|spacing)-(.+)$/);
    if (match) {
      const valEl = document.getElementById(`${e.target.id}-val`);
      if (valEl) valEl.textContent = e.target.value;
    }
    onUpdate();
  });
}

// ---------------------------------------------------------------------------
// Toggle panel param: tampil hanya jika motif dicek
// ---------------------------------------------------------------------------

function updateMotifPanelVisibility() {
  MOTIF_LIST.forEach(({ id }) => {
    const checkbox = document.getElementById(`check-${id}`);
    const params = document.getElementById(`params-${id}`);
    if (checkbox && params) {
      params.style.display = checkbox.checked ? "block" : "none";
    }
  });
}

// ---------------------------------------------------------------------------
// Export button
// ---------------------------------------------------------------------------

function attachExportButton() {
  const btn = document.getElementById("exportBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const canvas = document.getElementById("batikCanvas");
    const timestamp = new Date().toISOString().slice(0, 10);
    exportToPNG(canvas, `batik-design-${timestamp}.png`);
  });
}
