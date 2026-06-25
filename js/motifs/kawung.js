/**
 * drawKawung - Procedural Batik Kawung Generator (Sekar Ageng)
 *
 * Menggambar motif Batik Kawung secara prosedural pada seluruh canvas, ragam
 * "Sekar Ageng" yang kaya isen (paling rumit).
 *
 * Bentuk dasar Kawung = 4 oval lonjong-lancip (seperti biji aren) tersusun radial
 * mengelilingi satu pusat, menunjuk ke arah diagonal (45/135/225/315). Ujung tiap
 * oval ditarik panjang sampai MENYAMBUNG dengan oval motif tetangga, membentuk pola
 * jalinan rapat khas Kawung. Tiap oval diisi isen (oval ganda + deretan cecek),
 * pusat motif diberi roset, dan celah antar motif diberi ornamen bintang.
 *
 * Aturan Teknis Mandatori (Technical Design Brief):
 * - DILARANG memakai ctx.clearRect() di dalam fungsi ini.
 * - DILARANG menggambar background warna kain di dalam fungsi ini (tugas renderer).
 * - Perulangan grid X & Y otomatis memenuhi seluruh ukuran canvas.
 * - Memakai ctx.save() / ctx.restore() pada setiap iterasi motif.
 *
 * @param {CanvasRenderingContext2D} ctx - Konteks render Canvas 2D.
 * @param {Object} config - Konfigurasi motif.
 * @param {number} [config.size=130]        - Ukuran satu sel motif (jarak antar pusat).
 * @param {number} [config.spacing]         - Jarak grid. Default: sama dengan size.
 * @param {string} [config.color="#D4A373"] - Warna garis oval.
 * @param {number} [config.lineWidth=2.5]   - Ketebalan garis.
 * @param {string} [config.accentColor]     - Warna isen. Default: sama dgn color.
 * @param {number} [config.jitter=0.6]      - Efek torehan canting batik tulis (0 = rapi presisi).
 */
function drawKawung(ctx, config) {
  config = config || {};

  // --- Resolusi parameter (semua punya nilai default) ---
  const size = config.size !== undefined ? config.size : 130;
  const spacing = config.spacing !== undefined ? config.spacing : size;
  const color = config.color !== undefined ? config.color : "#D4A373";
  const lineWidth = config.lineWidth !== undefined ? config.lineWidth : 2.5;
  const accentColor = config.accentColor !== undefined ? config.accentColor : color;
  const jitterAmount = config.jitter !== undefined ? config.jitter : 0.6;

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  // Panjang oval diikat ke spacing supaya ujung selalu menyambung motif tetangga.
  const a = spacing * 0.37; // setengah panjang oval (ujung dalam di pusat, ujung luar 2a)
  const b = a * 0.42;       // setengah lebar oval (lonjong-lancip)
  const isenColor = accentColor;

  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Gambar satu oval lancip dari (0,0) ke (2L,0) dengan lebar W (di frame lokal).
  function pointedOval(L, W) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(L, W, 2 * L, 0);
    ctx.quadraticCurveTo(L, -W, 0, 0);
  }

  const start = -spacing;
  const endX = width + spacing;
  const endY = height + spacing;

  for (let cx = start; cx < endX; cx += spacing) {
    for (let cy = start; cy < endY; cy += spacing) {
      const cellSeed = Math.abs(Math.sin(cx * 12.9898 + cy * 78.233)) * 43758.5453;

      ctx.save();
      ctx.translate(cx, cy); // origin = pusat sel grid

      // ============ 4 OVAL LANCIP + ISEN DI DALAMNYA ============
      const angles = [45, 135, 225, 315];
      for (let i = 0; i < angles.length; i++) {
        ctx.save();
        ctx.rotate((angles[i] * Math.PI) / 180);

        // Jitter torehan canting (kecil) → kesan batik tulis.
        const petalSeed = cellSeed + i * 56.7;
        const jb = b + (seededRandom(petalSeed) - 0.5) * jitterAmount;

        // Garis luar oval.
        pointedOval(a, jb);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        // Isen: oval ganda (garis dalam konsentris) → kerapatan visual.
        ctx.save();
        ctx.translate(a * 0.35, 0);
        pointedOval(a * 0.65, jb * 0.62);
        ctx.strokeStyle = isenColor;
        ctx.lineWidth = Math.max(1, lineWidth * 0.6);
        ctx.stroke();
        ctx.restore();

        // Isen: deretan cecek (titik) sepanjang sumbu oval.
        const dotR = Math.max(1.4, size * 0.016);
        ctx.fillStyle = isenColor;
        ctx.beginPath();
        ctx.arc(a * 0.62, 0, dotR, 0, 2 * Math.PI);
        ctx.arc(a, 0, dotR * 1.25, 0, 2 * Math.PI);     // biji utama (sedikit besar)
        ctx.arc(a * 1.38, 0, dotR, 0, 2 * Math.PI);
        ctx.fill();

        // Sepasang cecek di sisi atas-bawah tengah oval.
        ctx.beginPath();
        ctx.arc(a, jb * 0.5, dotR * 0.8, 0, 2 * Math.PI);
        ctx.arc(a, -jb * 0.5, dotR * 0.8, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
      }

      // ============ ROSET DI PUSAT MOTIF ============
      ctx.strokeStyle = isenColor;
      ctx.fillStyle = isenColor;
      ctx.lineWidth = Math.max(1, lineWidth * 0.8);

      const rRose = size * 0.085;
      ctx.beginPath();
      ctx.arc(0, 0, rRose, 0, 2 * Math.PI);          // lingkaran roset
      ctx.stroke();
      ctx.beginPath();                                // 4 cecek mengelilingi
      const g = rRose * 0.55;
      ctx.arc(-g, 0, rRose * 0.22, 0, 2 * Math.PI);
      ctx.arc(g, 0, rRose * 0.22, 0, 2 * Math.PI);
      ctx.arc(0, -g, rRose * 0.22, 0, 2 * Math.PI);
      ctx.arc(0, g, rRose * 0.22, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();                                // titik pusat
      ctx.arc(0, 0, rRose * 0.28, 0, 2 * Math.PI);
      ctx.fill();

      // ============ ORNAMEN BINTANG DI CELAH ANTAR MOTIF ============
      // Di titik temu lurus (kanan & bawah pusat), tempat oval antar baris/kolom bertemu.
      const gaps = [
        [spacing / 2, 0],
        [0, spacing / 2],
      ];
      const armLong = size * 0.07;
      const armShort = size * 0.028;
      for (let k = 0; k < gaps.length; k++) {
        ctx.save();
        ctx.translate(gaps[k][0], gaps[k][1]);
        ctx.beginPath();
        for (let s = 0; s < 4; s++) {
          const t = (s * Math.PI) / 2;
          const tn = t + Math.PI / 4;
          ctx.lineTo(Math.cos(t) * armLong, Math.sin(t) * armLong);
          ctx.lineTo(Math.cos(tn) * armShort, Math.sin(tn) * armShort);
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = isenColor;
        ctx.lineWidth = Math.max(1, lineWidth * 0.6);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, armShort * 0.5, 0, 2 * Math.PI);
        ctx.fillStyle = isenColor;
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    }
  }
}
