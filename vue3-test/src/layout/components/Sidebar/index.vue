<template>
  <div :class="{ 'has-logo': sidebarLogo }">
    <!-- <Logo>部分 -->
    <logo v-if="sidebarLogo" :collapse="!appStore.sidebar.opened" />
    <!-- 侧边栏替换原生滚动条 -->
    <el-scrollbar>
      <el-menu
        :default-active="currRoute.path"
        :collapse="!appStore.sidebar.opened"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <SidebarItem
          v-for="route in permissionStore.routes"
          :item="route"
          :key="route.path"
          :base-path="route.path"
          :is-collapse="!appStore.sidebar.opened"
        >
        </SidebarItem>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import SidebarItem from "./SidebarItem.vue";
import { useSettingsStore } from "@/store/modules/settings";
import { usePermissionStore } from "@/store/modules/permission";
import { useAppStore } from "@/store/modules/app";
import variables from "@/styles/variables.module.scss";
import Logo from "./Logo.vue";

const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const appStore = useAppStore();
const currRoute = useRoute();
const { sidebarLogo } = storeToRefs(settingsStore);
</script>
<style lang="scss" scoped>
.menu-wrap {
  z-index: 99;
  width: 100% !important;
  height: 50px;
  background-color: $menuBg;

  :deep(.header) {
    display: flex;
    width: 100%;
    // 顶部模式全局变量修改
    --el-menu-item-height: 50px;

    .logo-wrap {
      width: $sideBarWidth;
    }

    .el-menu {
      background-color: $menuBg;

      .el-menu-item {
        color: $menuText;
      }
    }

    .el-scrollbar {
      flex: 1;
      min-width: 0;
      height: 50px;
    }
  }
}
.left-menu {
  display: inline-block;
  width: $sideBarWidth;
  background-color: $menuBg;

  :deep(.el-menu) {
    background-color: $menuBg;

    .el-menu-item {
      color: $menuText;
    }
  }
}
</style>
