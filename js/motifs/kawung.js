/**
 * drawKawung - Procedural Batik Kawung Generator
 * Fulfills Infobatik's "8 Ragam Motif Batik Kawung" classification.
 * 
 * Aturan Teknis Mandatori:
 * - DILARANG menggunakan ctx.clearRect() di dalam fungsi ini.
 * - DILARANG menggambar background warna kain di dalam fungsi ini.
 * - Perulangan Grid X dan Y berjalan secara otomatis untuk memenuhi seluruh ukuran canvas.
 * - Menggunakan ctx.save() dan ctx.restore() pada setiap iterasi motif.
 * - Menggambar secara prosedural memanfaatkan matematika koordinat Canvas.
 * 
 * @param {CanvasRenderingContext2D} ctx - HTML5 Canvas 2D Rendering Context
 * @param {Object} config - Motif Configuration Object
 * @param {number} config.size - Ukuran/panjang (diameter) motif Kawung
 * @param {number} config.spacing - Jarak perulangan grid (X & Y spacing)
 * @param {string} config.subType - "picis" (atau "beton"), "bribil" ("sen"), "sekar_ageng", "sari" ("kopi"), "semar", "buntal", "kembang"
 * @param {number} [config.lineWidth=2] - Ketebalan garis
 * @param {string} [config.color="#D4A373"] - Warna utama motif
 * @param {string} [config.accentColor="#E76F51"] - Warna aksen isen-isen
 * @param {boolean} [config.showIsen=true] - Toggle isen-isen di dalam kelopak
 * @param {boolean} [config.showSela=true] - Toggle isen-isen sela-sela antar grid
 * @param {number} [config.jitter=0.5] - Efek ketidaksempurnaan alami canting batik tulis (0 hingga 5)
 * @param {boolean} [config.showCrackle=true] - Toggle filter retakan malam lilin batik
 * @param {string} [config.crackleColor="rgba(62, 39, 35, 0.4)"] - Warna rembesan malam retak
 */
