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
      direction="horizon"
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
  transform: translateY(-100%);
  width: 30px;
  height: 150px;
}
</style>
