const express = require("express");
const app = express();
app.use(express.json());

let auteurs = [
  { id: 1, nom: "Antoine de Saint-Exupéry" },
  { id: 2, nom: "George Orwell" },
];

let livres = [
  { id: 1, titre: "Le Petit Prince", auteurId: 1, annee: 1943 },
  { id: 2, titre: "1984", auteurId: 2, annee: 1949 },
];
let nextAuteurId = 3;
let nextLivreId = 3;

app.get("/auteurs", (req, res) => {
  res.status(200).json(auteurs);
});

app.get("/auteurs/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const auteur = auteurs.find((a) => a.id === id);
  if (!auteur) return res.status(404).json({ erreur: "Auteur introuvable" });
  res.status(200).json(auteur);
});

app.post("/auteurs", (req, res) => {
  const { nom } = req.body;
  if (!nom)
    return res.status(400).json({ erreur: "Le nom de l'auteur est requis" });

  const nouvelAuteur = { id: nextAuteurId++, nom };
  auteurs.push(nouvelAuteur);
  res.status(201).json(nouvelAuteur);
});

app.get("/auteurs/:id/livres", (req, res) => {
  const idAuteur = parseInt(req.params.id);
  const auteurExiste = auteurs.some((a) => a.id === idAuteur);
  if (!auteurExiste)
    return res.status(404).json({ erreur: "Auteur introuvable" });

  const livresAuteur = livres.filter((l) => l.auteurId === idAuteur);
  res.status(200).json(livresAuteur);
});

app.get("/livres", (req, res) => {
  let resultat = livres.map((livre) => {
    const auteur = auteurs.find((a) => a.id === livre.auteurId);
    return {
      ...livre,
      nomAuteur: auteur ? auteur.nom : "Inconnu",
    };
  });

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  if (page && limit) {
    const indexDebut = (page - 1) * limit;
    const indexFin = page * limit;
    resultat = resultat.slice(indexDebut, indexFin);
  }

  res.status(200).json(resultat);
});

app.get("/livres/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const livre = livres.find((l) => l.id === id);
  if (!livre) return res.status(404).json({ erreur: "Livre introuvable" });

  const auteur = auteurs.find((a) => a.id === livre.auteurId);
  res.status(200).json({
    ...livre,
    nomAuteur: auteur ? auteur.nom : "Inconnu",
  });
});

app.post("/livres", (req, res) => {
  const { titre, auteurId, annee } = req.body;

  if (!titre || !auteurId) {
    return res
      .status(400)
      .json({ erreur: "Le titre et l'auteurId sont obligatoires" });
  }

  const auteurExiste = auteurs.some((a) => a.id === parseInt(auteurId));
  if (!auteurExiste) {
    return res
      .status(409)
      .json({ erreur: "Conflit : L'auteurId spécifié n'existe pas" });
  }

  const nouveauLivre = {
    id: nextLivreId++,
    titre,
    auteurId: parseInt(auteurId),
    annee: annee || null,
  };

  livres.push(nouveauLivre);
  res.status(201).json(nouveauLivre);
});

app.use((req, res) => res.status(404).json({ erreur: "Route non trouvée" }));
app.use((err, req, res, next) =>
  res.status(500).json({ erreur: "Erreur interne" }),
);

app.listen(3050, () =>
  console.log("Défi Multi-ressources actif sur http://localhost:3050"),
);
