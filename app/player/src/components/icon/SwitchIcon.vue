<script lang="ts" setup>
import Icon from "./Icon.vue";

defineProps<{
  type: "last" | "next";
}>();
</script>
<template>
  <Icon :name="type"></Icon>
</template>
