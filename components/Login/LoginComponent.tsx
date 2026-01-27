import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Modal } from "@/components/ui/modal/index";
import LoginPanel from "@/components/Login/LoginPanel";
import { useAuthStore } from "@/stores/authStores";

const LoginComponent = () => {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  return (
    <>
      {user ? (
        <div>你好{user.username}</div>
      ) : (
        <>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setOpen(true)}>
            <User className="h-4 w-4" />
            登录
          </Button>
          <Modal
            open={open}
            onOpenChange={setOpen}
            title="登录/注册"
            footer={
              <>
                <button onClick={() => setOpen(false)}>取消</button>
                <button className="px-3 py-1 bg-blue-500 text-white rounded">确定</button>
              </>
            }
          >
            <LoginPanel />
          </Modal>
        </>
      )}
    </>
  );
};
export default LoginComponent;
