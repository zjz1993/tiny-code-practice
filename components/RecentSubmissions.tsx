import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle, Clock, FileCode } from "lucide-react";
import { SubmissionRecord } from "@/stores/submissionStore";
import { problems } from "@/data/problem";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import Link from "next/link";

interface RecentSubmissionsProps {
  submissions: SubmissionRecord[];
}

export function RecentSubmissions({ submissions }: RecentSubmissionsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-easy" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-hard" />;
      default:
        return <Clock className="h-4 w-4 text-medium" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "passed":
        return "通过";
      case "failed":
        return "未通过";
      case "error":
        return "错误";
      default:
        return status;
    }
  };

  const getProblemTitle = (problemId: number) => {
    const problem = problems.find((p) => p.id === problemId);
    return problem?.titleCn || `题目 ${problemId}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            最近提交
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileCode className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>暂无提交记录</p>
              <p className="text-sm mt-1">去刷题页面开始你的第一次提交吧！</p>
            </div>
          ) : (
            <ScrollArea className="h-[280px] pr-4">
              <div className="space-y-3">
                {submissions.map((submission) => (
                  <Link
                    key={submission.id}
                    href={`/problem/${submission.problemId}`}
                    className="block"
                  >
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                      {getStatusIcon(submission.status)}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {getProblemTitle(submission.problemId)}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>
                            {formatDistanceToNow(
                              new Date(submission.submittedAt),
                              {
                                addSuffix: true,
                                locale: zhCN,
                              },
                            )}
                          </span>
                          <span>•</span>
                          <span>{submission.executionTime}ms</span>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          submission.status === "passed"
                            ? "bg-easy/10 text-easy border-easy/20"
                            : "bg-hard/10 text-hard border-hard/20"
                        }
                      >
                        {getStatusLabel(submission.status)}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
