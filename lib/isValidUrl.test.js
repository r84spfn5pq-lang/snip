const { isValidUrl } = require("./isValidUrl");

describe("isValidUrl", () => {
  it("accepts a normal https URL", () => {
    expect(isValidUrl("https://anthropic.com")).toBe(true);
  });

  it("accepts a normal http URL", () => {
    expect(isValidUrl("http://example.com/page")).toBe(true);
  });

  it("rejects plain text that isn't a URL", () => {
    expect(isValidUrl("not a url")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isValidUrl("")).toBe(false);
  });

  it("rejects non-http(s) protocols", () => {
    expect(isValidUrl("ftp://example.com/file")).toBe(false);
  });

  it("rejects non-string input", () => {
    expect(isValidUrl(null)).toBe(false);
    expect(isValidUrl(undefined)).toBe(false);
    expect(isValidUrl(42)).toBe(false);
  });
});
