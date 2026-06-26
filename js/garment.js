/**
 * garment.js
 * Garment Shapes — clip path + outline untuk tiap bentuk pakaian.
 * Canvas 800x800. Semua koordinat relatif terhadap W dan H.
 */

function getGarmentPath(shape, W, H) {
  switch (shape) {
    case "kemeja":  return pathKemeja(W, H);
    case "rok":     return pathRok(W, H);
    case "gamis":   return pathGamis(W, H);
    case "sarung":  return pathSarung(W, H);
    default:        return null;
  }
}

function drawGarmentOutline(ctx, shape, W, H, outlineColor) {
  if (shape === "polos") return;
  const path = getGarmentPath(shape, W, H);
  if (!path) return;

  ctx.save();
  ctx.strokeStyle = outlineColor || "#2C1A0E";
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.lineCap  = "round";
  ctx.stroke(path);

  switch (shape) {
    case "kemeja":  drawDetailKemeja(ctx, W, H); break;
    case "rok":     drawDetailRok(ctx, W, H);    break;
    case "gamis":   drawDetailGamis(ctx, W, H);  break;
    case "sarung":  drawDetailSarung(ctx, W, H); break;
  }
  ctx.restore();
}

// ============================================================
// PATH DEFINITIONS
// ============================================================

/**
 * Kemeja lengan pendek tampak depan — proporsi lebih sempit dan wajar.
 *
 * Titik-titik kunci (cx = W/2):
 *   Leher  : lubang U, lebar ±neckW dari cx, dalam neckDepth
 *   Bahu   : tepat di tepi leher, lebar total badan shoulderW dari cx
 *   Lengan : lengan pendek, menonjol ~sleeveW ke samping, panjang sleeveH
 *   Badan  : dari ketiak turun lurus sedikit melebar ke hem
 *   Hem    : lebar hemW, posisi Y hemY
 */
function pathKemeja(W, H) {
  const p  = new Path2D();
  const cx = W / 2;

  // --- dimensi utama ---
  const neckW      = W * 0.075;   // setengah lebar lubang leher
  const neckTopY   = H * 0.10;    // puncak lubang leher (kerah)
  const neckBotY   = H * 0.165;   // dasar lubang leher

  const shoulderY  = H * 0.115;   // ketinggian puncak bahu
  const shoulderX  = W * 0.285;   // jarak bahu dari cx (setengah lebar bahu)

  // Lengan pendek
  const sleeveOutX = W * 0.385;   // ujung luar lengan
  const sleeveTopY = H * 0.125;   // puncak lengan (ujung bahu)
  const sleeveBotY = H * 0.305;   // ujung bawah lengan (manset)

  // Ketiak — titik balik dari lengan ke badan
  const armholeX   = W * 0.29;
  const armholeY   = H * 0.30;

  // Badan
  const bodyTopX   = W * 0.265;   // lebar badan tepat di bawah ketiak
  const bodyBotX   = W * 0.275;   // lebar badan di hem (sedikit melebar)
  const hemY       = H * 0.82;

  // ---- mulai path dari puncak leher kiri ----
  p.moveTo(cx - neckW, neckTopY);

  // Bahu kiri
  p.lineTo(cx - shoulderX, shoulderY);

  // Tepi luar lengan kiri (turun)
  p.lineTo(cx - sleeveOutX, sleeveTopY);
  p.lineTo(cx - sleeveOutX, sleeveBotY);

  // Bawah lengan kiri → ketiak
  p.lineTo(cx - armholeX, armholeY);

  // Sisi badan kiri turun ke hem
  p.lineTo(cx - bodyTopX, armholeY + H * 0.01);
  p.lineTo(cx - bodyBotX, hemY);

  // Hem bawah
  p.lineTo(cx + bodyBotX, hemY);

  // Sisi badan kanan naik ke ketiak
  p.lineTo(cx + bodyTopX, armholeY + H * 0.01);
  p.lineTo(cx + armholeX, armholeY);

  // Bawah lengan kanan → tepi luar
  p.lineTo(cx + sleeveOutX, sleeveBotY);
  p.lineTo(cx + sleeveOutX, sleeveTopY);

  // Bahu kanan
  p.lineTo(cx + shoulderX, shoulderY);

  // Leher kanan
  p.lineTo(cx + neckW, neckTopY);

  // Kurva lubang leher (U-shape)
  p.quadraticCurveTo(cx, neckBotY + H * 0.02, cx - neckW, neckTopY);

  p.closePath();
  return p;
}

