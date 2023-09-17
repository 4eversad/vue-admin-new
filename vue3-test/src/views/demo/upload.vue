<template>
  <div class="app-container">
    <el-form>
      <el-form-item label="单图上传">
        <SingleUpload v-model="singlePicUrl"></SingleUpload>
      </el-form-item>
      <el-form-item label="多图上传">
        <MultiUpload v-model="multiPicUrls" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
const singlePicUrl = ref(
  "https://oss.youlai.tech/youlai-boot/2023/05/20/2b6d8b49fa1047348a0a41cef5aaf69e.gif"
);
// 这里放外链图片，防止被删
const multiPicUrls = ref([
  "https://s2.loli.net/2023/05/24/yNsxFC8rLHMZQcK.jpg",
  "https://s2.loli.net/2023/05/24/RuHFMwW4rG5lIqs.jpg",
  "https://s2.loli.net/2023/05/24/ZPiGbcpR91WqInB.jpg",
  "https://s2.loli.net/2023/05/24/e1bcnEq3MFdmlNL.jpg",
  "https://s2.loli.net/2023/05/24/wZTSPj1yDQNcuhU.jpg",
]);
</script>
<style lang="scss" scoped></style>
