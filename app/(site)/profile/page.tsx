"use client";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { useAuthStore, useSubmissionStore } from "@/stores";
import { problems } from "@/data/problem";
import { StatsCard } from "@/components/StatsCard";
import { ProfileStats } from "@/components/ProfileStats";
import { RecentSubmissions } from "@/components/RecentSubmissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Calendar, Trophy, Target } from "lucide-react";
// import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user } = useAuthStore();
  // const { openAuthDialog } = useAuthContext();
  const navigate = useRouter();
  const getAllSubmissions = useSubmissionStore((s) => s.getAllSubmissions);
  const getSubmissionsForProblem = useSubmissionStore(
    (s) => s.getSubmissionsForProblem,
  );

  // 如果未登录，显示登录提示
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 flex flex-col items-center justify-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">请先登录</h1>
            <p className="text-muted-foreground mb-6">
              登录后查看您的解题进度和提交统计
            </p>
            <Button onClick={() => {}}>立即登录</Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const allSubmissions = getAllSubmissions(user.id);

  // 计算解题统计
  const solvedProblems = new Set<number>();
  const attemptedProblems = new Set<number>();

  allSubmissions.forEach((sub) => {
    attemptedProblems.add(sub.problemId);
    if (sub.status === "passed") {
      solvedProblems.add(sub.problemId);
    }
  });

  // 按难度统计
  const statsByDifficulty = {
    easy: { solved: 0, total: 0 },
    medium: { solved: 0, total: 0 },
    hard: { solved: 0, total: 0 },
  };

  problems.forEach((problem) => {
    statsByDifficulty[problem.difficulty].total++;
    if (solvedProblems.has(problem.id)) {
      statsByDifficulty[problem.difficulty].solved++;
    }
  });

  // 计算通过率
  const passedSubmissions = allSubmissions.filter(
    (s) => s.status === "passed",
  ).length;
  const passRate =
    allSubmissions.length > 0
      ? Math.round((passedSubmissions / allSubmissions.length) * 100)
      : 0;

  // 最近提交
  const recentSubmissions = allSubmissions.slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 space-y-8">
        {/* 用户信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden">
            <div className="h-24 gradient-primary opacity-80" />
            <CardContent className="relative pt-0 pb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {user.username.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left flex-1">
                  <h1 className="text-2xl font-bold">{user.username}</h1>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      加入于 2024
                    </span>
                  </div>
                </div>
                <Button variant="outline" onClick={() => navigate.push("/")}>
                  开始刷题
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 统计概览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            label="已解决"
            value={solvedProblems.size}
            total={problems.length}
            color="primary"
            delay={0}
          />
          <StatsCard
            label="简单"
            value={statsByDifficulty.easy.solved}
            total={statsByDifficulty.easy.total}
            color="easy"
            delay={0.1}
          />
          <StatsCard
            label="中等"
            value={statsByDifficulty.medium.solved}
            total={statsByDifficulty.medium.total}
            color="medium"
            delay={0.2}
          />
          <StatsCard
            label="困难"
            value={statsByDifficulty.hard.solved}
            total={statsByDifficulty.hard.total}
            color="hard"
            delay={0.3}
          />
        </div>

        {/* 详细统计和最近提交 */}
        <div className="grid md:grid-cols-2 gap-6">
          <ProfileStats
            totalSubmissions={allSubmissions.length}
            passRate={passRate}
            solvedCount={solvedProblems.size}
            attemptedCount={attemptedProblems.size}
          />
          <RecentSubmissions submissions={recentSubmissions} />
        </div>
      </main>
    </div>
  );
}
