const dataContainer = document.getElementById("data-container");

db.collection("datamasuk")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.innerHTML = `
      <hr>
      <p><strong>Nomor Rumah:</strong> ${data.nomor_rmh}</p>
      <p><strong>Nominal:</strong> Rp${data.nominal.toLocaleString()}</p>
      <p><strong>Tanggal Masuk:</strong> ${data.tanggal_masuk}</p>
    `;
      dataContainer.appendChild(div);
    });
  });
