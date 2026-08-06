function isValidUrl(input) {
  if (typeof input !== "string" || input.trim() === "") {
    return false;
  }
  try {
    const parsed = new URL(input);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (err) {
    return false;
  }
}

module.exports = { isValidUrl };
