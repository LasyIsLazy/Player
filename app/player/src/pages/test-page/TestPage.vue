<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { MusicService } from "music-service";
const service = new MusicService();
const getPlayList = async (params: any) => {
  const res = await service.playlist();
  console.log("res", res);
};
</script>

<template>
  <div class="container">
    xxx

    <button @click="getPlayList">Test</button>
  </div>
</template>

<style scoped>
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}
</style>
