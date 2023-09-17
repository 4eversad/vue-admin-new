import { defineStore } from "pinia";
import { logOutApi, loginApi } from "../../api/auth";
import type { LoginData, LoginResult } from "../../api/auth/type";
import { getUserInfo } from "@/api/user";
import { UserInfo } from "@/api/user/type";

import { store } from "@/store";
import { resetRouter } from "@/router";

export const useUserStore = defineStore("user", () => {
  const token = useStorage("accessToken", "");
  const userId = ref();
  const nickname = ref("");
  const avatar = ref("");
  const roles = ref<string[]>([]);
  const perms = ref<Array<string>>([]);

  /**
   * 登录
   * @param loginData
   * @returns
   */
  function login(loginData: LoginData) {
    return new Promise<any>((resolve, reject) => {
      loginApi(loginData)
        .then((res) => {
          const { tokenType, accessToken } = res.data;

          token.value = tokenType + " " + accessToken;
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 登录成功后获取用户信息（昵称、头像、权限集合和角色集合）
   */
  function getInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      getUserInfo()
        .then(({ data }) => {
          if (!data) {
            return reject("认证失败,请重新登录");
          }
          if (!data.roles || data.roles.length <= 0) {
            reject("getUserInfo: roles must be a non-null array");
          }
          userId.value = data.userId;
          nickname.value = data.nickname;
          avatar.value = data.avatar;
          roles.value = data.roles;
          perms.value = data.perms;
          resolve(data);
        })
        .catch((err) => reject(err));
    });
  }
  /**
   * 注销
   */
  function logout() {
    return new Promise<void>((resolve) => {
      logOutApi().then(() => {
        resetRouter();
        resetToken();
        // 清空路由,重新请求页面
        location.reload();
        resolve();
      });
    });
  }

  /**
   * 清空用户信息
   */
  function resetToken() {
    token.value = "";
    nickname.value = "";
    avatar.value = "";
    roles.value = [];
    perms.value = [];
  }

  return {
    login,
    token,
    getInfo,
    userId,
    nickname,
    avatar,
    roles,
    perms,
    resetToken,
    logout,
  };
});
export function useUserStoreHook() {
  return useUserStore(store);
}
