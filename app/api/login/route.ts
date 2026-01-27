import { NextResponse } from "next/server";
import { mockLogin } from "@/mockApi/login";

export async function POST(req: Request) {
  try {
    // 这里你可以解析前端发送的 body
    // const body = await req.json();
    // console.log(body);

    // 调用模拟登录接口
    const res = await mockLogin();

    if (res.code !== 200 || !res.data) {
      return NextResponse.json({ error: "登录失败" }, { status: 401 });
    }

    const response = NextResponse.json({ user: res.data });

    // 设置 HttpOnly cookie
    response.cookies.set("token", res.data.token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 天
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: "服务异常" }, { status: 500 });
  }
}
