/**
 * renderer.js
 * Renderer — mengatur urutan gambar, mode kombinasi, dan pemanggilan fungsi motif.
 */

// Registry motif: tambahkan di sini jika ada motif baru
const MOTIF_DRAW_FN = {
  kawung: (ctx, cfg) => drawKawung(ctx, cfg),
  parang: (ctx, cfg) => drawParang(ctx, cfg),
  ceplok: (ctx, cfg) => drawCeplok(ctx, cfg),
  megaMendung: (ctx, cfg) => drawMegaMendung(ctx, cfg),
};

/**
 * Entry point renderer.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} config - config global dari main.js
 */
function renderCanvas(ctx, config) {
  clearCanvas(ctx);
  drawBackground(ctx, config.backgroundColor);

  if (config.motifs.length === 0) return;

  switch (config.combinationMode) {
    case "alternating":
      renderAlternating(ctx, config.motifs);
      break;
    case "split":
      renderSplitRegion(ctx, config.motifs);
      break;
    case "layering":
      renderLayering(ctx, config.motifs);
      break;
    default:
      renderAlternating(ctx, config.motifs);
  }
}

// ---------------------------------------------------------------------------
// Helpers dasar
// ---------------------------------------------------------------------------

function clearCanvas(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawBackground(ctx, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// ---------------------------------------------------------------------------
// Buat virtual canvas sementara untuk satu motif, lalu tile ke canvas utama.
// Ini menghindari masalah motif yang membaca ctx.canvas.width/height
// secara absolut dan tidak mendukung offset.
// ---------------------------------------------------------------------------

function drawMotifToTile(motifCfg, tileSize) {
  const offscreen = document.createElement("canvas");
  offscreen.width = tileSize;
  offscreen.height = tileSize;
  const offCtx = offscreen.getContext("2d");

  const drawFn = MOTIF_DRAW_FN[motifCfg.type];
  if (!drawFn) {
    console.warn(`Fungsi motif untuk "${motifCfg.type}" tidak ditemukan.`);
    return null;
  }

  drawFn(offCtx, motifCfg);
  return offscreen;
}

// ---------------------------------------------------------------------------
// Mode 1: Alternating Pattern
// Motif digambar bergantian per cell dalam grid.
// Setiap motif di-render ke offscreen canvas dulu agar bisa di-tile dengan benar.
// ---------------------------------------------------------------------------

function renderAlternating(ctx, motifs) {
  if (motifs.length === 0) return;

  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  const cellSize = Math.max(10, motifs[0].size + motifs[0].spacing);
  const cols = Math.ceil(W / cellSize) + 1;
  const rows = Math.ceil(H / cellSize) + 1;

  // Pre-render setiap motif ke offscreen canvas
  const tiles = motifs.map((motifCfg) => drawMotifToTile(motifCfg, cellSize));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const idx = (row * cols + col) % motifs.length;
      const tile = tiles[idx];
      if (!tile) continue;

      ctx.drawImage(tile, col * cellSize, row * cellSize);
    }
  }
}

// ---------------------------------------------------------------------------
// Mode 2: Split Region
// Canvas dibagi rata secara horizontal berdasarkan jumlah motif.
// ---------------------------------------------------------------------------

function renderSplitRegion(ctx, motifs) {
  if (motifs.length === 0) return;

  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const regionW = Math.floor(W / motifs.length);

  motifs.forEach((motifCfg, i) => {
    const drawFn = MOTIF_DRAW_FN[motifCfg.type];
    if (!drawFn) {
      console.warn(`Fungsi motif untuk "${motifCfg.type}" tidak ditemukan.`);
      return;
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(i * regionW, 0, regionW, H);
    ctx.clip();
    ctx.translate(i * regionW, 0);

    drawFn(ctx, motifCfg);

    ctx.restore();
  });
}

// ---------------------------------------------------------------------------
// Mode 3: Layering
// Motif ditumpuk dari bawah ke atas dengan globalAlpha untuk transparansi.
// ---------------------------------------------------------------------------

function renderLayering(ctx, motifs) {
  if (motifs.length === 0) return;

  const opacityStep = 1 / motifs.length;

  motifs.forEach((motifCfg, i) => {
    const drawFn = MOTIF_DRAW_FN[motifCfg.type];
    if (!drawFn) {
      console.warn(`Fungsi motif untuk "${motifCfg.type}" tidak ditemukan.`);
      return;
    }

    ctx.save();
    ctx.globalAlpha = opacityStep * (i + 1);
    drawFn(ctx, motifCfg);
    ctx.restore();
  });
}
