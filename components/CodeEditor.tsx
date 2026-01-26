import { useState } from "react";
import { Copy, Check, Play, RotateCcw } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onRun?: () => void;
  onReset?: () => void;
  language?: string;
}

export function CodeEditor({
  code,
  onChange,
  onRun,
  onReset,
  language = "javascript",
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "");
  };

  return (
    <div className="rounded-xl border border-border/50 bg-code-bg overflow-hidden">
      {/* Editor header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-muted-foreground font-mono ml-2">
            solution.{language === "css" ? "css" : language === "typescript" ? "ts" : "js"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
          {onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Monaco Editor */}
      <Editor
        height="350px"
        language={
          language === "css" ? "css" : language === "typescript" ? "typescript" : "javascript"
        }
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          formatOnPaste: true,
          formatOnType: true,
        }}
      />

      {/* Run button */}
      {onRun && (
        <div className="px-4 py-3 border-t border-border/50 bg-muted/20">
          <Button onClick={onRun} className="gap-2">
            <Play className="h-4 w-4" />
            运行代码
          </Button>
        </div>
      )}
    </div>
  );
}
