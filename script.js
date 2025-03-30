// Firebase SDK import
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB6iNmZMtAp5UK4AAEVyq8BCfWkG7ZP88",
  authDomain: "dbalmuslih.firebaseapp.com",
  projectId: "dbalmuslih",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elemen tbody tabel
const dataMasuk = document.getElementById("data-masuk");
const dataKeluar = document.getElementById("data-keluar");

// Fungsi global untuk menghapus dokumen
window.deleteData = async function (collectionName, docId) {
  if (confirm("Yakin ingin menghapus data ini?")) {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      alert("✅ Data berhasil dihapus!");
      location.reload();
    } catch (error) {
      console.error("❌ Gagal menghapus:", error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  }
};

// Fungsi utama untuk mengambil data dan menampilkannya
// Fungsi utama untuk mengambil data dan menampilkannya
// Fungsi utama untuk mengambil data dan menampilkannya
async function loadData() {
  const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";

  // 🔽 DATA MASUK
  const masukSnap = await getDocs(collection(db, "datamasuk"));
  const masukList = [];
  let totalMasuk = 0; // Variabel untuk menyimpan total nominal pemasukan
  masukSnap.forEach((docSnap) => {
    masukList.push({ docId: docSnap.id, ...docSnap.data() });
  });

  masukList.sort((a, b) => b.id - a.id); // Urutkan berdasarkan field `id` (DESC)

  masukList.forEach((data, index) => {
    const tanggal =
      data.tanggal_masuk?.toDate().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }) || "-";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${data.nomor_rmh}</td>
      <td>Rp${data.nominal.toLocaleString()}</td>
      <td>${tanggal}</td>
      <td>
        ${
          isLoggedIn
            ? `<button class="btn btn-sm btn-danger" onclick="deleteData('datamasuk', '${data.docId}')">🗑</button>`
            : ""
        }
      </td>
    `;
    dataMasuk.appendChild(row);
    totalMasuk += data.nominal; // Menambahkan nominal ke total
  });

  // Menampilkan total nominal pemasukan
  const totalMasukElement = document.getElementById("totalNominalMasuk");
  totalMasukElement.textContent = `Rp${totalMasuk.toLocaleString()}`;

  // 🔽 DATA KELUAR
  const keluarSnap = await getDocs(collection(db, "datakeluar"));
  const keluarList = [];
  let totalKeluar = 0; // Variabel untuk menyimpan total nominal pengeluaran
  keluarSnap.forEach((docSnap) => {
    keluarList.push({ docId: docSnap.id, ...docSnap.data() });
  });

  keluarList.sort((a, b) => b.id - a.id); // Urutkan berdasarkan field `id` (DESC)

  keluarList.forEach((data, index) => {
    const tanggal =
      data.tgl_keluar?.toDate().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }) || "-";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${data.uraian}</td>
      <td>Rp${data.nominal.toLocaleString()}</td>
      <td>${tanggal}</td>
      <td>
        ${
          isLoggedIn
            ? `<button class="btn btn-sm btn-danger" onclick="deleteData('datakeluar', '${data.docId}')">🗑</button>`
            : ""
        }
      </td>
    `;
    dataKeluar.appendChild(row);
    totalKeluar += data.nominal; // Menambahkan nominal ke total
  });

  // Menampilkan total nominal pengeluaran
  const totalKeluarElement = document.getElementById("totalNominalKeluar");
  totalKeluarElement.textContent = `Rp${totalKeluar.toLocaleString()}`;

  // 🔽 TABEL TOTAL INFAQ
  const totalInfaqElement = document.getElementById("total-infaq");
  const totalPemasukanElement = document.getElementById("totalPemasukan");
  const totalPengeluaranElement = document.getElementById("totalPengeluaran");
  const totalSelisihElement = document.getElementById("totalSelisih");

  // Menghitung selisih antara pemasukan dan pengeluaran
  const totalSelisih = totalMasuk - totalKeluar;

  // Menampilkan total pemasukan, pengeluaran, dan selisih
  totalPemasukanElement.textContent = `Rp${totalMasuk.toLocaleString()}`;
  totalPengeluaranElement.textContent = `Rp${totalKeluar.toLocaleString()}`;
  totalSelisihElement.textContent = `Rp${totalSelisih.toLocaleString()}`;
}

// Panggil fungsi saat halaman dimuat
loadData();
