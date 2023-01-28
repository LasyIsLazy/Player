<script lang="ts" setup>
import { computed, ref, watch } from "vue";

const props = defineProps<{
  progress: number;
  direction: "vertical" | "horizon";
}>();
const progressBar = ref<HTMLElement>();
const emit = defineEmits<{
  (event: "progress-change", value: number): void;
}>();
const handleClick = (e: MouseEvent) => {
  console.log(e);
  console.log(e.y);
  const rect = progressBar.value?.getBoundingClientRect();
  if (!rect) {
    console.warn("Progress bar is not visible");
    return;
  }
  const { height, y } = rect;
  console.log("height", height);
  emit("progress-change", 1 - (e.y - y) / height);
};

watch(props, (val) => {
  console.log("progress", val.progress);
});

const progressPercentage = computed(() => props.progress * 100 + "%");
</script>
<template>
  <div class="progress-bar" @click="(e) => handleClick(e)" ref="progressBar">
    <div class="fill"></div>
    <div class="block"></div>
  </div>
</template>

<style lang="scss">
.progress-bar {
  position: relative;
  background-color: brown;
}
.fill {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: v-bind(progressPercentage);
  background-color: aqua;
}
</style>
