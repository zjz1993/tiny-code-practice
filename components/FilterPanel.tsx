import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "./CategoryBadge";
import { categories, Difficulty, Category } from "@/data/problem";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDifficulty: Difficulty | null;
  onDifficultyChange: (difficulty: Difficulty | null) => void;
  selectedCategory: Category | null;
  onCategoryChange: (category: Category | null) => void;
}

export function FilterPanel({
  searchQuery,
  onSearchChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedCategory,
  onCategoryChange,
}: FilterPanelProps) {
  const [showFilters, setShowFilters] = useState(false);

  const difficulties: { value: Difficulty; label: string; color: string }[] = [
    { value: "easy", label: "简单", color: "text-easy bg-easy/10 border-easy/20" },
    { value: "medium", label: "中等", color: "text-medium bg-medium/10 border-medium/20" },
    { value: "hard", label: "困难", color: "text-hard bg-hard/10 border-hard/20" },
  ];

  const hasFilters = selectedDifficulty || selectedCategory;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索题目..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-card/50 border-border/50 focus:border-primary/50"
          />
        </div>
        <Button
          variant={showFilters ? "secondary" : "outline"}
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="h-4 w-4" />
          {hasFilters && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          )}
        </Button>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl border border-border/50 bg-card/50 space-y-4">
              {/* Difficulty filter */}
              <div>
                <div className="text-sm font-medium mb-2 text-muted-foreground">难度</div>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((d) => (
                    <button
                      key={d.value}
                      onClick={() =>
                        onDifficultyChange(selectedDifficulty === d.value ? null : d.value)
                      }
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                        d.color,
                        selectedDifficulty === d.value &&
                          "ring-2 ring-offset-2 ring-offset-background",
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category filter */}
              <div>
                <div className="text-sm font-medium mb-2 text-muted-foreground">分类</div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <CategoryBadge
                      key={category}
                      category={category}
                      active={selectedCategory === category}
                      onClick={() =>
                        onCategoryChange(selectedCategory === category ? null : category)
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onDifficultyChange(null);
                    onCategoryChange(null);
                  }}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  清除筛选
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
