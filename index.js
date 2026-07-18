require("dotenv").config();
const express = require("express");
const app = express();

const livresRouter = require("./routes/livres");
const logger = require("./middlewares/logger");
const verifierApiKey = require("./middlewares/auth");

app.use(express.json());

app.use(logger);

app.use(
  "/livres",
  (req, res, next) => {
    if (["POST", "PUT", "DELETE"].includes(req.method)) {
      return verifierApiKey(req, res, next);
    }
    next();
  },
  livresRouter,
);

app.use((req, res, next) => {
  res.status(404).json({ erreur: "Ressource introuvable" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ erreur: "Erreur serveur" });
});

app.listen(3000, () =>
  console.log("API Bibliothèque sur http://localhost:3000"),
);
