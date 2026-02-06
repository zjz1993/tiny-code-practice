"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { mockTags, MockTag } from "@/data/mock/users";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal/index";

const colorOptions = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
];

export default function TagManagement() {
  const [tags, setTags] = useState<MockTag[]>(mockTags);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<MockTag | null>(null);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.nameCn.includes(searchTerm),
  );

  const handleDeleteTag = (id: string) => {
    setTags(tags.filter((t) => t.id !== id));
    toast.success("标签已删除");
  };

  const handleEditTag = (tag: MockTag) => {
    setEditingTag(tag);
    setSelectedColor(tag.color);
    setIsDialogOpen(true);
  };

  const handleSaveTag = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tagData = {
      name: formData.get("name") as string,
      nameCn: formData.get("nameCn") as string,
      color: selectedColor,
    };

    if (editingTag) {
      setTags(
        tags.map((t) => (t.id === editingTag.id ? { ...t, ...tagData } : t)),
      );
      toast.success("标签已更新");
    } else {
      const newTag: MockTag = {
        id: String(Date.now()),
        ...tagData,
        problemCount: 0,
      };
      setTags([...tags, newTag]);
      toast.success("标签已创建");
    }

    setIsDialogOpen(false);
    setEditingTag(null);
    setSelectedColor(colorOptions[0]);
  };

  const openNewTagDialog = () => {
    setEditingTag(null);
    setSelectedColor(colorOptions[0]);
    setIsDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">标签管理</h1>
          <p className="text-muted-foreground">管理题目分类标签</p>
        </div>
        <Button onClick={openNewTagDialog}>
          <Plus className="h-4 w-4 mr-2" />
          添加标签
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <motion.div
        layout
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {filteredTags.map((tag) => (
          <motion.div
            key={tag.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: -20,
            }}
            transition={{ duration: 0.25 }}
          >
            <Card className="group relative overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: tag.color }}
              />
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                      }}
                    >
                      {tag.nameCn}
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">
                      {tag.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tag.problemCount} 道题目
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditTag(tag)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteTag(tag.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      <Modal
        title={editingTag ? "编辑标签" : "添加标签"}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <form onSubmit={handleSaveTag} className="space-y-4">
          <div className="space-y-2">
            <span>英文名称</span>
            <Input
              id="name"
              name="name"
              placeholder="array"
              defaultValue={editingTag?.name}
              required
            />
          </div>
          <div className="space-y-2">
            <span>中文名称</span>
            <Input
              id="nameCn"
              name="nameCn"
              placeholder="数组"
              defaultValue={editingTag?.nameCn}
              required
            />
          </div>
          <div className="space-y-2">
            <span>颜色</span>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-foreground scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              取消
            </Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
