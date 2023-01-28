<script lang="ts" setup>
import Icon from './CommonIcon.vue'

defineProps<{
  type: 'last' | 'next'
}>()
</script>
<template>
  <Icon :name="type" />
</template>
