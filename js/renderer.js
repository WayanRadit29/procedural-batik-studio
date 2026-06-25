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
// Mode 1: Alternating Pattern (WAJIB)
// Motif digambar bergantian per cell dalam grid.
// ---------------------------------------------------------------------------

function renderAlternating(ctx, motifs) {
  if (motifs.length === 0) return;

  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  // Gunakan size + spacing motif pertama sebagai ukuran cell grid
const cellSize = motifs[0].size + motifs[0].spacing;

  const cols = Math.ceil(W / cellSize);
  const rows = Math.ceil(H / cellSize);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const idx = (row * cols + col) % motifs.length;
      const motifCfg = motifs[idx];
      const drawFn = MOTIF_DRAW_FN[motifCfg.type];

      if (!drawFn) {
        console.warn(`Fungsi motif untuk "${motifCfg.type}" tidak ditemukan.`);
        continue;
      }

      // Clip ke area cell agar motif tidak meluber ke cell lain
      ctx.save();
      ctx.beginPath();
      ctx.rect(col * cellSize, row * cellSize, cellSize, cellSize);
      ctx.clip();

      // Geser origin ke pojok kiri atas cell
      ctx.translate(col * cellSize, row * cellSize);

      drawFn(ctx, { ...motifCfg, offsetX: 0, offsetY: 0 });

      ctx.restore();
    }
  }
}

// ---------------------------------------------------------------------------
// Mode 2: Split Region (BONUS)
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
// Mode 3: Layering (BONUS)
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
    // Layer teratas lebih opaque
    ctx.globalAlpha = opacityStep * (i + 1);
    drawFn(ctx, motifCfg);
    ctx.restore();
  });
}
