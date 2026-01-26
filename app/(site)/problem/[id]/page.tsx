"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, BookOpen, Code, MessageSquare, Lightbulb } from "lucide-react";
import { Header } from "@/components/Header";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CodeEditor } from "@/components/CodeEditor";
import { TestResults } from "@/components/TestResults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { problems } from "@/data/problem";
import { getTestCases } from "@/data/testCases";
import { runCode, RunResult } from "@/lib/codeRunner";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import Link from "next/link";
export default function ProblemPage({ params }: { params: { id: string } }) {
  const { id } = useParams();
  const problem = problems.find((p) => p.id === Number(id));
  const [code, setCode] = useState(problem?.starterCode || "");
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  if (!problem) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">题目不存在</h1>
          <Link href="/" className="text-primary hover:underline">
            返回题目列表
          </Link>
        </div>
      </div>
    );
  }

  const testCases = getTestCases(problem.id);

  const handleRun = () => {
    setIsRunning(true);
    // Small delay to show loading state
    setTimeout(() => {
      const result = runCode(code, testCases);
      setRunResult(result);
      setIsRunning(false);
    }, 100);
  };

  const handleReset = () => {
    setCode(problem.starterCode);
    setRunResult(null);
  };

  // Find adjacent problems
  const currentIndex = problems.findIndex((p) => p.id === problem.id);
  const prevProblem = problems[currentIndex - 1];
  const nextProblem = problems[currentIndex + 1];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Problem header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              返回题目列表
            </Link>

            <div className="flex flex-wrap items-start gap-4 justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-muted-foreground font-mono">
                    #{problem.id.toString().padStart(3, "0")}
                  </span>
                  {problem.solved && (
                    <div className="flex items-center gap-1 text-primary text-sm">
                      <Check className="h-4 w-4" />
                      已完成
                    </div>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-3">{problem.titleCn}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  <DifficultyBadge difficulty={problem.difficulty} />
                  <CategoryBadge category={problem.category} />
                  {problem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">通过率: {problem.acceptance}%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left: Problem description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="description" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  题目描述
                </TabsTrigger>
                <TabsTrigger value="solution" className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  题解
                </TabsTrigger>
                <TabsTrigger value="discuss" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  讨论
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <div className="prose prose-invert prose-sm max-w-none">
                  <div
                    className="text-foreground leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{
                      __html: problem.description
                        .replace(
                          /^## /gm,
                          '<h2 class="text-lg font-semibold mt-6 mb-3 text-foreground">',
                        )
                        .replace(
                          /^### /gm,
                          '<h3 class="text-base font-medium mt-4 mb-2 text-foreground">',
                        )
                        .replace(/\n\n/g, "</p><p>")
                        .replace(
                          /`([^`]+)`/g,
                          '<code class="px-1.5 py-0.5 rounded bg-muted font-mono text-sm text-primary">$1</code>',
                        )
                        .replace(/^- /gm, '<li class="ml-4">')
                        .replace(/\n(?=<li)/g, ""),
                    }}
                  />

                  {/* Examples */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">示例</h3>
                    <div className="space-y-4">
                      {problem.examples.map((example, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-2"
                        >
                          <div>
                            <span className="text-xs text-muted-foreground">输入：</span>
                            <code className="block mt-1 font-mono text-sm text-foreground bg-code-bg p-2 rounded">
                              {example.input}
                            </code>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">输出：</span>
                            <code className="block mt-1 font-mono text-sm text-primary bg-code-bg p-2 rounded">
                              {example.output}
                            </code>
                          </div>
                          {example.explanation && (
                            <div className="text-sm text-muted-foreground pt-2 border-t border-border/30">
                              💡 {example.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="solution" className="mt-4">
                <div className="p-8 text-center text-muted-foreground">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>题解功能开发中</p>
                  <p className="text-sm mt-2">完成本题后可查看官方题解</p>
                </div>
              </TabsContent>

              <TabsContent value="discuss" className="mt-4">
                <div className="p-8 text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>讨论区开发中</p>
                  <p className="text-sm mt-2">即将支持题目讨论功能</p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Right: Code editor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <span className="font-medium">代码编辑器</span>
              </div>
              <select className="text-sm bg-muted border border-border/50 rounded-lg px-3 py-1.5 text-muted-foreground">
                <option>JavaScript</option>
                <option>TypeScript</option>
              </select>
            </div>

            <CodeEditor
              code={code}
              onChange={setCode}
              onRun={handleRun}
              onReset={handleReset}
              language={problem.category === "CSS" ? "css" : "javascript"}
            />

            {/* Test Results */}
            {runResult && <TestResults result={runResult} />}

            {/* No test cases message for CSS problems */}
            {testCases.length === 0 && problem.category === "CSS" && (
              <div className="rounded-xl border border-border/50 bg-muted/20 p-4 text-center text-muted-foreground">
                <p>CSS 题目暂不支持自动测试</p>
                <p className="text-sm mt-1">请手动检查样式效果</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
          {prevProblem ? (
            <Link
              href={`/problem/${prevProblem.id}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">上一题: {prevProblem.titleCn}</span>
            </Link>
          ) : (
            <div />
          )}
          {nextProblem && (
            <Link
              href={`/problem/${nextProblem.id}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-sm">下一题: {nextProblem.titleCn}</span>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
