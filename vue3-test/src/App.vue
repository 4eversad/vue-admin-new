<template>
  <el-config-provider>
    <router-view />
  </el-config-provider>
</template>

<script lang="ts">
import { ElConfigProvider } from "element-plus";
// import { useAppStore } from "../src/store/modules/app";
// const appStore = useAppStore();

export default defineComponent({
  setup() {
    return {};
  },
});
</script>
<style lang="scss" scoped></style>
