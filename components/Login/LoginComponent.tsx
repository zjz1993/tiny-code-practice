import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Modal } from "@/components/ui/modal/index";
import LoginPanel from "@/components/Login/LoginPanel";
import useGetUser from "@/hooks/useGetUser";
import LoginUserPanel from "@/components/Login/LoginUserPanel";

const LoginComponent = () => {
  const [open, setOpen] = useState(false);
  const user = useGetUser();
  return (
    <>
      {user ? (
        <LoginUserPanel />
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setOpen(true)}
          >
            <User className="h-4 w-4" />
            登录
          </Button>
        </>
      )}
      <Modal open={open} onOpenChange={setOpen} title="登录/注册" footer={null}>
        <LoginPanel
          onLoginSuccess={() => {
            setOpen(false);
          }}
        />
      </Modal>
    </>
  );
};
export default LoginComponent;
