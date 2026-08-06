const { verifyToken } = require("./auth");

function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "You need to be logged in to do that." });
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Your session is invalid or expired. Please log in again." });
  }
}

module.exports = { requireAuth };
