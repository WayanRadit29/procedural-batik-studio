/**
 * renderer.js
 * Renderer — mengatur urutan gambar, mode kombinasi, dan pemanggilan fungsi motif.
 */

const MOTIF_DRAW_FN = {
  kawung:      (ctx, cfg) => drawKawung(ctx, cfg),
  parang:      (ctx, cfg) => drawParang(ctx, cfg),
  ceplok:      (ctx, cfg) => drawCeplok(ctx, cfg),
  megaMendung: (ctx, cfg) => drawMegaMendung(ctx, cfg),
};

/**
 * Entry point renderer.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} config - config global dari main.js
 */
function renderCanvas(ctx, config) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const shape = config.canvasShape || "polos";

  clearCanvas(ctx);

  // Gambar background abu-abu gelap di luar siluet agar terlihat kontras
  if (shape !== "polos") {
    ctx.fillStyle = "#C8BDB0";
    ctx.fillRect(0, 0, W, H);
  }

  // Ambil path garment (null = polos)
  const garmentPath = getGarmentPath(shape, W, H);

  // Terapkan clip mask garment sebelum menggambar motif + background kain
  ctx.save();
  if (garmentPath) {
    ctx.clip(garmentPath);
  }

  // Background warna kain (hanya di dalam siluet)
  ctx.fillStyle = config.backgroundColor;
  ctx.fillRect(0, 0, W, H);

  if (config.motifs.length > 0) {
    switch (config.combinationMode) {
      case "alternating": renderAlternating(ctx, config.motifs); break;
      case "split":       renderSplitRegion(ctx, config.motifs); break;
      case "layering":    renderLayering(ctx, config.motifs); break;
      default:            renderAlternating(ctx, config.motifs);
    }
  }

  ctx.restore(); // lepas clip

  // Gambar outline + detail pakaian di ATAS motif (tidak ter-clip)
  if (shape !== "polos") {
    drawGarmentOutline(ctx, shape, W, H, "#2C1A0E");
  }
}

// ---------------------------------------------------------------------------
// Helpers dasar
// ---------------------------------------------------------------------------

function clearCanvas(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// ---------------------------------------------------------------------------
// Offscreen tile helper
// ---------------------------------------------------------------------------

function drawMotifToTile(motifCfg, tileSize) {
  const offscreen = document.createElement("canvas");
  offscreen.width  = tileSize;
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
// ---------------------------------------------------------------------------

function renderAlternating(ctx, motifs) {
  if (motifs.length === 0) return;

  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  const cellSize = Math.max(10, motifs[0].size + motifs[0].spacing);
  const cols = Math.ceil(W / cellSize) + 1;
  const rows = Math.ceil(H / cellSize) + 1;

  const tiles = motifs.map((motifCfg) => drawMotifToTile(motifCfg, cellSize));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const idx  = (row * cols + col) % motifs.length;
      const tile = tiles[idx];
      if (!tile) continue;
      ctx.drawImage(tile, col * cellSize, row * cellSize);
    }
  }
}

// ---------------------------------------------------------------------------
// Mode 2: Split Region
// ---------------------------------------------------------------------------

function renderSplitRegion(ctx, motifs) {
  if (motifs.length === 0) return;

  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const regionW = Math.floor(W / motifs.length);

  motifs.forEach((motifCfg, i) => {
    const drawFn = MOTIF_DRAW_FN[motifCfg.type];
    if (!drawFn) { console.warn(`Motif "${motifCfg.type}" tidak ditemukan.`); return; }

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
// ---------------------------------------------------------------------------

function renderLayering(ctx, motifs) {
  if (motifs.length === 0) return;

  const opacityStep = 1 / motifs.length;

  motifs.forEach((motifCfg, i) => {
    const drawFn = MOTIF_DRAW_FN[motifCfg.type];
    if (!drawFn) { console.warn(`Motif "${motifCfg.type}" tidak ditemukan.`); return; }

    ctx.save();
    ctx.globalAlpha = opacityStep * (i + 1);
    drawFn(ctx, motifCfg);
    ctx.restore();
  });
}
