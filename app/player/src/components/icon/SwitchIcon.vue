<script lang="ts" setup>
import CommonIcon from './CommonIcon.vue'

defineProps<{
  type: 'last' | 'next'
}>()
</script>
<template>
  <CommonIcon :name="type" />
</template>
