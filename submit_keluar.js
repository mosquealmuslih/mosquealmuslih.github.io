import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  Timestamp,
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

// 📋 Ambil elemen form dan status
const form = document.getElementById("dataForm");
const statusMsg = document.getElementById("statusMsg");

// 🔁 Ambil ID terakhir dari datakeluar
async function getLastId() {
  const snapshot = await getDocs(collection(db, "datakeluar"));
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

  const uraian = document.getElementById("uraian").value.trim();
  const nominalInput = document.getElementById("nominal").value.trim();
  const tgl = document.getElementById("tgl_keluar").value;

  if (!uraian || !nominalInput || !tgl) {
    statusMsg.innerText = "⚠️ Semua field wajib diisi!";
    return;
  }

  const nominal = parseInt(nominalInput.replace(/\D/g, ""));
  const tgl_keluar = Timestamp.fromDate(new Date(tgl));

  try {
    const newId = await getLastId();

    await addDoc(collection(db, "datakeluar"), {
      id: newId,
      uraian,
      nominal,
      tgl_keluar,
    });

    console.log("✅ Data pengeluaran ditambahkan:", {
      id: newId,
      uraian,
      nominal,
      tgl_keluar,
    });
    statusMsg.innerText = "✅ Data berhasil ditambahkan!";
    form.reset();
  } catch (error) {
    console.error("❌ Gagal menambahkan data:", error);
    statusMsg.innerText = "❌ Gagal menambahkan data.";
  }
});
