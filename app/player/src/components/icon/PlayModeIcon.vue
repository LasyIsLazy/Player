<script lang="ts" setup>
import { PlayMode } from '@/common/const'
import CommonIcon from './CommonIcon.vue'

defineProps<{
  mode: PlayMode
}>()
</script>
<template>
  <CommonIcon :name="`play-mode-${mode}`" />
</template>
<style lang="scss" scoped>
.play-icon {
  width: 100%;
  height: 100%;
  fill: currentColor;
  overflow: hidden;
}
</style>
