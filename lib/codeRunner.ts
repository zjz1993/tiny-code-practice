export interface TestCase {
  id: number;
  name: string;
  input: string;
  expected: string;
  setupCode?: string;
}

export interface TestResult {
  id: number;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
  executionTime: number;
}

export interface RunResult {
  success: boolean;
  output: string;
  error?: string;
  testResults?: TestResult[];
  totalPassed?: number;
  totalTests?: number;
  executionTime: number;
}

// Safely execute JavaScript code in a sandboxed environment
export function runCode(code: string, testCases: TestCase[]): RunResult {
  const startTime = performance.now();
  const testResults: TestResult[] = [];
  let consoleOutput: string[] = [];

  // Create a mock console to capture output
  const mockConsole = {
    log: (...args: unknown[]) => {
      consoleOutput.push(
        args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" "),
      );
    },
    error: (...args: unknown[]) => {
      consoleOutput.push(
        `[Error] ${args
          .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)))
          .join(" ")}`,
      );
    },
    warn: (...args: unknown[]) => {
      consoleOutput.push(
        `[Warn] ${args
          .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)))
          .join(" ")}`,
      );
    },
  };

  try {
    // Create a sandboxed function
    const sandbox = new Function(
      "console",
      `
      "use strict";
      ${code}
      return { Array, Promise, Function };
    `,
    );

    // Execute user code to define functions
    sandbox(mockConsole);

    // Run each test case
    for (const testCase of testCases) {
      const testStartTime = performance.now();
      let passed = false;
      let actual = "";
      let error: string | undefined;

      try {
        // Build the test execution code
        const testCode = `
          "use strict";
          ${code}
          ${testCase.setupCode || ""}
          return JSON.stringify(${testCase.input});
        `;

        const testFn = new Function("console", testCode);
        const result = testFn(mockConsole);
        actual = result;

        // Compare results
        const expectedNormalized = normalizeResult(testCase.expected);
        const actualNormalized = normalizeResult(actual);
        passed = expectedNormalized === actualNormalized;
      } catch (e) {
        error = e instanceof Error ? e.message : String(e);
        actual = `Error: ${error}`;
      }

      testResults.push({
        id: testCase.id,
        name: testCase.name,
        passed,
        expected: testCase.expected,
        actual,
        error,
        executionTime: performance.now() - testStartTime,
      });
    }

    const totalPassed = testResults.filter((r) => r.passed).length;
    const executionTime = performance.now() - startTime;

    return {
      success: totalPassed === testResults.length,
      output: consoleOutput.join("\n"),
      testResults,
      totalPassed,
      totalTests: testResults.length,
      executionTime,
    };
  } catch (e) {
    return {
      success: false,
      output: consoleOutput.join("\n"),
      error: e instanceof Error ? e.message : String(e),
      executionTime: performance.now() - startTime,
    };
  }
}

// Normalize result for comparison
function normalizeResult(value: string): string {
  try {
    // Try to parse and re-stringify to normalize formatting
    const parsed = JSON.parse(value);
    return JSON.stringify(parsed);
  } catch {
    // If not valid JSON, return trimmed string
    return value.trim();
  }
}

// Format execution time
export function formatExecutionTime(ms: number): string {
  if (ms < 1) return "<1ms";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}
