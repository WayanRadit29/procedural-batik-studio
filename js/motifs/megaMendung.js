function drawMegaMendung(ctx, config) {
	const size = config.size !== undefined ? config.size : 80;
	const spacing = config.spacing !== undefined ? config.spacing : 40;
	const primaryColor = config.primaryColor || "#003366";
	const secondaryColor = config.secondaryColor || "#66A3FF";
	const cloudType = config.cloudType || "classic";
	const layers = Math.max(1, Math.floor(config.layers || 5));
	const rotation = config.rotation !== undefined ? config.rotation : 0;
	const waveIntensity = clamp(config.waveIntensity !== undefined ? config.waveIntensity : 0.5, 0, 1);

	const width = ctx.canvas.width;
	const height = ctx.canvas.height;
	const step = Math.max(12, size + spacing);
	const baseRotation = (rotation * Math.PI) / 180;

	for (let y = -step; y <= height + step; y += step) {
		for (let x = -step; x <= width + step; x += step) {
			drawMegaCloud(ctx, x, y, size, layers, primaryColor, secondaryColor, cloudType, baseRotation, waveIntensity);
		}
	}
}

function drawMegaCloud(ctx, x, y, size, layers, primaryColor, secondaryColor, cloudType, rotation, waveIntensity) {
	const centerX = x + size * 0.5;
	const centerY = y + size * 0.5;
	const layerStep = layers > 1 ? 1 / (layers - 1) : 1;

	for (let i = 0; i < layers; i++) {
		const t = i * layerStep;
		const layerScale = 1 - t * 0.28;
		const inset = size * 0.06 * i;
		const layerRotation = rotation + (cloudType === "spiral" ? t * (0.8 + waveIntensity) : 0);
		const color = i % 2 === 0 ? primaryColor : secondaryColor;
		const strokeWidth = Math.max(1.4, size * (0.03 - t * 0.007));

		ctx.save();
		ctx.translate(centerX, centerY);
		ctx.rotate(layerRotation);
		ctx.scale(layerScale, layerScale);
		ctx.translate(0, inset * 0.25);

		ctx.strokeStyle = color;
		ctx.fillStyle = "transparent";
		ctx.lineWidth = strokeWidth;
		ctx.lineJoin = "round";
		ctx.lineCap = "round";

		switch (cloudType) {
			case "sharp":
				drawSharpCloud(ctx, size, waveIntensity, t);
				break;
			case "round":
				drawRoundCloud(ctx, size, waveIntensity, t);
				break;
			case "spiral":
				drawSpiralCloud(ctx, size, waveIntensity, t);
				break;
			default:
				drawClassicCloud(ctx, size, waveIntensity, t);
				break;
		}

		ctx.restore();
	}
}

function drawClassicCloud(ctx, size, waveIntensity, layerT) {
	const radius = size * (0.42 - layerT * 0.02);
	const bump = radius * (0.48 + waveIntensity * 0.22);
	const sideLift = radius * (0.28 + waveIntensity * 0.08);

	ctx.beginPath();
	ctx.moveTo(-radius * 0.95, 0);
	ctx.bezierCurveTo(-radius * 0.95, -sideLift, -radius * 0.72, -bump, -radius * 0.26, -bump * 0.94);
	ctx.quadraticCurveTo(0, -bump * 1.18, radius * 0.26, -bump * 0.94);
	ctx.bezierCurveTo(radius * 0.72, -bump, radius * 0.95, -sideLift, radius * 0.95, 0);
	ctx.quadraticCurveTo(radius * 1.02, bump * 0.52, radius * 0.6, bump * 0.88);
	ctx.bezierCurveTo(radius * 0.36, bump * 1.12, -radius * 0.36, bump * 1.12, -radius * 0.6, bump * 0.88);
	ctx.quadraticCurveTo(-radius * 1.02, bump * 0.52, -radius * 0.95, 0);
	ctx.stroke();
}