function drawKawung(ctx, config) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  // Resolusi fallback parameter konfigurasi
  const size = config.size !== undefined ? config.size : 60;
  const spacing = config.spacing !== undefined ? config.spacing : 60;
  const subType = config.subType !== undefined ? config.subType : "picis";
  const lineWidth = config.lineWidth !== undefined ? config.lineWidth : 2;
  const color = config.color !== undefined ? config.color : "#D4A373";
  const accentColor = config.accentColor !== undefined ? config.accentColor : "#E76F51";
  const showIsen = config.showIsen !== undefined ? config.showIsen : true;
  const showSela = config.showSela !== undefined ? config.showSela : true;
  const jitterAmount = config.jitter !== undefined ? config.jitter : 0.5;

  // Generator angka acak deterministik berbasis koordinat agar tampilan 'tulis' stabil (tidak flicker)
  function getSeededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Rentang perulangan Grid X dan Y meluas sedikit di luar canvas agar tidak terpotong di tepi
  const startCol = -Math.ceil(spacing);
  const endCol = width + Math.ceil(spacing);
  const startRow = -Math.ceil(spacing);
  const endRow = height + Math.ceil(spacing);

  for (let cx = startCol; cx < endCol; cx += spacing) {
    for (let cy = startRow; cy < endRow; cy += spacing) {
      // Seed unik untuk setiap koordinat grid cell
      const cellSeed = Math.abs(Math.sin(cx * 12.9898 + cy * 78.233)) * 43758.5453;

      ctx.save();
      ctx.translate(cx, cy); // Pindahkan origin keas tengah sel grid

      // Menghitung rasio lebar kelopak (semi-minor axis) berdasarkan subType
      let yRatio = 0.5; // default
      switch (subType) {
        case "picis":
        case "beton":
          yRatio = 0.52; // Elips simetris standar koin picis
          break;
        case "bribil":
        case "sen":
          yRatio = 0.72; // Bulat lebar/rapat membentuk jalinan erat
          break;
        case "sekar_ageng":
          yRatio = 0.82; // Melebar, hampir bujur sangkar untuk isen cecek sawut
          break;
        case "sari":
        case "kopi":
          yRatio = 0.38; // Lonjong ramping mirip belahan biji kopi
          break;
        case "semar":
          yRatio = 0.62; // Ruang kelopak besar untuk melingkupi elips dalam (layering)
          break;
        case "buntal":
          yRatio = 0.55; // Porsi ideal dengan pusat berdekorasi bunga
          break;
        case "kembang":
          yRatio = 0.58; // Gaya kembang
          break;
      }

      const semimajor = size / 4;          // Jari-jari panjang elips kelopak (seperempat dari total size)
      const semiminor = semimajor * yRatio; // Jari-jari pendek kelopak menyesuaikan tipe kawung

      // Menggambar 4 kelopak elips simetris secara radial (tilted 45 derajat)
      const angles = [45, 135, 225, 315];
      angles.forEach((angle, idx) => {
        const petalSeed = cellSeed + idx * 56.7;

        ctx.save();
        ctx.rotate((angle * Math.PI) / 180); // Rotasi ke arah diagonal sudut kelopak

        // Efek ketidaksempurnaan torehan canting manual (jitter tulis)
        const jX = (getSeededRandom(petalSeed) - 0.5) * jitterAmount;
        const jY = (getSeededRandom(petalSeed + 1.2) - 0.5) * jitterAmount;
        const jSemiMajor = (getSeededRandom(petalSeed + 2.4) - 0.5) * (jitterAmount * 0.5);
        const jSemiMinor = (getSeededRandom(petalSeed + 3.6) - 0.5) * (jitterAmount * 0.5);

        // --- DRAW KELOPAK ELIPS ---
        // Basis kelopak bersandar di titik (0,0), ditarik sejauh semimajor ke arah +X (koordinat lokal setelah rotasi)
        ctx.beginPath();
        ctx.ellipse(
          semimajor + jX,
          0 + jY,
          semimajor + jSemiMajor,
          semiminor + jSemiMinor,
          0,
          0,
          2 * Math.PI
        );
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        // --- DRAW ISEN-ISEN KELOPAK ---
        if (showIsen) {
          ctx.save();
          ctx.strokeStyle = accentColor;
          ctx.fillStyle = accentColor;
          ctx.lineWidth = Math.max(1, lineWidth * 0.75);

          switch (subType) {
            case "picis":
            case "beton": {
              // Isen koin kecil atau biji beton di dalam kelopak
              const circleX = semimajor * 1.1;
              const radius = semimajor * 0.25;
              ctx.beginPath();
              ctx.arc(circleX, 0, radius, 0, 2 * Math.PI);
              ctx.stroke();

              ctx.beginPath();
              ctx.arc(circleX, 0, radius * 0.35, 0, 2 * Math.PI);
              ctx.fill();
              break;
            }

            case "bribil":
            case "sen": {
              // Bribil/Sen: Elips ganda kosentris di dalam untuk kerapatan visual coin
              ctx.beginPath();
              ctx.ellipse(
                semimajor + jX,
                0 + jY,
                (semimajor + jSemiMajor) * 0.75,
                (semiminor + jSemiMinor) * 0.72,
                0,
                0,
                2 * Math.PI
              );
              ctx.stroke();
              break;
            }

            case "sekar_ageng": {
              // Cecek Sawut: 3 garis menyebar (sawut) dan 3 titik (cecek) di ujung kelopak
              const pxStart = semimajor * 0.5;
              const pxEnd = semimajor * 1.6;

              // Garis tengah sawut
              ctx.beginPath();
              ctx.moveTo(pxStart, 0);
              ctx.lineTo(pxEnd, 0);
              ctx.stroke();

              // Garis sawut melengkung atas
              ctx.beginPath();
              ctx.moveTo(pxStart, semiminor * 0.1);
              ctx.quadraticCurveTo(semimajor * 1.0, semiminor * 0.45, pxEnd - 4, semiminor * 0.45);
              ctx.stroke();

              // Garis sawut melengkung bawah
              ctx.beginPath();
              ctx.moveTo(pxStart, -semiminor * 0.1);
              ctx.quadraticCurveTo(semimajor * 1.0, -semiminor * 0.45, pxEnd - 4, -semiminor * 0.45);
              ctx.stroke();

              // 3 Cecek sawut (titik-titik estetis di tepi kelopak)
              const dotRadius = Math.max(1.5, size * 0.025);
              ctx.beginPath();
              ctx.arc(semimajor * 0.8, semiminor * 0.65, dotRadius, 0, 2 * Math.PI);
              ctx.arc(semimajor * 0.8, -semiminor * 0.65, dotRadius, 0, 2 * Math.PI);
              ctx.arc(semimajor * 0.4, 0, dotRadius, 0, 2 * Math.PI);
              ctx.fill();
              break;
            }

            case "sari":
            case "kopi": {
              // Sari/Kopi: Garis belahan tengah (cleft) pembelah kelopak seperti biji kopi pecah
              const lineYOffset = Math.max(0.7, size * 0.015);
              const padding = semimajor * 0.15;
              
              ctx.beginPath();
              // Belahan atas
              ctx.moveTo(padding, -lineYOffset);
              ctx.lineTo(semimajor * 2 - padding, -lineYOffset);
              // Belahan bawah
              ctx.moveTo(padding, lineYOffset);
              ctx.lineTo(semimajor * 2 - padding, lineYOffset);
              ctx.stroke();

              // Tambahan cecek penyeimbang
              const dotRad = Math.max(1.5, size * 0.02);
              ctx.beginPath();
              ctx.arc(semimajor, semiminor * 0.5, dotRad, 0, 2 * Math.PI);
              ctx.arc(semimajor, -semiminor * 0.5, dotRad, 0, 2 * Math.PI);
              ctx.fill();
              break;
            }

            case "semar": {
              // Layering di dalam kelopak: Elips kosentris kecil diisi deretan titik (cecek)
              ctx.beginPath();
              ctx.ellipse(
                semimajor + jX,
                0 + jY,
                (semimajor + jSemiMajor) * 0.6,
                (semiminor + jSemiMinor) * 0.55,
                0,
                0,
                2 * Math.PI
              );
              ctx.stroke();

              // Deretan cecek di sepanjang garis sumbu mayor
              const dotRad = Math.max(1.2, size * 0.018);
              ctx.beginPath();
              ctx.arc(semimajor * 0.65, 0, dotRad, 0, 2 * Math.PI);
              ctx.arc(semimajor * 1.0, 0, dotRad, 0, 2 * Math.PI);
              ctx.arc(semimajor * 1.35, 0, dotRad, 0, 2 * Math.PI);
              ctx.fill();
              break;
            }

            case "buntal": {
              // Isen berbentuk garis-garis tulang daun (kombinasi floral)
              const len = semimajor * 1.7;
              ctx.beginPath();
              ctx.moveTo(semimajor * 0.2, 0);
              ctx.lineTo(len, 0);
              ctx.stroke();

              for (let i = 1; i <= 3; i++) {
                const vx = semimajor * 0.4 * i;
                const vy = semiminor * 0.22 * i;
                // Sirip atas
                ctx.beginPath();
                ctx.moveTo(vx, 0);
                ctx.lineTo(vx + semimajor * 0.15, vy);
                ctx.stroke();
                // Sirip bawah
                ctx.beginPath();
                ctx.moveTo(vx, 0);
                ctx.lineTo(vx + semimajor * 0.15, -vy);
                ctx.stroke();
              }
              break;
            }

            case "kembang": {
              // Menggambar pola gelombang spiral asimetris penanda kembang kuncup
              ctx.beginPath();
              ctx.moveTo(semimajor * 0.3, 0);
              ctx.bezierCurveTo(
                semimajor * 0.7, semiminor * 0.8,
                semimajor * 1.3, -semiminor * 0.8,
                semimajor * 1.7, 0
              );
              ctx.stroke();

              ctx.beginPath();
              ctx.arc(semimajor, 0, semimajor * 0.25, 0, Math.PI, true);
              ctx.stroke();
              
              const dotRad = Math.max(1.5, size * 0.02);
              ctx.beginPath();
              ctx.arc(semimajor * 0.8, -semiminor * 0.35, dotRad, 0, 2 * Math.PI);
              ctx.arc(semimajor * 1.2, semiminor * 0.35, dotRad, 0, 2 * Math.PI);
              ctx.fill();
              break;
            }
          }
          ctx.restore();
        }

        ctx.restore();
      });

      // --- MENGGAMBAR ELEMEN PUSAT DI (0,0) SEL ---
      ctx.save();
      ctx.strokeStyle = accentColor;
      ctx.fillStyle = accentColor;
      ctx.lineWidth = lineWidth * 0.8;

      switch (subType) {
        case "picis":
        case "beton": {
          // Kotak as tengah berpasangan dengan salib pembelah
          const sq = Math.max(4, size * 0.08);
          ctx.beginPath();
          ctx.rect(-sq, -sq, sq * 2, sq * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-sq * 1.5, 0);
          ctx.lineTo(sq * 1.5, 0);
          ctx.moveTo(0, -sq * 1.5);
          ctx.lineTo(0, sq * 1.5);
          ctx.stroke();

          // 4 Cecek di pojok kotak tengah
          const rDot = Math.max(1.2, size * 0.015);
          ctx.beginPath();
          ctx.arc(-sq * 0.7, -sq * 0.7, rDot, 0, 2 * Math.PI);
          ctx.arc(sq * 0.7, -sq * 0.7, rDot, 0, 2 * Math.PI);
          ctx.arc(-sq * 0.7, sq * 0.7, rDot, 0, 2 * Math.PI);
          ctx.arc(sq * 0.7, sq * 0.7, rDot, 0, 2 * Math.PI);
          ctx.fill();
          break;
        }

        case "bribil":
        case "sen": {
          // Pusat lingkaran berlapis ring konsentris (seperti koin sen)
          const rMain = size * 0.09;
          ctx.beginPath();
          ctx.arc(0, 0, rMain, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, rMain * 0.5, 0, 2 * Math.PI);
          ctx.fill();
          break;
        }

        case "sekar_ageng": {
          // Rosette besar berlapis dengan cecekan mengitari internal pusat
          const radialDist = size * 0.11;
          ctx.beginPath();
          ctx.arc(0, 0, radialDist, 0, 2 * Math.PI);
          ctx.stroke();

          ctx.beginPath();
          const dGap = radialDist * 0.55;
          ctx.arc(-dGap, 0, dGap * 0.4, 0, 2 * Math.PI);
          ctx.arc(dGap, 0, dGap * 0.4, 0, 2 * Math.PI);
          ctx.arc(0, -dGap, dGap * 0.4, 0, 2 * Math.PI);
          ctx.arc(0, dGap, dGap * 0.4, 0, 2 * Math.PI);
          ctx.fill();
          break;
        }

        case "sari":
        case "kopi": {
          // Diamond geometris pusat simetrik
          const dim = Math.max(3, size * 0.06);
          ctx.beginPath();
          ctx.moveTo(0, -dim * 1.5);
          ctx.lineTo(dim * 1.5, 0);
          ctx.lineTo(0, dim * 1.5);
          ctx.lineTo(-dim * 1.5, 0);
          ctx.closePath();
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, dim * 0.6, 0, 2 * Math.PI);
          ctx.fill();
          break;
        }

        case "semar": {
          // Konsentris ring cecek
          ctx.beginPath();
          ctx.arc(0, 0, size * 0.1, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, size * 0.05, 0, 2 * Math.PI);
          ctx.fill();
          break;
        }

        case "buntal": {
          // Buntal: Bunga as roda 8 titik kembang cantik
          const petalsCount = 8;
          const outerR = size * 0.13;
          const innerR = size * 0.05;
          
          ctx.beginPath();
          for (let p = 0; p < petalsCount; p++) {
            const rotA = (p * 2 * Math.PI) / petalsCount;
            const nextRotA = ((p + 0.5) * 2 * Math.PI) / petalsCount;
            ctx.lineTo(Math.cos(rotA) * outerR, Math.sin(rotA) * outerR);
            ctx.lineTo(Math.cos(nextRotA) * innerR, Math.sin(nextRotA) * innerR);
          }
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, innerR * 0.7, 0, 2 * Math.PI);
          ctx.fillStyle = accentColor;
          ctx.fill();
          break;
        }

        case "kembang": {
          // Pola rotasi pusaran baling-baling kembang asimetris
          const rCore = size * 0.08;
          for (let p = 0; p < 4; p++) {
            const rotAngle = (p * Math.PI) / 2;
            ctx.beginPath();
            ctx.arc(0, 0, rCore, rotAngle, rotAngle + Math.PI / 2);
            ctx.quadraticCurveTo(
              Math.cos(rotAngle + Math.PI / 4) * rCore * 1.8,
              Math.sin(rotAngle + Math.PI / 4) * rCore * 1.8,
              Math.cos(rotAngle + Math.PI / 2) * rCore,
              Math.sin(rotAngle + Math.PI / 2) * rCore
            );
            ctx.strokeStyle = accentColor;
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(0, 0, rCore * 0.45, 0, 2 * Math.PI);
          ctx.fill();
          break;
        }
      }
      ctx.restore();

      // --- MENGGAMBAR ORNAMEN SELA-SELA GRID DI KANAN SEBELAH BAWAH (cx + S/2, cy + S/2) ---
      if (showSela) {
        ctx.save();
        ctx.translate(spacing / 2, spacing / 2); // Origin ditranslasikan ke pusat celah diagonal antar 4 sel
        
        const selaSeed = cellSeed + 999.3;
        const jSelaX = (getSeededRandom(selaSeed) - 0.5) * (jitterAmount * 0.8);
        const jSelaY = (getSeededRandom(selaSeed + 1.5) - 0.5) * (jitterAmount * 0.8);
        ctx.translate(jSelaX, jSelaY);

        ctx.strokeStyle = accentColor;
        ctx.fillStyle = accentColor;
        ctx.lineWidth = Math.max(1, lineWidth * 0.75);

        switch (subType) {
          case "buntal": {
            // Kombinasi karangan bunga melingkar (daisy di sela grid)
            const rCenter = size * 0.07;
            const rPetal = size * 0.035;
            
            for (let i = 0; i < 6; i++) {
              const ang = (i * Math.PI) / 3;
              ctx.beginPath();
              ctx.arc(Math.cos(ang) * (rCenter + rPetal * 0.4), Math.sin(ang) * (rCenter + rPetal * 0.4), rPetal, 0, 2 * Math.PI);
              ctx.stroke();
              ctx.fillStyle = color;
              ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(0, 0, rCenter, 0, 2 * Math.PI);
            ctx.fillStyle = accentColor;
            ctx.fill();
            ctx.stroke();
            break;
          }

          case "picis":
          case "beton": {
            // Diamond sela picis dengan cecek di dalam
            const dSize = size * 0.09;
            ctx.beginPath();
            ctx.moveTo(0, -dSize);
            ctx.lineTo(dSize, 0);
            ctx.lineTo(0, dSize);
            ctx.lineTo(-dSize, 0);
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, dSize * 0.35, 0, 2 * Math.PI);
            ctx.fill();
            break;
          }

          case "sekar_ageng": {
            // Gap cikal bintang 4 arah tajam
            const armLong = size * 0.16;
            const armShort = size * 0.055;
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
              const theta = (i * Math.PI) / 2;
              const thetaNext = theta + Math.PI / 4;
              ctx.lineTo(Math.cos(theta) * armLong, Math.sin(theta) * armLong);
              ctx.lineTo(Math.cos(thetaNext) * armShort, Math.sin(thetaNext) * armShort);
            }
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, armShort * 0.6, 0, 2 * Math.PI);
            ctx.fillStyle = accentColor;
            ctx.fill();
            break;
          }

          case "sari":
          case "kopi": {
            // Cluster cecek sela
            const dotR = Math.max(1.5, size * 0.02);
            ctx.beginPath();
            ctx.arc(0, 0, dotR * 1.5, 0, 2 * Math.PI);
            ctx.fill();

            const dOffset = size * 0.08;
            ctx.beginPath();
            ctx.arc(-dOffset, 0, dotR * 0.8, 0, 2 * Math.PI);
            ctx.arc(dOffset, 0, dotR * 0.8, 0, 2 * Math.PI);
            ctx.arc(0, -dOffset, dotR * 0.8, 0, 2 * Math.PI);
            ctx.arc(0, dOffset, dotR * 0.8, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            break;
          }

          case "semar": {
            // Salib pembelah dengan cecek sela bulat di ujung lengan
            const arm = size * 0.11;
            const dotR = Math.max(1.5, size * 0.022);
            
            ctx.beginPath();
            ctx.moveTo(-arm, 0);
            ctx.lineTo(arm, 0);
            ctx.moveTo(0, -arm);
            ctx.lineTo(0, arm);
            ctx.strokeStyle = color;
            ctx.stroke();

            ctx.fillStyle = accentColor;
            ctx.beginPath();
            ctx.arc(-arm, 0, dotR, 0, 2 * Math.PI);
            ctx.arc(arm, 0, dotR, 0, 2 * Math.PI);
            ctx.arc(0, -arm, dotR, 0, 2 * Math.PI);
            ctx.arc(0, arm, dotR, 0, 2 * Math.PI);
            ctx.arc(0, 0, dotR * 1.2, 0, 2 * Math.PI);
            ctx.fill();
            break;
          }

          case "kembang": {
            // Windmill putar mini daun sela kembang
            const rWind = size * 0.13;
            ctx.save();
            for (let i = 0; i < 4; i++) {
              ctx.rotate(Math.PI / 2);
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.quadraticCurveTo(rWind * 0.4, -rWind * 0.5, rWind, 0);
              ctx.quadraticCurveTo(rWind * 0.5, rWind * 0.1, 0, 0);
              ctx.stroke();
              ctx.fillStyle = color;
              ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(0, 0, rWind * 0.22, 0, 2 * Math.PI);
            ctx.fillStyle = accentColor;
            ctx.fill();
            ctx.restore();
            break;
          }

          default: {
            // Default bribil: diamond sederhana
            const rDiamond = size * 0.07;
            ctx.beginPath();
            ctx.moveTo(0, -rDiamond);
            ctx.lineTo(rDiamond, 0);
            ctx.lineTo(0, rDiamond);
            ctx.lineTo(-rDiamond, 0);
            ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, rDiamond * 0.4, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      ctx.restore();
    }
  }

  // --- RETAKAN MALAM (WAX CRACKLE TEXTURE) ---
  if (config.showCrackle) {
    ctx.save();
    // Warna malam rembes kecoklatan/gelap khas sisa pembakaran
    ctx.strokeStyle = config.crackleColor !== undefined ? config.crackleColor : "rgba(62, 39, 35, 0.4)";
    ctx.lineWidth = 0.6;

    let randomVal = 0.771;
    function deterministicRand() {
      const x = Math.sin(randomVal++) * 10000;
      return x - Math.floor(x);
    }

    const xNodes = 5;
    const yNodes = 5;
    const xStep = width / xNodes;
    const yStep = height / yNodes;

    for (let i = 0; i < xNodes + 1; i++) {
      for (let j = 0; j < yNodes + 1; j++) {
        if (deterministicRand() > 0.65) {
          ctx.beginPath();
          let cxCur = i * xStep + (deterministicRand() - 0.5) * 50;
          let cyCur = j * yStep + (deterministicRand() - 0.5) * 50;
          ctx.moveTo(cxCur, cyCur);

          // Brownian walk sim untuk alur retakan alami lilin (malam) pecah
          const steps = 4 + Math.floor(deterministicRand() * 5);
          for (let s = 0; s < steps; s++) {
            const angle = deterministicRand() * 2 * Math.PI;
            const dist = 15 + deterministicRand() * 35;
            cxCur += Math.cos(angle) * dist;
            cyCur += Math.sin(angle) * dist;
            ctx.lineTo(cxCur, cyCur);
          }
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }
}