/** Rok A-line */
function pathRok(W, H) {
  const p  = new Path2D();
  const cx = W / 2;

  const waistY = H * 0.08;
  const waistW = W * 0.175;
  const hemY   = H * 0.92;
  const hemW   = W * 0.40;

  p.moveTo(cx - waistW, waistY);
  p.lineTo(cx + waistW, waistY);
  p.quadraticCurveTo(cx + hemW * 1.04, H * 0.52, cx + hemW, hemY);
  p.lineTo(cx - hemW, hemY);
  p.quadraticCurveTo(cx - hemW * 1.04, H * 0.52, cx - waistW, waistY);
  p.closePath();
  return p;
}

/**
 * Gamis (jubah panjang berlengan panjang) — proporsi wajar tampak depan.
 *
 * Struktur mirip kemeja tapi:
 *   - panjang sampai hampir bawah canvas
 *   - lengan panjang (full sleeve) sedikit melebar ke pergelangan
 *   - badan sedikit lebih longgar (flare ringan di bawah)
 */
function pathGamis(W, H) {
  const p  = new Path2D();
  const cx = W / 2;

  // --- Leher (U-neck) ---
  const neckW    = W * 0.075;
  const neckTopY = H * 0.08;
  const neckBotY = H * 0.135;

  // --- Bahu (titik puncak sebelum lengan) ---
  const shoulderX = W * 0.245;   // tidak terlalu lebar
  const shoulderY = H * 0.09;

  // --- Lengan panjang menyempit ke pergelangan ---
  // Ujung atas lengan (armscye / lubang lengan atas)
  const sleeveTipX  = W * 0.30;   // lebar lengan di bahu
  const sleeveTipY  = H * 0.095;

  // Pergelangan — lebih sempit
  const cuffOutX = W * 0.345;    // sisi luar pergelangan
  const cuffInX  = W * 0.295;    // sisi dalam pergelangan
  const cuffY    = H * 0.72;

  // --- Ketiak — melengkung masuk ---
  const armholeTopX = W * 0.265; // titik bawah lubang lengan (atas ketiak)
  const armholeTopY = H * 0.225;
  const armholeBotX = W * 0.235; // titik terdalam ketiak
  const armholeBotY = H * 0.265;

  // --- Badan ---
  const bodyTopX = W * 0.230;
  const bodyBotX = W * 0.305;   // flare ringan di hem
  const hemY     = H * 0.93;

  // === PATH KIRI ===
  p.moveTo(cx - neckW, neckTopY);

  // Leher → bahu kiri
  p.lineTo(cx - shoulderX, shoulderY);

  // Bahu → sisi luar lengan atas
  p.lineTo(cx - sleeveTipX, sleeveTipY);

  // Sisi LUAR lengan kiri turun → menyempit ke pergelangan
  p.bezierCurveTo(
    cx - sleeveTipX - W * 0.02, H * 0.32,   // ctrl 1: sedikit keluar dulu
    cx - cuffOutX,               H * 0.60,   // ctrl 2: mulai menyempit
    cx - cuffOutX,               cuffY        // ujung manset luar
  );

  // Manset bawah kiri
  p.lineTo(cx - cuffInX, cuffY + H * 0.018);

  // Sisi DALAM lengan kiri naik → ke ketiak
  p.bezierCurveTo(
    cx - cuffInX,    H * 0.58,   // ctrl 1
    cx - armholeTopX, H * 0.30,  // ctrl 2
    cx - armholeTopX, armholeTopY
  );

  // Kurva ketiak (lekukan masuk ke badan)
  p.quadraticCurveTo(
    cx - armholeBotX, armholeBotY,
    cx - bodyTopX,    armholeBotY + H * 0.01
  );

  // Sisi badan kiri turun ke hem (flare lembut)
  p.quadraticCurveTo(
    cx - bodyTopX * 1.1, H * 0.68,
    cx - bodyBotX, hemY
  );

  // Hem
  p.lineTo(cx + bodyBotX, hemY);

  // === PATH KANAN (mirror) ===
  p.quadraticCurveTo(
    cx + bodyTopX * 1.1, H * 0.68,
    cx + bodyTopX,    armholeBotY + H * 0.01
  );

  p.quadraticCurveTo(
    cx + armholeBotX, armholeBotY,
    cx + armholeTopX, armholeTopY
  );

  p.bezierCurveTo(
    cx + armholeTopX, H * 0.30,
    cx + cuffInX,     H * 0.58,
    cx + cuffInX,     cuffY + H * 0.018
  );

  p.lineTo(cx + cuffOutX, cuffY);

  p.bezierCurveTo(
    cx + cuffOutX,    H * 0.60,
    cx + sleeveTipX + W * 0.02, H * 0.32,
    cx + sleeveTipX,  sleeveTipY
  );

  p.lineTo(cx + shoulderX, shoulderY);
  p.lineTo(cx + neckW, neckTopY);

  // Kurva lubang leher U
  p.quadraticCurveTo(cx, neckBotY + H * 0.01, cx - neckW, neckTopY);

  p.closePath();
  return p;
}

