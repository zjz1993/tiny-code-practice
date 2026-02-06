"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Tags, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { mockUsers, mockTags } from "@/data/mock/users";
import { problems } from "@/data/problem";

const stats = [
  {
    title: "总用户数",
    value: mockUsers.length,
    icon: Users,
    trend: "+12%",
    color: "text-blue-500",
  },
  {
    title: "题目总数",
    value: problems.length,
    icon: FileText,
    trend: "+5%",
    color: "text-green-500",
  },
  {
    title: "标签数量",
    value: mockTags.length,
    icon: Tags,
    trend: "+3%",
    color: "text-purple-500",
  },
  {
    title: "今日提交",
    value: 156,
    icon: TrendingUp,
    trend: "+25%",
    color: "text-orange-500",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">仪表盘</h1>
        <p className="text-muted-foreground">欢迎回到管理后台</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-500">{stat.trend} 较上月</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>最近注册用户</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUsers.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user.username[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {user.createdAt}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>热门标签</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {mockTags.map((tag) => (
                <div
                  key={tag.id}
                  className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                  }}
                >
                  <span>{tag.nameCn}</span>
                  <span className="text-xs opacity-70">{tag.problemCount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
