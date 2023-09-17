<template>
  <div>
    <Main></Main>
  </div>
</template>

<script lang="ts" setup>
import Main from "./main.vue";
const { width } = useWindowSize();
import { useAppStore } from "@/store/modules/app";
const appStore = useAppStore();
const WIDTH = 992;

watchEffect(() => {
  if (width.value < WIDTH) {
    appStore.toggleDevice("mobile");
    appStore.closeSideBar(true);
  } else {
    appStore.toggleDevice("desktop");

    if (width.value >= 1200) {
      //大屏
      appStore.openSideBar(true);
    } else {
      appStore.closeSideBar(true);
    }
  }
});
</script>
<style lang="less" scoped></style>
