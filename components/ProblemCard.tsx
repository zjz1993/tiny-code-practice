import { Check, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { DifficultyBadge } from "./DifficultyBadge";
import { CategoryBadge } from "./CategoryBadge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Problem } from "@/types/index";

interface ProblemCardProps {
  problem: Problem;
  index: number;
}

export function ProblemCard({ problem, index }: ProblemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/problem/${problem.id}`} className="group block">
        <div
          className={cn(
            "relative p-4 rounded-xl border border-border/50 bg-card/50",
            "hover:border-primary/30 hover:bg-card transition-all duration-300",
            "hover:shadow-lg hover:shadow-primary/5",
          )}
        >
          {/* Solved indicator */}
          {problem.solved && (
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full" />
          )}

          <div className="flex items-center gap-4">
            {/* Problem number and solved status */}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
              {problem.solved ? (
                <Check className="h-5 w-5 text-primary" />
              ) : (
                <span className="font-mono text-muted-foreground">
                  {problem.id.toString().padStart(2, "0")}
                </span>
              )}
            </div>

            {/* Problem info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                  {problem.titleCn}
                </h3>
                <DifficultyBadge difficulty={problem.difficulty} />
              </div>
              <div className="flex items-center gap-2">
                <CategoryBadge category={problem.category} />
                <span className="text-xs text-muted-foreground">
                  通过率 {problem.acceptance}%
                </span>
              </div>
            </div>

            {/* Arrow */}
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
