import { defineStore } from "pinia";
import { store } from "../index";
import { RouteRecordRaw } from "vue-router";
import { listRoutes } from "@/api/menu";
import { constantRoutes } from "@/router/";
const modules = import.meta.glob("../../views/**/**.vue");
const Layout = () => import("@/layout/index.vue");
/**
 * 判断角色是否有路由权限
 * @param roles 用户角色集合
 * @param route 路由
 */

const hasPermission = (roles: Array<string>, route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    // 如果是超管,拥有所有权限,无需验证,直接返回
    if (roles.includes("ROOT")) {
      return true;
    }
    return roles.some((role) => {
      if (route.meta?.roles !== undefined) {
        return (route.meta.roles as string[]).includes(role);
      }
    });
  }

  return false;
};

/**
 * 递归出有权限的路由
 * @param routes 接口返回的所有路由(动态)
 * @param roles 用户角色集合
 * @return 返回用户有权限的路由集合(动态)
 */

const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const asyncRoutes: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    const tmpRoute = { ...route }; // 复制对象
    if (!route.name) {
      tmpRoute.name = route.path;
    }
    if (hasPermission(roles, tmpRoute)) {
      if (tmpRoute.component?.toString() == "Layout") {
        tmpRoute.component = Layout;
      } else {
        const component = modules[`../../views/${tmpRoute.component}.vue`];
        if (component) {
          tmpRoute.component = component;
        } else {
          tmpRoute.component = modules[`../../views/error-page/404.vue`];
        }
      }
      if (tmpRoute.children) {
        tmpRoute.children = filterAsyncRoutes(tmpRoute.children, roles);
      }
      asyncRoutes.push(tmpRoute);
    }
  });

  return asyncRoutes;
};

//setup
export const usePermissionStore = defineStore("permission", () => {
  //state
  const routes = ref<RouteRecordRaw[]>([]);
  //actions
  /**
   * 拼接路由
   */
  const setRoutes = (newRoutes: RouteRecordRaw[]) => {
    routes.value = constantRoutes.concat(newRoutes);
  };

  function generateRoutes(roles: string[]) {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      listRoutes()
        .then(({ data: asyncRoutes }) => {
          const accessRoutes = filterAsyncRoutes(asyncRoutes, roles);
          setRoutes(accessRoutes);
          resolve(accessRoutes);
        })
        .catch((err) => reject(err));
    });
  }
  return { generateRoutes, routes, setRoutes };
});

export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
