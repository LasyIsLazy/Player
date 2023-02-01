<script lang="ts" setup>
import { usePlayerStore } from '@/stores/player'
import { computed, toRefs } from 'vue'

// TODO: 样式
const { lyrics, curTime } = toRefs(usePlayerStore())

const curIdx = computed(() => {
  if (!lyrics.value) {
    return -1
  }
  let cur = 0
  for (let index = 0; index < lyrics.value.lyricLines.length; index++) {
    const { time } = lyrics.value.lyricLines[index]
    if (time >= curTime.value * 1000) {
      cur = index - 1
      break
    }
  }
  return cur
})
const getClass = (idx: number) => {
  if (idx > curIdx.value) {
    return 'going'
  }
  if (idx < curIdx.value) {
    return 'passed'
  }
  return 'current'
}
</script>

<template>
  <div class="lyric-panel">
    {{ curTime * 1000 }}
    <div
      v-for="({ text, time }, idx) in lyrics?.lyricLines"
      :key="time + text"
      :class="getClass(idx)"
    >
      {{ time }} - {{ text }}
    </div>
  </div>
</template>

<style lang="scss">
main {
  overflow: auto;
}
.going {
  color: black;
}
.passed {
  color: grey;
}
.current {
  color: green;
}
</style>
