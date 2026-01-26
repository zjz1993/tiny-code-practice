import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { RunResult, formatExecutionTime } from "@/lib/codeRunner";
import { cn } from "@/lib/utils";

interface TestResultsProps {
  result: RunResult;
}

export function TestResults({ result }: TestResultsProps) {
  const [expandedTests, setExpandedTests] = useState<Set<number>>(new Set());

  const toggleTest = (id: number) => {
    const newSet = new Set(expandedTests);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedTests(newSet);
  };

  const allPassed = result.success && result.totalPassed === result.totalTests;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border/50 bg-code-bg overflow-hidden"
    >
      {/* Header */}
      <div
        className={cn(
          "px-4 py-3 border-b border-border/50 flex items-center justify-between",
          allPassed ? "bg-easy/10" : result.error ? "bg-hard/10" : "bg-medium/10",
        )}
      >
        <div className="flex items-center gap-2">
          {allPassed ? (
            <div className="p-1 rounded-full bg-easy/20">
              <Check className="h-4 w-4 text-easy" />
            </div>
          ) : (
            <div className="p-1 rounded-full bg-hard/20">
              <X className="h-4 w-4 text-hard" />
            </div>
          )}
          <span className={cn("font-medium", allPassed ? "text-easy" : "text-hard")}>
            {allPassed
              ? "全部通过！"
              : result.error
                ? "执行错误"
                : `通过 ${result.totalPassed}/${result.totalTests} 个测试`}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {formatExecutionTime(result.executionTime)}
        </div>
      </div>

      {/* Error message */}
      {result.error && (
        <div className="p-4 border-b border-border/50 bg-hard/5">
          <pre className="font-mono text-sm text-hard whitespace-pre-wrap">{result.error}</pre>
        </div>
      )}

      {/* Console output */}
      {result.output && (
        <div className="p-4 border-b border-border/50">
          <div className="text-xs text-muted-foreground mb-2">控制台输出</div>
          <pre className="font-mono text-sm text-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-lg">
            {result.output}
          </pre>
        </div>
      )}

      {/* Test results */}
      {result.testResults && result.testResults.length > 0 && (
        <div className="divide-y divide-border/30">
          {result.testResults.map((test) => (
            <div key={test.id}>
              <button
                onClick={() => toggleTest(test.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  {test.passed ? (
                    <div className="p-0.5 rounded-full bg-easy/20">
                      <Check className="h-3 w-3 text-easy" />
                    </div>
                  ) : (
                    <div className="p-0.5 rounded-full bg-hard/20">
                      <X className="h-3 w-3 text-hard" />
                    </div>
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      test.passed ? "text-foreground" : "text-hard",
                    )}
                  >
                    测试 {test.id}: {test.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {formatExecutionTime(test.executionTime)}
                  </span>
                  {expandedTests.has(test.id) ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {expandedTests.has(test.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">期望输出</div>
                          <pre className="font-mono text-sm p-2 rounded-lg bg-muted/30 text-easy">
                            {test.expected}
                          </pre>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">实际输出</div>
                          <pre
                            className={cn(
                              "font-mono text-sm p-2 rounded-lg bg-muted/30",
                              test.passed ? "text-easy" : "text-hard",
                            )}
                          >
                            {test.actual}
                          </pre>
                        </div>
                      </div>
                      {test.error && (
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">错误信息</div>
                          <pre className="font-mono text-sm p-2 rounded-lg bg-hard/10 text-hard">
                            {test.error}
                          </pre>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
