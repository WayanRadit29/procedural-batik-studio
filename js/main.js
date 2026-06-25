/**
 * main.js
 * Main Controller — membaca input dari UI, membuat config, dan memanggil renderer.
 */

const canvas = document.getElementById("batikCanvas");
const ctx = canvas.getContext("2d");

/**
 * Membaca seluruh state dari UI dan merakit config global.
 * @returns {Object} config
 */
function buildConfig() {
  const checkedMotifs = [...document.querySelectorAll(".motif-checkbox:checked")];

  const motifs = checkedMotifs.map((checkbox) => {
    const type = checkbox.value;
    return {
      type,
      size: parseInt(document.getElementById(`size-${type}`).value),
      spacing: parseInt(document.getElementById(`spacing-${type}`).value),
      primaryColor: document.getElementById(`primary-${type}`).value,
      secondaryColor: document.getElementById(`secondary-${type}`).value,
    };
  });

  return {
    backgroundColor: document.getElementById("bgColor").value,
    combinationMode: document.getElementById("combinationMode").value,
    motifs,
  };
}

/**
 * Entry point utama — dipanggil setiap kali ada perubahan di UI.
 */
function update() {
  const config = buildConfig();

  // Validasi: minimal satu motif harus dipilih
  if (config.motifs.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }

  renderCanvas(ctx, config);
}

// Inisialisasi saat DOM siap
document.addEventListener("DOMContentLoaded", () => {
  setupUI(update);   // ui.js mendaftarkan semua event listener, lalu panggil update()
  update();          // render awal
});
