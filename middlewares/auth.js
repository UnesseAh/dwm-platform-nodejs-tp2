function verifierApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ erreur: "Clé API manquante ou invalide" });
  }

  next();
}

module.exports = verifierApiKey;
