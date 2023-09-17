<template>
  <div v-if="!item.meta || !item.meta.hidden">
    <!-- 只包含一个子节点的路由 -->
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChild)
      "
    >
      <AppLink v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <svg-icon
            v-if="onlyOneChild.meta && onlyOneChild.meta.icon"
            :icon-class="onlyOneChild.meta.icon"
          />
          <template #title>
            {{ translateRouteTitleI18n(onlyOneChild.meta.title) }}
          </template>
        </el-menu-item>
      </AppLink>
    </template>

    <el-sub-menu v-else :index="resolvePath(item.path)" teleported>
      <template #title>
        <svg-icon
          v-if="item.meta && item.meta.icon"
          :icon-class="item.meta.icon"
        />
        <span v-if="item.meta && item.meta.title">{{
          translateRouteTitleI18n(item.meta.title)
        }}</span>
      </template>
      <SidebarItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      ></SidebarItem>
    </el-sub-menu>
  </div>
</template>

<script lang="ts" setup>
import AppLink from "./Link.vue";
import { translateRouteTitleI18n } from "../../../utils/i18n";
import { isExternal } from "@/utils/index";
import path from "path-browserify";
const props = defineProps({
  /**
   * 路由(e.g: level_3_1)
   */
  item: {
    type: Object,
    required: true,
  },
  /**
   * 父层级完整路由路径
   */
  basePath: {
    type: String,
    required: true,
  },
});
const onlyOneChild = ref(); //临时变量,唯一子路由

/**
 * 判断是否只有一个子路由或者没有路由
 * @param children 子路由
 * @param parent 当前路由
 */
function hasOneShowingChild(children = [], parent: any) {
  const showingChild = children.filter((item: any) => {
    // 如果是不展示的路由,就返回false,过滤掉
    if (item.meta?.hidden) {
      return false;
    } else {
      onlyOneChild.value = item;
      return true;
    }
  });

  if (showingChild.length === 1) {
    // 只有一个子路由的情况下
    return true;
  }
  if (showingChild.length === 0) {
    // 当前路由没有子路由,复制当前的信息,path为""是因为后面要拼接path
    onlyOneChild.value = { ...parent, path: "", noshowingChildren: true };
    // console.log(onlyOneChild.value);

    return true;
  }
  return false;
}
declare module "path-browserify";
/**
 * 解析路径
 * @param routePath 路由路径
 */
function resolvePath(routePath: string) {
  if (routePath == "https://juejin.cn/post/7228990409909108793") {
    return "https://cloud.tencent.com/developer/article/2315077";
  }

  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }
  // 拼接路径, 相对->绝对
  const fullPath = path.resolve(props.basePath, routePath);
  return fullPath;
}
</script>
<style lang="less" scoped></style>
