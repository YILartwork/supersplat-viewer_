function initViewer(splatFile) {
  console.log('Trying to load:', splatFile);

  fetch(splatFile)
    .then(response => {
      if (!response.ok) {
        throw new Error("404 Not Found!");
      }
      return response.arrayBuffer();
    })
    .then(buffer => {
      console.log("✅ Loaded buffer:", buffer);
      document.getElementById("viewer").innerText = "✅ Loaded: " + splatFile;
    })
    .catch(err => {
      console.error("❌ Error:", err);
      document.getElementById("viewer").innerText = "❌ Error: " + err;
    });
}
