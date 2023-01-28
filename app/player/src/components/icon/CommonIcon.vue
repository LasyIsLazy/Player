<script lang="ts" setup>
defineProps<{
  name: 'pause' | 'play' | 'next' | 'last' | 'list' | 'volume'
}>()
</script>
<template>
  <svg class="icon">
    <!-- cspell: disable -->
    <use
      v-if="name === 'last'"
      xlink:href="#iconfont-shangyiji"
    />
    <use
      v-if="name === 'next'"
      xlink:href="#iconfont-xiayiji"
    />
    <use
      v-if="name === 'pause'"
      xlink:href="#iconfont-zanting"
    />
    <use
      v-if="name === 'play'"
      xlink:href="#iconfont-bofang"
    />
    <use
      v-if="name === 'list'"
      xlink:href="#iconfont-bofangduilie"
    />
    <use
      v-if="name === 'volume'"
      xlink:href="#iconfont-yinliang"
    />
    <!-- cspell: enable -->
  </svg>
</template>
<style lang="scss" scoped>
.icon {
  overflow: hidden;
  width: 100%;
  height: 100%;
  user-select: none;
}
</style>
