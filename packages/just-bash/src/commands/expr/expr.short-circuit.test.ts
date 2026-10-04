import { describe, expect, it } from "vitest";
import { Bash } from "../../Bash.js";

describe("expr | and & short-circuit", () => {
  it.each([
    // [expression, stdout, exitCode]
    ["1 '|' 1 / 0", "1\n", 0],
    ["1 '|' 2 / 0 '|' 3", "1\n", 0],
    ["0 '&' 1 / 0", "0\n", 1],
    ["0 '&' 1 / 0 '|' 7", "7\n", 0],
    ["1 '|' a + 1", "1\n", 0],
    ["0 '&' a + 1", "0\n", 1],
    ["1 '|' 2 % 0", "1\n", 0],
    ["1 '|' '(' 1 / 0 ')'", "1\n", 0],
    ["0 '&' '(' 1 / 0 ')'", "0\n", 1],
    ["1 '|' substr abc x 1", "1\n", 0],
    ["0 '&' substr abc x 1", "0\n", 1],
    ["1 '|' abc : '['", "1\n", 0],
    ["3 '&' 4 '|' 1 / 0", "3\n", 0],
    ["1 '|' 1 / 0 '&' 0", "1\n", 0],
    ["2 '*' 3 '|' 1 / 0", "6\n", 0],
    ["1 = 1 '|' 1 / 0", "1\n", 0],
  ])("expr %s", async (expression, stdout, exitCode) => {
    const result = await new Bash().exec(`expr ${expression}`);
    expect(result).toMatchObject({ stdout, stderr: "", exitCode });
  });

  it.each([
    ["1 '&' 1 / 0", "division by zero"],
    ["0 '|' 1 / 0", "division by zero"],
    ["0 '|' a + 1", "non-integer argument"],
    ["1 '&' a + 1", "non-integer argument"],
  ])("expr %s still evaluates the operand it needs", async (expression, error) => {
    const result = await new Bash().exec(`expr ${expression}`);
    expect(result).toMatchObject({ stdout: "", exitCode: 2 });
    expect(result.stderr).toContain(error);
  });

  it.each([
    "1 '|' 2 +",
    "0 '&' 2 +",
    "1 '|' '(' 2",
  ])("expr %s is still a syntax error in the operand that is not evaluated", async (expression) => {
    const result = await new Bash().exec(`expr ${expression}`);
    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain("syntax error");
  });
});
