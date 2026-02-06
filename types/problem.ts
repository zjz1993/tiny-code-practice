import { Category, Difficulty } from "@/data/problem";

export interface Problem {
  id: number;
  title: string;
  titleCn: string;
  difficulty: Difficulty;
  category: Category;
  tags: string[];
  acceptance: number;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: string;
  solution?: string;
  solved?: boolean;
}
