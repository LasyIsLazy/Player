<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = defineProps<{
  progress: number
  direction: 'vertical' | 'horizon'
}>()
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
  const per =
    props.direction === 'vertical' ? 1 - (e.y - y) / height : (e.x - x) / width
  console.log('修改进度', per)
  emit('progress-change', per)
}

const progressPercentage = computed(() => props.progress * 100 + '%')
</script>
<template>
  <div
    ref="progressBar"
    class="progress-bar"
    :class="direction"
    @click="(e) => handleClick(e)"
  >
    <div class="fill" />
    <div class="block" />
  </div>
</template>

<style lang="scss">
.progress-bar {
  position: relative;
  background-color: grey;
}
.horizon {
  .fill {
    width: v-bind(progressPercentage);
    height: 100%;
  }
}
.vertical {
  .fill {
    width: 100%;
    height: v-bind(progressPercentage);
  }
}
.fill {
  position: absolute;
  bottom: 0;
  background-color: aqua;
}
</style>
