import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { IdentityService } from "@/app/services/identityService";
import type { User } from "@/app/types";
import { userSignal } from "@/signals/userSignal";
export default function useUser(country: string) {
  const identityService = new IdentityService();

  const userQuery = useQuery<User, Error>({
    queryKey: ["user", country],
    queryFn: async () => {
      console.log("用户请求发起");
      const baseUser = await userService.fetchUser(country);

      // 增强用户信息，添加新的身份字段
      const enhancedUser = identityService.enhanceUser(baseUser);

      userSignal.value = enhancedUser;
      return enhancedUser;
    },
    enabled: !!country,
    refetchOnWindowFocus: false, // 在窗口重新聚焦时不要重新获取数据
  });

  return {
    isLoading: userQuery.isLoading,
    error: userQuery.error,
    refetch: userQuery.refetch,
  };
}
