const express = require("express");
const app = express();

app.use(express.json());

const livresRouter = require("./routes/livres");

app.use("/livres", livresRouter);

app.use((req, res, next) => {
  res.status(404).json({ erreur: "Ressource introuvable sur ce serveur" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erreur: "Une erreur interne est survenue" });
});

app.listen(3000, () =>
  console.log("API Bibliothèque sur http://localhost:3000"),
);
