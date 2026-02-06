import { motion } from "framer-motion";
import { StatsCard } from "@/components/StatsCard";
import { FC, useMemo } from "react";
import { problems } from "@/data/problem";
import useGetUser from "@/hooks/useGetUser";

const IndexSidebar: FC = () => {
  const user = useGetUser();
  const stats = useMemo(() => {
    const solved = problems.filter((p) => p.solved).length;
    const easy = problems.filter((p) => p.difficulty === "easy");
    const medium = problems.filter((p) => p.difficulty === "medium");
    const hard = problems.filter((p) => p.difficulty === "hard");
    return {
      solved,
      total: problems.length,
      easy: { solved: easy.filter((p) => p.solved).length, total: easy.length },
      medium: {
        solved: medium.filter((p) => p.solved).length,
        total: medium.length,
      },
      hard: { solved: hard.filter((p) => p.solved).length, total: hard.length },
    };
  }, []);
  if (!user) {
    return null;
  }
  return (
    <motion.aside
      layout
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -200, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="sticky top-24 w-[300px] space-y-4"
    >
      <h2 className="text-lg font-semibold mb-4">刷题进度</h2>
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
        <StatsCard
          label="已完成"
          value={stats.solved}
          total={stats.total}
          color="primary"
          delay={0}
        />
        <StatsCard
          label="简单"
          value={stats.easy.solved}
          total={stats.easy.total}
          color="easy"
          delay={0.1}
        />
        <StatsCard
          label="中等"
          value={stats.medium.solved}
          total={stats.medium.total}
          color="medium"
          delay={0.2}
        />
        <StatsCard
          label="困难"
          value={stats.hard.solved}
          total={stats.hard.total}
          color="hard"
          delay={0.3}
        />
      </div>
    </motion.aside>
  );
};
export default IndexSidebar;