/** Sarung — persegi panjang dengan garis kepala sarung */
function pathSarung(W, H) {
  const p    = new Path2D();
  const padX = W * 0.07;
  const padY = H * 0.05;
  p.rect(padX, padY, W - padX * 2, H - padY * 2);
  return p;
}

// ============================================================
// DETAIL / JAHITAN DEKORATIF
// ============================================================

function drawDetailKemeja(ctx, W, H) {
  const cx = W / 2;

  ctx.save();
  ctx.strokeStyle = ctx.strokeStyle; // inherit dari caller
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.globalAlpha = 0.55;

  // Garis kancing tengah
  ctx.beginPath();
  ctx.moveTo(cx, H * 0.165);
  ctx.lineTo(cx, H * 0.82);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  // Kancing
  ctx.fillStyle = ctx.strokeStyle;
  [0.28, 0.37, 0.46, 0.55].forEach(t => {
    ctx.beginPath();
    ctx.arc(cx, H * t, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawDetailRok(ctx, W, H) {
  const cx = W / 2;
  ctx.save();
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.globalAlpha = 0.5;

  // Garis pinggang
  ctx.beginPath();
  ctx.moveTo(cx - W * 0.175, H * 0.08);
  ctx.lineTo(cx + W * 0.175, H * 0.08);
  ctx.stroke();

  // Resleting
  ctx.beginPath();
  ctx.moveTo(cx, H * 0.08);
  ctx.lineTo(cx, H * 0.22);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawDetailGamis(ctx, W, H) {
  const cx = W / 2;
  ctx.save();
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.globalAlpha = 0.5;

  // Garis kancing tengah
  ctx.beginPath();
  ctx.moveTo(cx, H * 0.135);
  ctx.lineTo(cx, H * 0.93);
  ctx.stroke();

  // Garis yoke (di bawah ketiak)
  ctx.beginPath();
  ctx.moveTo(cx - W * 0.22, H * 0.27);
  ctx.lineTo(cx + W * 0.22, H * 0.27);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  ctx.fillStyle = ctx.strokeStyle;
  [0.165, 0.215, 0.265].forEach(t => {
    ctx.beginPath();
    ctx.arc(cx, H * t, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawDetailSarung(ctx, W, H) {
  const padX   = W * 0.07;
  const padY   = H * 0.05;
  const innerW = W - padX * 2;
  const stripeH = H * 0.11;

  ctx.save();
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.globalAlpha = 0.45;

  // Stripe kepala atas
  ctx.strokeRect(padX + 2, padY + 2, innerW - 4, stripeH);
  // Stripe kepala bawah
  ctx.strokeRect(padX + 2, H - padY - stripeH - 2, innerW - 4, stripeH);

  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  ctx.restore();
}
