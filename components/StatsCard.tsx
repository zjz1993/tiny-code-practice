import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: number;
  total?: number;
  color: "easy" | "medium" | "hard" | "primary";
  delay?: number;
}

const colorMap = {
  easy: "text-easy",
  medium: "text-medium",
  hard: "text-hard",
  primary: "text-primary",
};

const bgColorMap = {
  easy: "bg-easy/10",
  medium: "bg-medium/10",
  hard: "bg-hard/10",
  primary: "bg-primary/10",
};

export function StatsCard({ label, value, total, color, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={cn("p-4 rounded-xl border border-border/50", bgColorMap[color])}
    >
      <div className={cn("text-2xl font-bold font-mono mb-1", colorMap[color])}>
        {value}
        {total !== undefined && <span className="text-muted-foreground text-lg">/{total}</span>}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}
