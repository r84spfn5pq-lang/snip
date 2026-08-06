const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DATA_FILE = path.join(__dirname, "..", "data", "users.json");

function readAll() {
  if (!fs.existsSync(DATA_FILE)) {
    return {};
  }
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  return raw.trim() === "" ? {} : JSON.parse(raw);
}

function writeAll(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

function getUserByEmail(email) {
  const users = readAll();
  return Object.values(users).find((u) => u.email === email) || null;
}

function createUser(email, passwordHash) {
  const users = readAll();
  const id = crypto.randomUUID();
  const user = { id, email, passwordHash, createdAt: Date.now() };
  users[id] = user;
  writeAll(users);
  return user;
}

module.exports = { getUserByEmail, createUser };
