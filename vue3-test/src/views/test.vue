<script setup>
import bg from "@/assets/logo.png";
const imgUrl = new URL("../assets/logo.png", import.meta.url).href;
</script>

<template>
  {{ bg }}
  <br />
  {{ imgUrl }}
  <div class="test-page">
    <!-- <img :src="bg" alt="" /> -->
    test
    <div :style="{ fontSize: '20px', backgroundImage: `url(${imgUrl})` }">
      33
    </div>
    <div class="test">123</div>
  </div>
</template>

<style lang="scss" scoped>
.test {
  // background-image: url("@/assets/logo.png");
}
</style>
