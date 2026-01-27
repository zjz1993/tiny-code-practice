import { Input } from "../ui/input";
import { z } from "zod";
import { Form, FormField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { useAuthStore, User } from "@/stores/authStores";
import { apiPost } from "@/lib/request";

const loginSchema = z.object({
  email: z.string().trim().min(1, { message: "请输入邮箱" }).email("请输入正确格式的邮箱"),
  password: z
    .string({ required_error: "请输入密码" })
    .trim()
    .min(1, { message: "请输入密码" })
    .min(6, "至少六位"),
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginPanel = () => {
  const setUser = useAuthStore((s) => s.setUser);
  return (
    <div>
      <Form
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
          {(register) => <Input {...register} />}
        </FormField>

        <FormField<LoginValues> name="password" label="密码">
          {(register) => <Input type="password" {...register} />}
        </FormField>

        <Button>登录</Button>
      </Form>
    </div>
  );
};
export default LoginPanel;
