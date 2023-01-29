<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    progress: number
    direction: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    slide?: 'hover' | 'always' | 'hidden'
  }>(),
  {
    slide: 'hover',
  }
)
const progressBar = ref<HTMLElement>()
const emit = defineEmits<{
  (event: 'progress-change', value: number): void
}>()
const handleClick = (e: MouseEvent) => {
  console.log(e)
  console.log(e.y)
  const rect = progressBar.value?.getBoundingClientRect()
  if (!rect) {
    console.warn('Progress bar is not visible')
    return
  }
  const { width, height, x, y } = rect
  let per = (() => {
    switch (props.direction) {
      case 'row':
        return (e.x - x) / width
      case 'row-reverse':
        return 1 - (e.x - x) / width
      case 'column':
        return (e.y - y) / height
      case 'column-reverse':
        return 1 - (e.y - y) / height

      default:
        return 0
    }
  })()
  console.log('修改进度', per)
  emit('progress-change', per)
}

const blockShow = ref(false)
watch(
  () => props.slide,
  (val) => {
    switch (val) {
      case 'always':
        blockShow.value = true

        break
      case 'hover':
      case 'hidden':
        blockShow.value = false
        break

      default:
        break
    }
  },
  { immediate: true }
)
const handleMouseEnter = () => {
  if (props.slide !== 'hover') {
    return
  }
  blockShow.value = true
}
const handleMouseLeave = () => {
  if (props.slide !== 'hover') {
    return
  }
  blockShow.value = false
}

const progressPercentage = computed(() => props.progress * 100 + '%')
</script>
<template>
  <div
    ref="progressBar"
    class="progress-bar"
    @click="(e) => handleClick(e)"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="wrapper">
      <div class="fill" />
      <div
        v-show="blockShow"
        class="slide"
        :class="'slide-' + direction"
      />
    </div>
  </div>
</template>

<style lang="scss">
.progress-bar {
  position: relative;
  background-color: var(--background);
  &:hover {
    cursor: pointer;
  }

  // 暴露变量
  // 进度条容器
  --background: grey;
  // 进度条填充
  --fill-background: aqua;
  // 进度条滑块
  --slide-size: 15px;
  --slide-background: brown;
}
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: v-bind(direction);
}
.fill {
  flex: 0 0 v-bind(progressPercentage);
  background-color: var(--fill-background);
}
.slide {
  position: absolute;
  background: var(--slide-background);
  width: var(--slide-size);
  height: var(--slide-size);
  border-radius: 100%;
  &-row {
    top: 50%;
    left: v-bind(progressPercentage);
    transform: translate(-50%, -50%);
  }
  &-row-reverse {
    right: v-bind(progressPercentage);
    top: 50%;
    transform: translate(50%, -50%);
  }
  &-column {
    top: v-bind(progressPercentage);
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &-column-reverse {
    bottom: v-bind(progressPercentage);
    left: 50%;
    transform: translate(-50%, 50%);
  }
}
</style>
