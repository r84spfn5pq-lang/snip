const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "links.json");

function readAll() {
  if (!fs.existsSync(DATA_FILE)) {
    return {};
  }
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  return raw.trim() === "" ? {} : JSON.parse(raw);
}

function writeAll(links) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(links, null, 2));
}

function getAllLinks() {
  const links = readAll();
  return Object.values(links).sort((a, b) => b.createdAt - a.createdAt);
}

function getLinksByOwner(ownerId) {
  return getAllLinks().filter((link) => link.ownerId === ownerId);
}

function getLink(code) {
  const links = readAll();
  return links[code] || null;
}

function addLink(code, url, ownerId) {
  const links = readAll();
  const link = { code, url, ownerId, clicks: 0, createdAt: Date.now() };
  links[code] = link;
  writeAll(links);
  return link;
}

function incrementClicks(code) {
  const links = readAll();
  if (!links[code]) return null;
  links[code].clicks += 1;
  writeAll(links);
  return links[code];
}

module.exports = { getAllLinks, getLinksByOwner, getLink, addLink, incrementClicks };
