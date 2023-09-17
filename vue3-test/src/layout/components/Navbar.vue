<template>
  <!-- 顶部导航栏 -->
  <div class="navbar">
    <!-- 左侧面包屑 -->
    <div class="flex">
      <Hamburger
        :is-active="appStore.sidebar.opened"
        @toggle-click="toggleSidebar"
      ></Hamburger>
    </div>
    <!-- 右侧导航栏 -->
    <div class="flex">
      <!-- 导航栏设置(窄屏隐藏) -->
      <div class="setting-container" v-if="device !== 'mobile'">
        <!-- 全屏 -->
        <div class="setting-item" @click="toggle">
          <svg-icon
            :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
          />
        </div>
        <!-- 布局大小 -->
        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select class="setting-item" />
        </el-tooltip>
        <!-- 语言选择 -->
        <lang-select class="setting-item" />
      </div>
      <!-- 用户头像 -->
      <el-dropdown trigger="click">
        <div class="avatar-container">
          <img :src="userStore.avatar + '?imageView2/1/w/80/h/80'" />
          <i-ep-caret-bottom class="w-3 h-3" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item>{{ $t("navbar.dashboard") }}</el-dropdown-item>
            </router-link>
            <a
              target="_blank"
              href="https://github.com/youlaitech/vue3-element-admin"
            >
              <el-dropdown-item>Github</el-dropdown-item>
            </a>
            <a target="_blank" href="https://gitee.com/y4eversad">
              <el-dropdown-item>{{ $t("navbar.gitee") }}</el-dropdown-item>
            </a>
            <a
              target="_blank"
              href="https://cloud.tencent.com/developer/article/2315077"
            >
              <el-dropdown-item>{{ $t("navbar.document") }}</el-dropdown-item>
            </a>
            <el-dropdown-item divided @click="logout">
              {{ $t("navbar.logout") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <div></div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/store/modules/app";
import { useUserStore } from "@/store/modules/user";
import { storeToRefs } from "pinia";
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore();
const { device } = storeToRefs(appStore);
const { isFullscreen, toggle } = useFullscreen();
const toggleSidebar = () => {
  appStore.toggleSidebar(true);
};
const logout = () => {
  ElMessageBox.confirm("确定注销并退出系统吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    userStore.logout().then(() => {
      router.push(`/login?redirect=${route.fullPath}`);
    });
  });
};
</script>
<style lang="scss" scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  background-color: #fff;
  box-shadow: 0 0 1px #0003;
}
.setting-item {
  display: inline-block;
  width: 30px;
  height: 50px;
  line-height: 50px;
  color: #5a5e66;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: rgb(249 250 251 / 100%);
  }
}
.avatar-container {
  display: flex;
  align-items: center;
  justify-items: center;
  margin: 0 5px;
  cursor: pointer;

  img {
    width: 40px;
    height: 40px;
    border-radius: 5px;
  }
}
</style>
