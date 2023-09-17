<template>
  <div class="app-wrapper" :class="classObj">
    <!-- 手机遮罩层 -->
    <div class="drawer-bg"></div>
    <!-- 侧边栏 <sidebar /> -->
    <sidebar class="sidebar-container"></sidebar>

    <!-- 主要内容 -->
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar></navbar>
        <!-- tag-view -->
        <tagsView v-if="showTagsView"></tagsView>
      </div>

      <!-- 主页面 <app-main/> -->
      <AppMain></AppMain>

      <!-- 设置面板 <right-panel/> -->
      <right-panel>
        <Settings></Settings>
      </right-panel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Sidebar from "./components/Sidebar/index.vue";
import AppMain from "./components/AppMain.vue";
import tagsView from "./components/TagsView/index.vue";
import { useAppStore } from "@/store/modules/app";
import Navbar from "./components/Navbar.vue";
import { useSettingsStore } from "@/store/modules/settings";
const settings = useSettingsStore();
const appStore = useAppStore();
const fixedHeader = computed(() => settings.fixedHeader);
const showTagsView = computed(() => settings.tagsView);
// 动态设置类
const classObj = computed(() => ({
  hideSidebar: !appStore.sidebar.opened,
  openSidebar: appStore.sidebar.opened,
  withoutAnimation: appStore.sidebar.withoutAnimation,
  mobile: appStore.device === "mobile",
}));

/**
 * 响应式布局容器固定宽度
 *
 * 大屏（>=1200px）
 * 中屏（>=992px）
 * 小屏（>=768px）
 */
// const WIDTH = 992;
</script>
<style lang="scss" scoped>
.app-wrapper {
  &::after {
    display: table;
    clear: both;
    content: "";
  }

  position: relative;
  width: 100%;
  height: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}

// .drawer-bg {
//   position: absolute;
//   top: 0;
//   z-index: 999;
//   width: 100%;
//   height: 100%;
//   background: #000;
//   opacity: 0.3;
// }
</style>
