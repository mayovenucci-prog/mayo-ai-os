const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("🚀 Mayo AI OS fonctionne !");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
