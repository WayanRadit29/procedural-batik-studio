/**
 * export.js
 * Export Utility — menyimpan isi canvas sebagai file PNG.
 */

/**
 * Men-download isi canvas sebagai file PNG.
 * @param {HTMLCanvasElement} canvas
 * @param {string} [filename="batik-design.png"]
 */
function exportToPNG(canvas, filename = "batik-design.png") {
  try {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Gagal export PNG:", err);
    alert("Export gagal. Pastikan canvas sudah berisi gambar.");
  }
}
