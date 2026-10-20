function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Необходима авторизация" });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Необходима авторизация" });
  }
  if (req.session.user.role !== "admin") {
    return res.status(403).json({ error: "Доступ только для администратора" });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
