"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Problem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  problems as initialProblems,
  Difficulty,
  Category,
  categories,
} from "@/data/problem";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { toast } from "sonner";
import Link from "next/link";
import { Modal } from "@/components/ui/modal/index";

interface TestCaseInput {
  id: number;
  name: string;
  input: string;
  expected: string;
}

export default function ProblemManagement() {
  const [problemList, setProblemList] = useState<Problem[]>(initialProblems);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [testCases, setTestCases] = useState<TestCaseInput[]>([]);

  const filteredProblems = problemList.filter(
    (problem) =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.titleCn.includes(searchTerm),
  );

  const handleDeleteProblem = (id: number) => {
    setProblemList(problemList.filter((p) => p.id !== id));
    toast.success("题目已删除");
  };

  const handleEditProblem = (problem: Problem) => {
    setEditingProblem(problem);
    // Initialize test cases from existing data if available
    setTestCases([{ id: 1, name: "", input: "", expected: "" }]);
    setIsDialogOpen(true);
  };

  const handleAddNewProblem = () => {
    setEditingProblem(null);
    setTestCases([{ id: 1, name: "", input: "", expected: "" }]);
    setIsDialogOpen(true);
  };

  const handleAddTestCase = () => {
    const newId =
      testCases.length > 0 ? Math.max(...testCases.map((tc) => tc.id)) + 1 : 1;
    setTestCases([
      ...testCases,
      { id: newId, name: "", input: "", expected: "" },
    ]);
  };

  const handleRemoveTestCase = (id: number) => {
    if (testCases.length === 1) {
      toast.error("至少保留一个测试用例");
      return;
    }
    setTestCases(testCases.filter((tc) => tc.id !== id));
  };

  const handleTestCaseChange = (
    id: number,
    field: keyof TestCaseInput,
    value: string,
  ) => {
    setTestCases(
      testCases.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc)),
    );
  };

  const handleSaveProblem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Validate test cases
    const validTestCases = testCases.filter(
      (tc) => tc.input.trim() && tc.expected.trim(),
    );
    if (validTestCases.length === 0) {
      toast.error("请至少添加一个有效的测试用例");
      return;
    }

    const problemData = {
      title: formData.get("title") as string,
      titleCn: formData.get("titleCn") as string,
      difficulty: formData.get("difficulty") as Difficulty,
      category: formData.get("category") as Category,
      description: formData.get("description") as string,
      starterCode: formData.get("starterCode") as string,
      tags: (formData.get("tags") as string).split(",").map((t) => t.trim()),
      acceptance: editingProblem?.acceptance || 50,
      examples: editingProblem?.examples || [],
    };

    if (editingProblem) {
      setProblemList(
        problemList.map((p) =>
          p.id === editingProblem.id ? { ...p, ...problemData } : p,
        ),
      );
      toast.success("题目已更新");
    } else {
      const newProblem: Problem = {
        id: Math.max(...problemList.map((p) => p.id)) + 1,
        ...problemData,
      };
      setProblemList([...problemList, newProblem]);
      toast.success("题目已创建");
    }

    // Log test cases for now (would be saved to backend in real implementation)
    console.log("Test cases:", validTestCases);

    setIsDialogOpen(false);
    setEditingProblem(null);
    setTestCases([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">题目管理</h1>
          <p className="text-muted-foreground">管理和录入题目</p>
        </div>
        <Button onClick={handleAddNewProblem}>
          <Plus className="h-4 w-4 mr-2" />
          添加题目
        </Button>
        <Modal
          title={editingProblem ? "编辑题目" : "添加题目"}
          className="max-w-4xl max-h-[90vh] overflow-y-auto"
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <form onSubmit={handleSaveProblem} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                基本信息
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span>英文标题</span>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Implement Array.map"
                    defaultValue={editingProblem?.title}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <span>中文标题</span>
                  <Input
                    id="titleCn"
                    name="titleCn"
                    placeholder="实现 Array.map"
                    defaultValue={editingProblem?.titleCn}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span>难度</span>
                  <Select
                    name="difficulty"
                    defaultValue={editingProblem?.difficulty || "easy"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">简单</SelectItem>
                      <SelectItem value="medium">中等</SelectItem>
                      <SelectItem value="hard">困难</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <span>分类</span>
                  <Select
                    name="category"
                    defaultValue={editingProblem?.category || "JavaScript"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <span>标签（逗号分隔）</span>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="数组, 原型链, 函数式编程"
                  defaultValue={editingProblem?.tags.join(", ")}
                  required
                />
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                题目内容
              </h3>
              <div className="space-y-2">
                <span>题目描述（支持 Markdown）</span>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="## 题目描述&#10;&#10;请实现..."
                  rows={8}
                  defaultValue={editingProblem?.description}
                  required
                />
              </div>
              <div className="space-y-2">
                <span>起始代码</span>
                <Textarea
                  id="starterCode"
                  name="starterCode"
                  placeholder="function solution() {&#10;  // 在这里实现你的代码&#10;}"
                  rows={6}
                  className="font-mono text-sm"
                  defaultValue={editingProblem?.starterCode}
                  required
                />
              </div>
            </div>

            <Separator />

            {/* Test Cases */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  测试用例
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTestCase}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  添加用例
                </Button>
              </div>

              <div className="space-y-3">
                {testCases.map((testCase, index) => (
                  <Card key={testCase.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">
                          测试用例 #{index + 1}
                        </CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveTestCase(testCase.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <span className="text-xs">用例名称（可选）</span>
                        <Input
                          placeholder="基本数字映射"
                          value={testCase.name}
                          onChange={(e) =>
                            handleTestCaseChange(
                              testCase.id,
                              "name",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <span className="text-xs">输入表达式</span>
                          <Textarea
                            placeholder="[1, 2, 3].myMap(x => x * 2)"
                            rows={3}
                            className="font-mono text-sm"
                            value={testCase.input}
                            onChange={(e) =>
                              handleTestCaseChange(
                                testCase.id,
                                "input",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <span className="text-xs">期望输出</span>
                          <Textarea
                            placeholder="[2, 4, 6]"
                            rows={3}
                            className="font-mono text-sm"
                            value={testCase.expected}
                            onChange={(e) =>
                              handleTestCaseChange(
                                testCase.id,
                                "expected",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {testCases.length === 0 && (
                <div className="text-center py-6 text-muted-foreground border rounded-lg border-dashed">
                  <p className="text-sm">暂无测试用例</p>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={handleAddTestCase}
                  >
                    添加第一个测试用例
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                取消
              </Button>
              <Button type="submit">保存题目</Button>
            </div>
          </form>
        </Modal>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索题目..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead>标题</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>难度</TableHead>
              <TableHead>通过率</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProblems.map((problem) => (
              <TableRow key={problem.id}>
                <TableCell className="font-mono text-muted-foreground">
                  {problem.id}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{problem.titleCn}</p>
                    <p className="text-sm text-muted-foreground">
                      {problem.title}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{problem.category}</Badge>
                </TableCell>
                <TableCell>
                  <DifficultyBadge difficulty={problem.difficulty} />
                </TableCell>
                <TableCell>{problem.acceptance}%</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/problem/${problem.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          预览
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEditProblem(problem)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteProblem(problem.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
