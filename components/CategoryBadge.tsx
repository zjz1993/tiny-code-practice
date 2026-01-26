import { Category } from "@/data/problem";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: Category;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

const categoryColors: Record<Category, string> = {
  JavaScript: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  CSS: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  HTML: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  React: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  TypeScript: "bg-blue-600/10 text-blue-400 border-blue-400/20",
  DOM: "bg-purple-500/10 text-purple-400 border-purple-400/20",
};

export function CategoryBadge({ category, className, active, onClick }: CategoryBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all",
        active
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : "hover:ring-1 hover:ring-border",
        categoryColors[category],
        onClick && "cursor-pointer",
        className,
      )}
    >
      {category}
    </button>
  );
}
