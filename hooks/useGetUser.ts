import { useAuthStore } from "@/stores/authStores";

export function useGetUser() {
  return useAuthStore((s) => s.user);
}
export default useGetUser;
