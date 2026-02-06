import { Input } from "../ui/input";
import { z } from "zod";
import { Form, FormField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStores";
import { apiPost } from "@/lib/request";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { delay } from "@/lib/utils/index";
import { User } from "@/types/index";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "请输入邮箱" })
    .email("请输入正确格式的邮箱"),
  password: z
    .string({ required_error: "请输入密码" })
    .trim()
    .min(1, { message: "请输入密码" })
    .min(6, "至少六位"),
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginPanel = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [mode] = useState("login");
  const [form] = Form.useForm({
    schema: loginSchema,
    defaultValues: { email: "", password: "" },
  });
  const setUser = useAuthStore((s) => s.setUser);
  return (
    <div>
      <AnimatePresence mode="wait">
        <Form
          form={form}
          schema={loginSchema}
          onSubmit={async (values) => {
            console.log("values是", values);
            const data = await apiPost<{ user: User }>("/api/login", {
              email: values.email,
              password: values.password,
            });
            setUser(data.user);
          }}
        >
          <FormField<LoginValues> name="email" label="邮箱">
            {(register) => (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Input {...register} />
              </motion.div>
            )}
          </FormField>

          <FormField<LoginValues> name="password" label="密码">
            {(register) => <Input type="password" {...register} />}
          </FormField>

          <Button
            className="w-full mb-2"
            onClick={async () => {
              const data = await form.validate();
              const res = await apiPost<{ user: User }>("/api/login", {
                ...data,
              });
              setUser(res.user);
              onLoginSuccess();
            }}
          >
            登录
          </Button>
        </Form>
      </AnimatePresence>
      <div className="text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            还没有账号？{" "}
            <button
              type="button"
              // onClick={switchMode}
              className="text-primary hover:underline"
            >
              立即注册
            </button>
          </>
        ) : (
          <>
            已有账号？{" "}
            <button
              type="button"
              // onClick={switchMode}
              className="text-primary hover:underline"
            >
              立即登录
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default LoginPanel;
