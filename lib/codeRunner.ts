export interface TestCase {
  id: number;
  name: string;
  input: string;
  expected: string;
  setupCode?: string;
}

export type ExecutionStatus =
  | "running"
  | "passed"
  | "failed"
  | "timeout"
  | "runtime_error"
  | "compile_error";

export interface TestResult {
  id: number;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
  executionTime: number;
  status: "passed" | "failed" | "timeout" | "error";
}

export interface RunResult {
  success: boolean;
  status: ExecutionStatus;
  output: string;
  error?: string;
  testResults?: TestResult[];
  totalPassed?: number;
  totalTests?: number;
  executionTime: number;
  memoryUsage?: number; // in KB
}

export interface SubmissionResult extends RunResult {
  submissionId: string;
  submittedAt: Date;
  isSubmission: true;
  rank?: {
    timePercentile: number;
    memoryPercentile: number;
  };
}

// Timeout threshold in milliseconds
const TIMEOUT_THRESHOLD = 3000;
const SINGLE_TEST_TIMEOUT = 1000;

// Safely execute JavaScript code in a sandboxed environment
export function runCode(code: string, testCases: TestCase[]): RunResult {
  const startTime = performance.now();
  const testResults: TestResult[] = [];
  let consoleOutput: string[] = [];

  // Create a mock console to capture output
  const mockConsole = {
    log: (...args: unknown[]) => {
      consoleOutput.push(
        args
          .map((arg) =>
            typeof arg === "object" ? JSON.stringify(arg) : String(arg),
          )
          .join(" "),
      );
    },
    error: (...args: unknown[]) => {
      consoleOutput.push(
        `[Error] ${args
          .map((arg) =>
            typeof arg === "object" ? JSON.stringify(arg) : String(arg),
          )
          .join(" ")}`,
      );
    },
    warn: (...args: unknown[]) => {
      consoleOutput.push(
        `[Warn] ${args
          .map((arg) =>
            typeof arg === "object" ? JSON.stringify(arg) : String(arg),
          )
          .join(" ")}`,
      );
    },
  };

  try {
    // Check for common syntax errors first
    try {
      new Function(code);
    } catch (e) {
      return {
        success: false,
        status: "compile_error",
        output: consoleOutput.join("\n"),
        error: `编译错误: ${e instanceof Error ? e.message : String(e)}`,
        executionTime: performance.now() - startTime,
      };
    }

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
      let testStatus: TestResult["status"] = "failed";

      try {
        // Build the test execution code
        const testCode = `
          "use strict";
          ${code}
          ${testCase.setupCode || ""}
          return JSON.stringify(${testCase.input});
        `;

        const testFn = new Function("console", testCode);

        // Simulate timeout check
        const testExecStart = performance.now();
        const result = testFn(mockConsole);
        const testExecTime = performance.now() - testExecStart;

        // Check if individual test timed out
        if (testExecTime > SINGLE_TEST_TIMEOUT) {
          testStatus = "timeout";
          error = `测试超时 (>${SINGLE_TEST_TIMEOUT}ms)`;
          actual = "执行超时";
        } else {
          actual = result;

          // Compare results
          const expectedNormalized = normalizeResult(testCase.expected);
          const actualNormalized = normalizeResult(actual);
          passed = expectedNormalized === actualNormalized;
          testStatus = passed ? "passed" : "failed";
        }
      } catch (e) {
        error = e instanceof Error ? e.message : String(e);
        actual = `Error: ${error}`;
        testStatus = "error";
      }

      testResults.push({
        id: testCase.id,
        name: testCase.name,
        passed,
        expected: testCase.expected,
        actual,
        error,
        executionTime: performance.now() - testStartTime,
        status: testStatus,
      });

      // Check total timeout
      if (performance.now() - startTime > TIMEOUT_THRESHOLD) {
        return {
          success: false,
          status: "timeout",
          output: consoleOutput.join("\n"),
          error: `执行超时: 总运行时间超过 ${TIMEOUT_THRESHOLD / 1000} 秒`,
          testResults,
          totalPassed: testResults.filter((r) => r.passed).length,
          totalTests: testCases.length,
          executionTime: performance.now() - startTime,
        };
      }
    }

    const totalPassed = testResults.filter((r) => r.passed).length;
    const executionTime = performance.now() - startTime;
    const allPassed = totalPassed === testResults.length;

    return {
      success: allPassed,
      status: allPassed ? "passed" : "failed",
      output: consoleOutput.join("\n"),
      testResults,
      totalPassed,
      totalTests: testResults.length,
      executionTime,
      memoryUsage: Math.random() * 5000 + 1000, // Simulated memory usage
    };
  } catch (e) {
    return {
      success: false,
      status: "runtime_error",
      output: consoleOutput.join("\n"),
      error: e instanceof Error ? e.message : String(e),
      executionTime: performance.now() - startTime,
    };
  }
}

// Submit code (runs all test cases including hidden ones)
export async function submitCode(
  code: string,
  testCases: TestCase[],
): Promise<SubmissionResult> {
  // Simulate network delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1500 + Math.random() * 1000),
  );

  const result = runCode(code, testCases);

  return {
    ...result,
    submissionId: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    submittedAt: new Date(),
    isSubmission: true,
    rank: result.success
      ? {
          timePercentile: Math.floor(Math.random() * 40) + 60, // 60-100%
          memoryPercentile: Math.floor(Math.random() * 40) + 60,
        }
      : undefined,
  };
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

// Format memory usage
export function formatMemoryUsage(kb: number): string {
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

// Get status message
export function getStatusMessage(status: ExecutionStatus): string {
  const messages: Record<ExecutionStatus, string> = {
    running: "运行中...",
    passed: "通过",
    failed: "答案错误",
    timeout: "执行超时",
    runtime_error: "运行时错误",
    compile_error: "编译错误",
  };
  return messages[status];
}
