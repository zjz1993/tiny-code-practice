import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Zap, Award } from "lucide-react";

interface ProfileStatsProps {
  totalSubmissions: number;
  passRate: number;
  solvedCount: number;
  attemptedCount: number;
}

export function ProfileStats({
  totalSubmissions,
  passRate,
  solvedCount,
  attemptedCount,
}: ProfileStatsProps) {
  const stats = [
    {
      icon: Zap,
      label: "总提交次数",
      value: totalSubmissions,
      color: "text-primary",
    },
    {
      icon: Target,
      label: "通过率",
      value: `${passRate}%`,
      color: "text-easy",
    },
    {
      icon: Award,
      label: "已解决",
      value: solvedCount,
      color: "text-medium",
    },
    {
      icon: TrendingUp,
      label: "尝试过",
      value: attemptedCount,
      color: "text-hard",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">提交统计</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <div>
                  <div className="text-xl font-bold font-mono">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">通过率进度</span>
              <span className="font-medium">{passRate}%</span>
            </div>
            <Progress value={passRate} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
