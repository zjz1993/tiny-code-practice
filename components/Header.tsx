"use client";
import { Code2, Settings, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import LoginComponent from "@/components/Login/LoginComponent";

export function Header() {
  const router = useRouter();
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 gradient-primary blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <Code2 className="relative h-8 w-8 text-primary" />
          </div>
          <span className="text-xl font-bold font-mono gradient-text">
            FE-Code
          </span>
        </Link>

        {/*<nav className="hidden md:flex items-center gap-6">*/}
        {/*  <Link*/}
        {/*    href="/"*/}
        {/*    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"*/}
        {/*  >*/}
        {/*    题库*/}
        {/*  </Link>*/}
        {/*  <Link*/}
        {/*    href="/explore"*/}
        {/*    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"*/}
        {/*  >*/}
        {/*    探索*/}
        {/*  </Link>*/}
        {/*  <Link*/}
        {/*    href="/discuss"*/}
        {/*    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"*/}
        {/*  >*/}
        {/*    讨论*/}
        {/*  </Link>*/}
        {/*</nav>*/}

        <div className="flex items-center gap-3">
          {/*<Button variant="ghost" size="icon" className="text-muted-foreground">*/}
          {/*  <Trophy className="h-5 w-5" />*/}
          {/*</Button>*/}
          <LoginComponent />
        </div>
      </div>
    </motion.header>
  );
}