function drawSharpCloud(ctx, size, waveIntensity, layerT) {
	const radius = size * (0.41 - layerT * 0.018);
	const peak = radius * (0.7 + waveIntensity * 0.35);
	const waist = radius * (0.18 + waveIntensity * 0.08);

	ctx.beginPath();
	ctx.moveTo(-radius * 0.95, 0);
	ctx.bezierCurveTo(-radius * 0.9, -waist, -radius * 0.9, -peak * 0.7, -radius * 0.48, -peak);
	ctx.bezierCurveTo(-radius * 0.22, -peak * 0.45, -radius * 0.1, -peak * 0.95, 0, -peak * 1.05);
	ctx.bezierCurveTo(radius * 0.1, -peak * 0.95, radius * 0.22, -peak * 0.45, radius * 0.48, -peak);
	ctx.bezierCurveTo(radius * 0.9, -peak * 0.7, radius * 0.9, -waist, radius * 0.95, 0);
	ctx.quadraticCurveTo(radius * 0.58, peak * 0.65, radius * 0.22, peak * 0.98);
	ctx.lineTo(0, peak * 1.12);
	ctx.lineTo(-radius * 0.22, peak * 0.98);
	ctx.quadraticCurveTo(-radius * 0.58, peak * 0.65, -radius * 0.95, 0);
	ctx.stroke();
}

function drawRoundCloud(ctx, size, waveIntensity, layerT) {
	const radius = size * (0.4 - layerT * 0.018);
	const lobe = radius * (0.62 + waveIntensity * 0.1);
	const lower = radius * (0.48 + waveIntensity * 0.14);

	ctx.beginPath();
	ctx.moveTo(-radius * 0.9, 0);
	ctx.quadraticCurveTo(-radius * 0.95, -radius * 0.3, -radius * 0.62, -lobe * 0.9);
	ctx.bezierCurveTo(-radius * 0.3, -lobe * 1.12, -radius * 0.08, -lobe * 1.18, 0, -lobe * 1.08);
	ctx.bezierCurveTo(radius * 0.08, -lobe * 1.18, radius * 0.3, -lobe * 1.12, radius * 0.62, -lobe * 0.9);
	ctx.quadraticCurveTo(radius * 0.95, -radius * 0.3, radius * 0.9, 0);
	ctx.bezierCurveTo(radius * 0.78, lower * 0.62, radius * 0.42, lower * 1.06, 0, lower * 1.12);
	ctx.bezierCurveTo(-radius * 0.42, lower * 1.06, -radius * 0.78, lower * 0.62, -radius * 0.9, 0);
	ctx.stroke();
}

function drawSpiralCloud(ctx, size, waveIntensity, layerT) {
	const radius = size * (0.41 - layerT * 0.016);
	const curl = radius * (0.18 + waveIntensity * 0.1);
	const outer = radius * (0.68 + waveIntensity * 0.16);

	ctx.beginPath();
	ctx.moveTo(-radius * 0.92, 0.02 * radius);
	ctx.bezierCurveTo(-radius * 0.96, -radius * 0.2, -radius * 0.72, -outer, -radius * 0.18, -outer * 0.98);
	ctx.bezierCurveTo(radius * 0.18, -outer * 0.9, radius * 0.5, -outer * 0.7, radius * 0.72, -radius * 0.3);
	ctx.bezierCurveTo(radius * 0.96, -radius * 0.02, radius * 0.82, radius * 0.34, radius * 0.54, radius * 0.58);
	ctx.bezierCurveTo(radius * 0.14, radius * 0.9, -radius * 0.12, radius * 0.76, -radius * 0.22, radius * 0.42);
	ctx.quadraticCurveTo(-radius * 0.34, radius * 0.1, -radius * 0.05, -curl * 0.1);
	ctx.bezierCurveTo(radius * 0.18, -curl * 0.28, radius * 0.22, -outer * 0.18, radius * 0.02, -outer * 0.32);
	ctx.quadraticCurveTo(-radius * 0.18, -outer * 0.5, -radius * 0.92, 0.02 * radius);
	ctx.stroke();
}

function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}
