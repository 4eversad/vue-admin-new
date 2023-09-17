import router from "@/router";
const whiteList = ["/login"];
import { useUserStoreHook } from "./store/modules/user";
import { usePermissionStoreHook } from "./store/modules/permission";
const userStore = useUserStoreHook();
const permissionStore = usePermissionStoreHook();

router.beforeEach(async (to, from, next) => {
  const hasToken = localStorage.getItem("accessToken");
  if (hasToken) {
    if (to.path == "/login") {
      console.log(1);
      next({ path: "/" });
    } else {
      // 检查是否有此角色?
      const hasRoles = userStore.roles && userStore.roles.length > 0;
      if (hasRoles) {
        // 如果没有对应的路由,跳转404
        if (to.matched.length === 0) {
          from.name ? next({ name: from.name }) : next("/404");
        } else {
          // 一切正常,正常进入
          next();
        }
      } else {
        // 没有角色,分配角色
        try {
          const { roles } = await userStore.getInfo();

          const accessRoutes = await permissionStore.generateRoutes(roles);
          accessRoutes.forEach((route) => {
            router.addRoute(route);
          });

          next({ ...to, replace: true });
        } catch (error) {
          next();
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) != -1) {
      console.log(3);
      next();
    } else {
      console.log(4);
      next(`/login?redirect=${to.path}`);
    }
  }
});
