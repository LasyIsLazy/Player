<script lang="ts" setup>
import { usePlayerStore } from '@/stores/player'
import { computed, toRefs } from 'vue'

// TODO: 样式
const { lyrics, curTime } = toRefs(usePlayerStore())

const curIdx = computed(() => {
  if (!lyrics.value) {
    return -1
  }
  let cur = -1
  for (let index = 0; index < lyrics.value.lyricLines.length; index++) {
    const { time } = lyrics.value.lyricLines[index]
    if (time > curTime.value * 1000) {
      // 这一行还没开始
      cur = index - 1
      break
    }
    if (time === curTime.value * 1000) {
      // 刚好到这一行
      cur = index
      break
    }
  }
  if (cur === -1) {
    // 最后一行
    return lyrics.value.lyricLines.length - 1
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
const positionStyle = computed(() => {
  return {
    top: `calc(50% - ${curIdx.value * 24}px - 12px)`,
  }
})
</script>

<template>
  <div class="lyric-panel">
    <div
      class="container"
      :style="positionStyle"
    >
      <div
        v-for="({ text, time }, idx) in lyrics?.lyricLines"
        :key="time + text"
        :class="getClass(idx)"
      >
        {{ text }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.going {
  color: black;
}
.passed {
  color: grey;
}
.current {
  color: green;
}
.container {
  position: relative;
}
</style>
