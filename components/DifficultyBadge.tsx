import { Difficulty, getDifficultyBgColor, getDifficultyLabel } from "@/data/problem";
import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getDifficultyBgColor(difficulty),
        className,
      )}
    >
      {getDifficultyLabel(difficulty)}
    </span>
  );
}
