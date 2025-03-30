import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

// 🔧 Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB6iNmZMtAp5UK4AAEVyq8BCfWkG7ZP88",
  authDomain: "dbalmuslih.firebaseapp.com",
  projectId: "dbalmuslih",
};

// 🚀 Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📋 Ambil elemen form dan pesan status
const form = document.getElementById("dataForm");
const statusMsg = document.getElementById("statusMsg");

// Fungsi untuk mengambil id terakhir dari Firestore
async function getLastId() {
  const snapshot = await getDocs(collection(db, "datamasuk"));
  let maxId = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.id && data.id > maxId) {
      maxId = data.id;
    }
  });

  return maxId + 1;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nomor_rmh = document.getElementById("nomor_rmh").value.trim();
  const nominalInput = document.getElementById("nominal").value.trim();
  const tanggalInput = document.getElementById("tanggal_masuk").value;

  if (!nomor_rmh || !nominalInput || !tanggalInput) {
    statusMsg.innerText = "⚠️ Semua field wajib diisi!";
    return;
  }

  // Ambil angka murni dari input yang sudah diformat
  const nominal = parseInt(nominalInput.replace(/\D/g, ""));
  const tanggal_masuk = Timestamp.fromDate(new Date(tanggalInput));

  try {
    const newId = await getLastId();

    await addDoc(collection(db, "datamasuk"), {
      id: newId,
      nomor_rmh,
      nominal,
      tanggal_masuk,
    });

    console.log("✅ Data ditambahkan:", {
      id: newId,
      nomor_rmh,
      nominal,
      tanggal_masuk,
    });
    statusMsg.innerText = "✅ Data berhasil ditambahkan!";
    form.reset();
  } catch (error) {
    console.error("❌ Gagal menambahkan data:", error);
    statusMsg.innerText = "❌ Gagal menambahkan data. Lihat console.";
  }
});
