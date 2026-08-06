const crypto = require("crypto");

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateCode(length = 6) {
  let code = "";
  for (let i = 0; i < length; i++) {
    const index = crypto.randomInt(0, ALPHABET.length);
    code += ALPHABET[index];
  }
  return code;
}

module.exports = { generateCode, ALPHABET };
