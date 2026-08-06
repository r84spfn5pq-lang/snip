const { generateCode, ALPHABET } = require("./generateCode");

describe("generateCode", () => {
  it("returns a string of the requested length", () => {
    const code = generateCode(6);
    expect(code).toHaveLength(6);
  });

  it("defaults to length 6 when no length is given", () => {
    const code = generateCode();
    expect(code).toHaveLength(6);
  });

  it("only uses characters from the allowed alphabet", () => {
    const code = generateCode(20);
    for (const char of code) {
      expect(ALPHABET).toContain(char);
    }
  });

  it("produces different codes across many calls", () => {
    const codes = new Set();
    for (let i = 0; i < 50; i++) {
      codes.add(generateCode(6));
    }
    expect(codes.size).toBeGreaterThan(1);
  });
});
