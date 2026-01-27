import { TestCase } from "@/lib/codeRunner";

// Test cases for each problems by ID
export const problemTestCases: Record<number, TestCase[]> = {
  // Problem 1: Implement Array.prototype.map
  1: [
    {
      id: 1,
      name: "基本数字映射",
      input: "[1, 2, 3].myMap(x => x * 2)",
      expected: "[2, 4, 6]",
    },
    {
      id: 2,
      name: "使用索引参数",
      input: '[\"a\", \"b\", \"c\"].myMap((char, index) => char + index)',
      expected: '["a0", "b1", "c2"]',
    },
    {
      id: 3,
      name: "空数组处理",
      input: "[].myMap(x => x * 2)",
      expected: "[]",
    },
    {
      id: 4,
      name: "使用原数组参数",
      input: "[1, 2, 3].myMap((x, i, arr) => x + arr.length)",
      expected: "[4, 5, 6]",
    },
    {
      id: 5,
      name: "返回对象",
      input: "[1, 2].myMap(x => ({ value: x }))",
      expected: '[{"value":1},{"value":2}]',
    },
  ],

  // Problem 2: Debounce Function
  2: [
    {
      id: 1,
      name: "返回函数类型",
      input: "typeof debounce(() => {}, 100)",
      expected: '"function"',
    },
    {
      id: 2,
      name: "函数可调用",
      input:
        "(function() { let called = false; const fn = debounce(() => { called = true; }, 0); fn(); return typeof fn; })()",
      expected: '"function"',
    },
  ],

  // Problem 3: Implement Promise.all
  3: [
    {
      id: 1,
      name: "空数组返回空数组",
      input: "(async () => await promiseAll([]))()",
      expected: "[]",
    },
    {
      id: 2,
      name: "处理非 Promise 值",
      input: "(async () => await promiseAll([1, 2, 3]))()",
      expected: "[1, 2, 3]",
    },
    {
      id: 3,
      name: "保持顺序",
      input: "(async () => await promiseAll([Promise.resolve(1), Promise.resolve(2)]))()",
      expected: "[1, 2]",
    },
  ],

  // Problem 5: useDebounce Hook
  5: [
    {
      id: 1,
      name: "函数定义检查",
      input: "typeof useDebounce",
      expected: '"function"',
    },
  ],

  // Problem 6: Event Delegation
  6: [
    {
      id: 1,
      name: "函数定义检查",
      input: "typeof delegate",
      expected: '"function"',
    },
  ],
};

// Get test cases for a specific problems
export function getTestCases(problemId: number): TestCase[] {
  return problemTestCases[problemId] || [];
}
