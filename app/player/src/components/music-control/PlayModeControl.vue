<script setup lang="ts">
import { toRefs } from 'vue'
import { usePlayerStore } from '../../stores/player'
import PlayModeIcon from '../icon/PlayModeIcon.vue'
import { PlayModeList } from '@/common/const'

const playerStore = usePlayerStore()
const { playMode } = toRefs(playerStore)
const handleClick = () => {
  const idx = PlayModeList.indexOf(playMode.value)
  playMode.value = PlayModeList[idx + 1] || PlayModeList[0]
}
</script>

<template>
  <div class="volume-control">
    <PlayModeIcon
      :mode="playMode"
      @click="handleClick"
    />
  </div>
</template>
<style lang="scss"></style>
