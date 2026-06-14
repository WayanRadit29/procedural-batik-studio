# Procedural Batik Design Studio

## Deskripsi

Procedural Batik Design Studio adalah aplikasi web interaktif yang memungkinkan pengguna membuat dan mengeksplorasi motif batik secara procedural menggunakan parameter yang dapat diubah secara real-time.

Pengguna dapat memilih motif batik, mengatur ukuran, kepadatan, warna, dan melihat hasil perubahan secara langsung melalui Canvas API.

Project ini dikembangkan sebagai Final Project Mata Kuliah Grafika Komputer.

---

## Tujuan Project

* Mengenalkan konsep procedural generation pada motif batik Indonesia.
* Menerapkan konsep grafika komputer seperti geometric transformation, pattern rendering, dan procedural modeling.
* Menyediakan media eksplorasi desain batik yang interaktif dan mudah digunakan.

---

## Fitur MVP

* Motif Kawung
* Motif Parang
* Motif Ceplok
* Motif Mega Mendung
* Pengaturan ukuran motif
* Pengaturan kepadatan motif
* Pengaturan warna motif
* Realtime preview
* Export PNG

---

## Teknologi

* HTML
* CSS
* JavaScript
* Canvas API

---

## Struktur Project

```text
procedural-batik-studio/

index.html

css/
  style.css

js/

  motifs/
    kawung.js
    parang.js
    ceplok.js
    megaMendung.js

  main.js
  renderer.js
  export.js
  ui.js
```

---

## Arsitektur Sistem

```text
User
↓
UI
↓
Main Controller
↓
Motif Engine
↓
Canvas Renderer
↓
Export PNG
```

---

## Pembagian Tugas

### Mumtaz — Motif Kawung

Implementasi algoritma dan rendering motif Kawung.

### Robitul — Motif Parang

Implementasi algoritma dan rendering motif Parang.

### Wayan — Motif Ceplok

Implementasi algoritma dan rendering motif Ceplok.

### Nabil — Motif Mega Mendung

Implementasi algoritma dan rendering motif Mega Mendung.

### Seif — UI, Integrasi, Export, dan Dokumentasi

Mengembangkan antarmuka pengguna, mengintegrasikan seluruh modul motif, mengimplementasikan export PNG, serta menyusun dokumentasi project.

---

## Standar Fungsi Motif

Semua motif harus mengikuti format:

```javascript
function drawNamaMotif(ctx, config) {
  // kode menggambar motif
}
```

Contoh:

```javascript
function drawKawung(ctx, config) {
  // implementasi motif
}
```

---

## Parameter Wajib

```javascript
{
  size: 50,
  spacing: 20,
  color: "#8B4513"
}
```

---

## Status

🚧 Project sedang dalam tahap pengembangan awal.
