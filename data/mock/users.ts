// Mock data for admin pages

export interface MockUser {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  solvedCount: number;
  createdAt: string;
}

export interface MockTag {
  id: string;
  name: string;
  nameCn: string;
  color: string;
  problemCount: number;
}

export const mockUsers: MockUser[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    solvedCount: 45,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    username: "张三",
    email: "zhangsan@example.com",
    role: "user",
    status: "active",
    solvedCount: 23,
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    username: "李四",
    email: "lisi@example.com",
    role: "user",
    status: "active",
    solvedCount: 18,
    createdAt: "2024-03-05",
  },
  {
    id: "4",
    username: "王五",
    email: "wangwu@example.com",
    role: "user",
    status: "inactive",
    solvedCount: 5,
    createdAt: "2024-03-10",
  },
];

export const mockTags: MockTag[] = [
  {
    id: "1",
    name: "array",
    nameCn: "数组",
    color: "#3b82f6",
    problemCount: 12,
  },
  {
    id: "2",
    name: "string",
    nameCn: "字符串",
    color: "#10b981",
    problemCount: 8,
  },
  {
    id: "3",
    name: "prototype",
    nameCn: "原型链",
    color: "#f59e0b",
    problemCount: 5,
  },
  {
    id: "4",
    name: "closure",
    nameCn: "闭包",
    color: "#8b5cf6",
    problemCount: 6,
  },
  {
    id: "5",
    name: "promise",
    nameCn: "Promise",
    color: "#ec4899",
    problemCount: 7,
  },
  {
    id: "6",
    name: "hooks",
    nameCn: "Hooks",
    color: "#06b6d4",
    problemCount: 4,
  },
  {
    id: "7",
    name: "flexbox",
    nameCn: "Flexbox",
    color: "#84cc16",
    problemCount: 3,
  },
  { id: "8", name: "grid", nameCn: "Grid", color: "#f97316", problemCount: 2 },
];
