function logger(req, res, next) {
  const debut = Date.now();

  res.on("finish", () => {
    const duree = Date.now() - debut;
    console.log(`→ ${req.method} ${req.url} — ${res.statusCode} — ${duree}ms`);
  });

  next();
}

module.exports = logger;
