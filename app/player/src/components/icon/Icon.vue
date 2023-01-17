<script lang="ts" setup>
defineProps<{
  name: "pause" | "play" | "next" | "last";
}>();
</script>
<template>
  <svg class="icon">
    <!-- cspell: disable -->
    <use xlink:href="#iconfont-shangyiji" v-if="name === 'last'"></use>
    <use xlink:href="#iconfont-xiayiji" v-if="name === 'next'"></use>
    <use xlink:href="#iconfont-zanting" v-if="name === 'pause'"></use>
    <use xlink:href="#iconfont-bofang" v-if="name === 'play'"></use>
    <!-- cspell: enable -->
  </svg>
</template>
<style lang="scss" scoped>
.icon {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
</style>
