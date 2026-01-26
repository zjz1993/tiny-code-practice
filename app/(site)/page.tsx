"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Code2, Zap, Target, TrendingUp } from "lucide-react";
import { Header } from "@/components/Header";
import { ProblemCard } from "@/components/ProblemCard";
import { FilterPanel } from "@/components/FilterPanel";
import { StatsCard } from "@/components/StatsCard";
import { problems, Difficulty, Category } from "@/data/problem";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.titleCn.includes(searchQuery);
      const matchesDifficulty = !selectedDifficulty || problem.difficulty === selectedDifficulty;
      const matchesCategory = !selectedCategory || problem.category === selectedCategory;
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [searchQuery, selectedDifficulty, selectedCategory]);

  const stats = useMemo(() => {
    const solved = problems.filter((p) => p.solved).length;
    const easy = problems.filter((p) => p.difficulty === "easy");
    const medium = problems.filter((p) => p.difficulty === "medium");
    const hard = problems.filter((p) => p.difficulty === "hard");
    return {
      solved,
      total: problems.length,
      easy: { solved: easy.filter((p) => p.solved).length, total: easy.length },
      medium: { solved: medium.filter((p) => p.solved).length, total: medium.length },
      hard: { solved: hard.filter((p) => p.solved).length, total: hard.length },
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero section */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container relative py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">前端专属刷题平台</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              精通前端
              <span className="gradient-text"> 从刷题开始</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              覆盖 JavaScript、CSS、React、TypeScript 等核心技术， 从基础到进阶，助你拿下大厂
              Offer。
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                <span>{problems.length}+ 精选题目</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span>6 大分类</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>持续更新</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Stats */}
          <aside className="lg:col-span-1 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <h2 className="text-lg font-semibold mb-4">刷题进度</h2>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                <StatsCard
                  label="已完成"
                  value={stats.solved}
                  total={stats.total}
                  color="primary"
                  delay={0}
                />
                <StatsCard
                  label="简单"
                  value={stats.easy.solved}
                  total={stats.easy.total}
                  color="easy"
                  delay={0.1}
                />
                <StatsCard
                  label="中等"
                  value={stats.medium.solved}
                  total={stats.medium.total}
                  color="medium"
                  delay={0.2}
                />
                <StatsCard
                  label="困难"
                  value={stats.hard.solved}
                  total={stats.hard.total}
                  color="hard"
                  delay={0.3}
                />
              </div>
            </motion.div>
          </aside>

          {/* Problem list */}
          <main className="lg:col-span-3 space-y-6">
            <FilterPanel
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedDifficulty={selectedDifficulty}
              onDifficultyChange={setSelectedDifficulty}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <div className="space-y-3">
              {filteredProblems.length > 0 ? (
                filteredProblems.map((problem, index) => (
                  <ProblemCard key={problem.id} problem={problem} index={index} />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">没有找到匹配的题目</div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
