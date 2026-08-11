require("dotenv").config();

const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const { generateCode } = require("./lib/generateCode");
const { isValidUrl } = require("./lib/isValidUrl");
const store = require("./lib/store");
const users = require("./lib/users");
const { hashPassword, comparePassword, signToken } = require("./lib/auth");
const { requireAuth } = require("./lib/authMiddleware");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 4141;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function generateUniqueCode() {
  let code = generateCode(6);
  while (store.getLink(code)) {
    code = generateCode(6);
  }
  return code;
}

app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are both required." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password needs to be at least 8 characters." });
  }
  if (users.getUserByEmail(email)) {
    return res.status(409).json({ error: "An account with that email already exists." });
  }

  const passwordHash = await hashPassword(password);
  const user = users.createUser(email, passwordHash);
  const token = signToken(user);
  res.status(201).json({ token });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.getUserByEmail(email);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = signToken(user);
  res.json({ token });
});

app.get("/api/links", requireAuth, (req, res) => {
  res.json(store.getLinksByOwner(req.userId));
});

app.post("/api/links", requireAuth, (req, res) => {
  const { url } = req.body;

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: "That doesn't look like a valid http(s) URL." });
  }

  const code = generateUniqueCode();
  const link = store.addLink(code, url, req.userId);
  res.status(201).json(link);
});

app.get("/:code", (req, res) => {
  const link = store.getLink(req.params.code);

  if (!link) {
    return res.status(404).send("No link found for that code.");
  }

  const updated = store.incrementClicks(req.params.code);
  io.emit("linkClicked", { code: updated.code, clicks: updated.clicks });
  res.redirect(link.url);
});

server.listen(PORT, () => {
  console.log(`Snip is running at http://localhost:${PORT}`);
});
