<script setup lang="ts">
import { toRefs } from 'vue'
import { usePlayerStore } from '../../stores/player'
import Icon from '../icon/CommonIcon.vue'
import ProgressBar from '../progress-bar/ProgressBar.vue'

const playerStore = usePlayerStore()
const { volume } = toRefs(playerStore)
const { setVolume } = playerStore
</script>

<template>
  <div class="volume-control">
    <Icon
      name="volume"
      class="volume-icon"
    />
    <ProgressBar
      :progress="volume"
      direction="column-reverse"
      class="progress"
      @progress-change="setVolume"
    />
  </div>
</template>
<style lang="scss">
.volume-control {
  --hover-display: none;
  position: relative;
  &:hover {
    --hover-display: block;
  }
}
.progress {
  display: var(--hover-display);
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -100%);
  width: 10px;
  height: 150px;
  z-index: 1;
}
</style>
