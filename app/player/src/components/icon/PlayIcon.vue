<script lang="ts" setup>
import { PlayStatus } from "../../stores/player";
import Icon from "./Icon.vue";

withDefaults(
  defineProps<{
    status: PlayStatus;
  }>(),
  {
    status: PlayStatus.Playing,
  }
);
</script>
<template>
  <Icon :name="status !== PlayStatus.Playing ? 'play' : 'pause'"></Icon>
</template>
<style lang="scss" scoped>
.play-icon {
  width: 100%;
  height: 100%;
  fill: currentColor;
  overflow: hidden;
}
</style>
