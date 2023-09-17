<template>
  <!-- 如果是外部链接,那就打开一个新的窗口 -->
  <a v-if="isExternal(to)" :href="to" target="_blank" rel="noopener">
    <slot />
  </a>
  <div v-else @click="push">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/modules/app";
import { isExternal } from "@/utils/index";
const appStore = useAppStore();
const router = useRouter();
const device = computed(() => appStore.device);
const sidebar = computed(() => appStore.sidebar);
const props = defineProps({
  to: {
    type: String,
    required: true,
  },
});

/**
 * 如果是手机端,那么在进入链接后收起侧边栏
 */
function push() {
  if (device.value === "mobile" && sidebar.value.opened == true) {
    appStore.closeSideBar(false);
  }
  router.push(props.to).catch((err) => {
    console.log(err);
  });
}
</script>
<style lang="less" scoped></style>
