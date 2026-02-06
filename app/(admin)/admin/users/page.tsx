"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockUsers, MockUser } from "@/data/mock/users";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal/index";

export default function AdminUserPage() {
  const [users, setUsers] = useState<MockUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<MockUser | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    toast.success("用户已删除");
  };

  const handleEditUser = (user: MockUser) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as "admin" | "user",
      status: formData.get("status") as "active" | "inactive",
    };

    if (editingUser) {
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, ...userData } : u)),
      );
      toast.success("用户已更新");
    } else {
      const newUser: MockUser = {
        id: String(Date.now()),
        ...userData,
        solvedCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setUsers([...users, newUser]);
      toast.success("用户已创建");
    }

    setIsDialogOpen(false);
    setEditingUser(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">用户管理</h1>
          <p className="text-muted-foreground">管理平台用户和权限</p>
        </div>
        <Modal
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingUser ? "编辑用户" : "添加用户"}
        >
          {/*<form onSubmit={handleSaveUser} className="space-y-4">*/}
          {/*  <div className="space-y-2">*/}
          {/*    <Label htmlFor="username">用户名</Label>*/}
          {/*    <Input*/}
          {/*      id="username"*/}
          {/*      name="username"*/}
          {/*      defaultValue={editingUser?.username}*/}
          {/*      required*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*  <div className="space-y-2">*/}
          {/*    <Label htmlFor="email">邮箱</Label>*/}
          {/*    <Input*/}
          {/*      id="email"*/}
          {/*      name="email"*/}
          {/*      type="email"*/}
          {/*      defaultValue={editingUser?.email}*/}
          {/*      required*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*  <div className="space-y-2">*/}
          {/*    <Label htmlFor="role">角色</Label>*/}
          {/*    <Select name="role" defaultValue={editingUser?.role || "user"}>*/}
          {/*      <SelectTrigger>*/}
          {/*        <SelectValue />*/}
          {/*      </SelectTrigger>*/}
          {/*      <SelectContent>*/}
          {/*        <SelectItem value="admin">管理员</SelectItem>*/}
          {/*        <SelectItem value="user">普通用户</SelectItem>*/}
          {/*      </SelectContent>*/}
          {/*    </Select>*/}
          {/*  </div>*/}
          {/*  <div className="space-y-2">*/}
          {/*    <Label htmlFor="status">状态</Label>*/}
          {/*    <Select*/}
          {/*      name="status"*/}
          {/*      defaultValue={editingUser?.status || "active"}*/}
          {/*    >*/}
          {/*      <SelectTrigger>*/}
          {/*        <SelectValue />*/}
          {/*      </SelectTrigger>*/}
          {/*      <SelectContent>*/}
          {/*        <SelectItem value="active">激活</SelectItem>*/}
          {/*        <SelectItem value="inactive">禁用</SelectItem>*/}
          {/*      </SelectContent>*/}
          {/*    </Select>*/}
          {/*  </div>*/}
          {/*  <div className="flex justify-end gap-2">*/}
          {/*    <Button*/}
          {/*      type="button"*/}
          {/*      variant="outline"*/}
          {/*      onClick={() => setIsDialogOpen(false)}*/}
          {/*    >*/}
          {/*      取消*/}
          {/*    </Button>*/}
          {/*    <Button type="submit">保存</Button>*/}
          {/*  </div>*/}
          {/*</form>*/}
        </Modal>
        <Button
          onClick={() => {
            setEditingUser(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          添加用户
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索用户..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>已解决</TableHead>
              <TableHead>注册时间</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role === "admin" ? "管理员" : "用户"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.status === "active" ? "outline" : "destructive"
                    }
                  >
                    {user.status === "active" ? "激活" : "禁用"}
                  </Badge>
                </TableCell>
                <TableCell>{user.solvedCount}</TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditUser(user)}>
                        <Edit className="h-4 w-4 mr-2" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
