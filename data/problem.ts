export type Difficulty = "easy" | "medium" | "hard";
export type Category = "JavaScript" | "CSS" | "HTML" | "React" | "TypeScript" | "DOM";

export interface Problem {
  id: number;
  title: string;
  titleCn: string;
  difficulty: Difficulty;
  category: Category;
  tags: string[];
  acceptance: number;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: string;
  solution?: string;
  solved?: boolean;
}

export const problems: Problem[] = [
  {
    id: 1,
    title: "Implement Array.prototype.map",
    titleCn: "实现 Array.prototype.map",
    difficulty: "easy",
    category: "JavaScript",
    tags: ["数组", "原型链", "函数式编程"],
    acceptance: 78,
    description: `
## 题目描述

请实现一个自定义的 \`myMap\` 方法，它的功能和原生的 \`Array.prototype.map\` 完全一致。

### 要求

- 对数组的每个元素执行提供的回调函数
- 返回一个新数组，包含回调函数的返回值
- 回调函数接收三个参数：当前元素、当前索引、原数组
- 需要正确处理 \`thisArg\` 参数

### 注意事项

- 不能使用原生的 \`map\` 方法
- 需要处理稀疏数组的情况
    `,
    examples: [
      {
        input: "[1, 2, 3].myMap(x => x * 2)",
        output: "[2, 4, 6]",
        explanation: "每个元素乘以2",
      },
      {
        input: "['a', 'b', 'c'].myMap((char, index) => char + index)",
        output: "['a0', 'b1', 'c2']",
        explanation: "拼接元素和索引",
      },
    ],
    starterCode: `Array.prototype.myMap = function(callback, thisArg) {
  // 在这里实现你的代码

};`,
    solved: true,
  },
  {
    id: 2,
    title: "Debounce Function",
    titleCn: "实现防抖函数",
    difficulty: "medium",
    category: "JavaScript",
    tags: ["函数", "性能优化", "闭包"],
    acceptance: 65,
    description: `
## 题目描述

实现一个防抖函数 \`debounce\`，在事件被触发后等待一段时间再执行，如果在等待期间事件再次被触发，则重新计时。

### 要求

- 返回一个新函数，该函数在指定延迟后执行
- 如果在延迟期间再次调用，则取消之前的定时器并重新计时
- 需要正确传递 \`this\` 和参数

### 应用场景

- 搜索框输入实时搜索
- 窗口大小调整事件
- 按钮防止重复点击
    `,
    examples: [
      {
        input: "const fn = debounce(() => console.log('called'), 1000)",
        output: "函数在最后一次调用后1秒执行",
        explanation: "连续调用只会在最后一次调用后1秒执行一次",
      },
    ],
    starterCode: `function debounce(func, wait) {
  // 在这里实现你的代码

}`,
    solved: false,
  },
  {
    id: 3,
    title: "Implement Promise.all",
    titleCn: "实现 Promise.all",
    difficulty: "hard",
    category: "JavaScript",
    tags: ["Promise", "异步编程", "并发"],
    acceptance: 42,
    description: `
## 题目描述

实现一个 \`promiseAll\` 函数，功能与原生 \`Promise.all\` 相同。

### 要求

- 接收一个可迭代对象（通常是数组）
- 返回一个新的 Promise
- 当所有输入的 Promise 都成功时，返回所有结果的数组
- 如果任一 Promise 失败，立即返回该失败原因
- 结果数组的顺序必须与输入顺序一致

### 边界情况

- 处理空数组
- 处理非 Promise 值
- 正确处理错误情况
    `,
    examples: [
      {
        input: "promiseAll([Promise.resolve(1), Promise.resolve(2)])",
        output: "Promise<[1, 2]>",
        explanation: "所有 Promise 成功，返回结果数组",
      },
      {
        input: "promiseAll([Promise.resolve(1), Promise.reject('error')])",
        output: "Promise.reject('error')",
        explanation: "有一个失败，立即返回失败原因",
      },
    ],
    starterCode: `function promiseAll(promises) {
  // 在这里实现你的代码

}`,
    solved: false,
  },
  {
    id: 4,
    title: "CSS Center an Element",
    titleCn: "CSS 居中元素",
    difficulty: "easy",
    category: "CSS",
    tags: ["布局", "Flexbox", "Grid"],
    acceptance: 85,
    description: `
## 题目描述

使用 CSS 将一个子元素在父元素中水平垂直居中。

### 要求

请提供至少 3 种不同的实现方式：
1. 使用 Flexbox
2. 使用 Grid
3. 使用 Position + Transform

### 注意事项

- 父元素有固定高度 400px
- 子元素大小为 100px × 100px
- 需要同时实现水平和垂直居中
    `,
    examples: [
      {
        input: "Flexbox 方案",
        output: "display: flex; justify-content: center; align-items: center;",
      },
    ],
    starterCode: `.parent {
  height: 400px;
  /* 在这里添加样式 */
}

.child {
  width: 100px;
  height: 100px;
  /* 在这里添加样式 */
}`,
    solved: true,
  },
  {
    id: 5,
    title: "Implement useDebounce Hook",
    titleCn: "实现 useDebounce Hook",
    difficulty: "medium",
    category: "React",
    tags: ["Hooks", "自定义Hook", "性能优化"],
    acceptance: 58,
    description: `
## 题目描述

实现一个 React 自定义 Hook \`useDebounce\`，用于对值进行防抖处理。

### 要求

- 接收一个值和延迟时间作为参数
- 返回防抖后的值
- 当原值变化时，延迟指定时间后更新返回值
- 组件卸载时清除定时器

### 使用场景

- 搜索输入框的实时搜索
- 表单验证
- API 请求优化
    `,
    examples: [
      {
        input: "const debouncedValue = useDebounce(searchTerm, 500)",
        output: "searchTerm 变化后 500ms 返回新值",
      },
    ],
    starterCode: `import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  // 在这里实现你的代码

}

export default useDebounce;`,
    solved: false,
  },
  {
    id: 6,
    title: "Event Delegation",
    titleCn: "事件委托",
    difficulty: "medium",
    category: "DOM",
    tags: ["事件", "DOM操作", "性能优化"],
    acceptance: 62,
    description: `
## 题目描述

实现一个事件委托函数，将事件监听器添加到父元素上，根据选择器匹配来执行回调。

### 要求

- 在父元素上添加事件监听器
- 当子元素触发事件时，检查是否匹配指定选择器
- 匹配成功则执行回调函数
- 回调函数中的 \`this\` 指向匹配的元素

### 优点

- 减少内存占用
- 动态添加的元素也能响应事件
- 代码更简洁
    `,
    examples: [
      {
        input: "delegate(ul, 'li', 'click', handleClick)",
        output: "点击任意 li 元素时触发 handleClick",
      },
    ],
    starterCode: `function delegate(parent, selector, eventType, handler) {
  // 在这里实现你的代码

}`,
    solved: false,
  },
  {
    id: 7,
    title: "TypeScript Utility Types",
    titleCn: "TypeScript 工具类型",
    difficulty: "hard",
    category: "TypeScript",
    tags: ["类型", "泛型", "类型体操"],
    acceptance: 35,
    description: `
## 题目描述

实现以下 TypeScript 工具类型：

### 1. MyPick<T, K>
从类型 T 中选取属性 K 组成新类型

### 2. MyOmit<T, K>
从类型 T 中排除属性 K 后的新类型

### 3. DeepReadonly<T>
将类型 T 的所有属性递归地设置为只读

### 要求

- 不能使用内置的工具类型
- 需要正确处理嵌套对象
    `,
    examples: [
      {
        input: "MyPick<{ a: 1, b: 2, c: 3 }, 'a' | 'b'>",
        output: "{ a: 1, b: 2 }",
      },
    ],
    starterCode: `// 实现 MyPick
type MyPick<T, K> = // 在这里实现

// 实现 MyOmit
type MyOmit<T, K> = // 在这里实现

// 实现 DeepReadonly
type DeepReadonly<T> = // 在这里实现`,
    solved: false,
  },
  {
    id: 8,
    title: "CSS Flexbox Layout",
    titleCn: "Flexbox 圣杯布局",
    difficulty: "easy",
    category: "CSS",
    tags: ["布局", "Flexbox", "响应式"],
    acceptance: 72,
    description: `
## 题目描述

使用 Flexbox 实现经典的圣杯布局（Holy Grail Layout）。

### 布局要求

- 固定高度的 header 和 footer
- 中间区域自适应高度
- 左右两栏固定宽度
- 中间栏自适应宽度
- 三栏等高

### 响应式要求

- 在小屏幕上，三栏变为垂直排列
- 断点：768px
    `,
    examples: [
      {
        input: "桌面端布局",
        output: "header、footer 固定，左200px、右200px、中间自适应",
      },
    ],
    starterCode: `.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header, .footer {
  /* 在这里添加样式 */
}

.main {
  /* 在这里添加样式 */
}

.sidebar-left, .sidebar-right {
  /* 在这里添加样式 */
}

.content {
  /* 在这里添加样式 */
}`,
    solved: false,
  },
];

export const categories: Category[] = ["JavaScript", "CSS", "HTML", "React", "TypeScript", "DOM"];

export const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "easy":
      return "text-easy";
    case "medium":
      return "text-medium";
    case "hard":
      return "text-hard";
  }
};

export const getDifficultyBgColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "easy":
      return "bg-easy/10 text-easy border-easy/20";
    case "medium":
      return "bg-medium/10 text-medium border-medium/20";
    case "hard":
      return "bg-hard/10 text-hard border-hard/20";
  }
};

export const getDifficultyLabel = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "easy":
      return "简单";
    case "medium":
      return "中等";
    case "hard":
      return "困难";
  }
};
