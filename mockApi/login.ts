import { delay } from "@/lib/utils";
import { User } from "@/stores/authStores";

export type TApi<T> = {
  code: number;
  data: T;
};

export async function mockLogin(): Promise<TApi<User & { token: string }>> {
  await delay();
  return {
    code: 200,
    data: {
      id: "1",
      username: "这是模拟的用户名",
      email: "123@qq.com",
      role: "admin",
      token: "qwerasdfzxcv",
    },
  };
}
