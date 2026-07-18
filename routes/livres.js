const express = require("express");
const router = express.Router();

let livres = [
  {
    id: 1,
    titre: "Le Petit Prince",
    auteur: "Saint-Exupéry",
    annee: 1943,
    disponible: true,
  },
  {
    id: 2,
    titre: "1984",
    auteur: "George Orwell",
    annee: 1949,
    disponible: true,
  },
  {
    id: 3,
    titre: "Dune",
    auteur: "Frank Herbert",
    annee: 1965,
    disponible: false,
  },
];
let nextId = 4;

router.get("/", (req, res) => {
  res.status(200).json(livres);
});

router.get("/:id", (req, res) => {
  const idSaisi = parseInt(req.params.id);
  const livre = livres.find((l) => l.id === idSaisi);

  if (!livre) {
    return res.status(404).json({ erreur: "Livre introuvable" });
  }
  res.status(200).json(livre);
});

router.post("/", (req, res) => {
  const { titre, auteur, annee } = req.body;

  if (!titre || !auteur) {
    return res
      .status(400)
      .json({ erreur: "Le titre et l'auteur sont obligatoires." });
  }

  const nouveauLivre = {
    id: nextId++,
    titre,
    auteur,
    annee: annee || null,
    disponible: true,
  };

  livres.push(nouveauLivre);
  res.status(201).json(nouveauLivre);
});

router.put("/:id", (req, res) => {
  const idSaisi = parseInt(req.params.id);
  const index = livres.findIndex((l) => l.id === idSaisi);

  if (index === -1) {
    return res.status(404).json({ erreur: "Livre introuvable" });
  }

  livres[index] = { id: idSaisi, ...req.body };
  res.status(200).json(livres[index]);
});

router.delete("/:id", (req, res) => {
  const idSaisi = parseInt(req.params.id);
  const index = livres.findIndex((l) => l.id === idSaisi);

  if (index === -1) {
    return res.status(404).json({ erreur: "Livre introuvable" });
  }

  livres.splice(index, 1);
  res.status(204).end();
});

module.exports = router;
