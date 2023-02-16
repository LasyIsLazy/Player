<script lang="ts" setup>
import { PlayStatus } from '../../stores/player'
import CommonIcon from './CommonIcon.vue'

withDefaults(
  defineProps<{
    status: PlayStatus
  }>(),
  {
    status: PlayStatus.Playing,
  }
)
</script>
<template>
  <CommonIcon :name="status !== PlayStatus.Playing ? 'play' : 'pause'" />
</template>
<style lang="scss" scoped>
.play-icon {
  width: 100%;
  height: 100%;
  fill: currentColor;
  overflow: hidden;
}
</style>
