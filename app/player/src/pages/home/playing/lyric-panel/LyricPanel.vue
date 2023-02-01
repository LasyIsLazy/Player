<script lang="ts" setup>
import { usePlayerStore } from '@/stores/player'
import { toRefs } from 'vue'

// TODO: 样式
const { lyrics } = toRefs(usePlayerStore())
</script>

<template>
  <div class="lyric-panel">
    <div
      v-for="{ text, time } in lyrics?.lyricLines"
      :key="time + text"
    >
      {{ text }}
    </div>
  </div>
</template>

<style lang="scss">
main {
  overflow: auto;
}
</style>
