import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB6iNmZMtAp5UK4AAEVyq8BCfWkG7ZP88",
  authDomain: "dbalmuslih.firebaseapp.com",
  projectId: "dbalmuslih",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const dataContainer = document.getElementById("data-container");

async function getData() {
  const querySnapshot = await getDocs(collection(db, "datamasuk"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement("div");
    div.innerHTML = `
      <hr>
      <p><strong>Nomor Rumah:</strong> ${data.nomor_rmh}</p>
      <p><strong>Nominal:</strong> Rp${data.nominal.toLocaleString()}</p>
      <p><strong>Tanggal Masuk:</strong> ${data.tanggal_masuk
        .toDate()
        .toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}</p>

    `;
    dataContainer.appendChild(div);
  });
}

getData();
