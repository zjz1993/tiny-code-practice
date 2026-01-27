export async function request<T = unknown>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: "include", // 发送 cookie
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "请求失败");
  }

  return data;
}

export const apiPost = <T>(url: string, body?: unknown) =>
  request<T>(url, { method: "POST", body: JSON.stringify(body) });

export const apiGet = <T>(url: string) => request<T>(url, { method: "GET" });
