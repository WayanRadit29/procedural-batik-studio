function drawCeplok(ctx, config) {
  const size = config.size || 90;
  const spacing = config.spacing || 25;

  const primaryColor = config.primaryColor || "#1F1B18";
  const secondaryColor = config.secondaryColor || "#F2E6C9";
  const accentColor = config.accentColor || "#D9B04A";

  const canvas = ctx.canvas;
  const step = size + spacing;

  for (let y = step / 2; y < canvas.height + step; y += step) {
    for (let x = step / 2; x < canvas.width + step; x += step) {
      drawCeplokMainTile(ctx, x, y, size, primaryColor, secondaryColor, accentColor);

      const fillerX = x + step / 2;
      const fillerY = y + step / 2;

      if (fillerX < canvas.width && fillerY < canvas.height) {
        drawCeplokDiamondFiller(ctx, fillerX, fillerY, size * 0.32, primaryColor, secondaryColor, accentColor);
      }
    }
  }
}

function drawCeplokMainTile(ctx, cx, cy, size, primaryColor, secondaryColor, accentColor) {
  const outerR = size * 0.45;
  const centerR = size * 0.13;

  ctx.save();
  ctx.translate(cx, cy);

  // frame luar 4 arah
  ctx.fillStyle = primaryColor;
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = Math.max(1.5, size * 0.025);

  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI * 2 * i) / 4;

    ctx.save();
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.ellipse(0, -outerR * 0.42, outerR * 0.42, outerR * 0.76, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  // ring luar
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = Math.max(2, size * 0.03);

  ctx.beginPath();
  ctx.arc(0, 0, outerR, 0, Math.PI * 2);
  ctx.stroke();

  // roset kelopak kecil
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8;
    const x = Math.cos(angle) * size * 0.22;
    const y = Math.sin(angle) * size * 0.22;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.fillStyle = secondaryColor;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = Math.max(1, size * 0.015);

    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.055, size * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  // pusat bunga
  ctx.fillStyle = accentColor;
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = Math.max(1.5, size * 0.02);

  ctx.beginPath();
  ctx.arc(0, 0, centerR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = primaryColor;

  ctx.beginPath();
  ctx.arc(0, 0, centerR * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // titik isen-isen di dalam tile
  ctx.fillStyle = accentColor;

  for (let i = 0; i < 16; i++) {
    const angle = (Math.PI * 2 * i) / 16;
    const x = Math.cos(angle) * size * 0.34;
    const y = Math.sin(angle) * size * 0.34;

    ctx.beginPath();
    ctx.arc(x, y, Math.max(1.4, size * 0.018), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawCeplokDiamondFiller(ctx, cx, cy, size, primaryColor, secondaryColor, accentColor) {
  ctx.save();
  ctx.translate(cx, cy);

  // diamond luar
  ctx.fillStyle = primaryColor;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = Math.max(1.5, size * 0.08);

  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size, 0);
  ctx.lineTo(0, size);
  ctx.lineTo(-size, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // diamond dalam
  ctx.fillStyle = secondaryColor;

  ctx.beginPath();
  ctx.moveTo(0, -size * 0.55);
  ctx.lineTo(size * 0.55, 0);
  ctx.lineTo(0, size * 0.55);
  ctx.lineTo(-size * 0.55, 0);
  ctx.closePath();
  ctx.fill();

  // titik tengah
  ctx.fillStyle = accentColor;

  ctx.beginPath();
  ctx.arc(0, 0, size * 0.18, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}