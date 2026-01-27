import { Input } from "../ui/input";
import { z } from "zod";
import { Form, FormField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStores";

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
  const setAuth = useAuthStore((s) => s.setAuth);
  return (
    <div>
      <Form
        schema={loginSchema}
        onSubmit={(values) => {
          console.log("values是", values);
          setAuth({ id: "1", username: "test", email: values.email }, "testToken");
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
