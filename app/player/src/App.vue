<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Greet from "./components/Greet.vue";
import { MusicService } from "music-service";
const service = new MusicService();
const getPlayList = async (params: any) => {
  const res = await service.playlist();
  console.log("res", res);
};
</script>

<template>
  <div class="container">
    <router-link to="/">home</router-link>
    <router-link to="/test">test</router-link>
    <router-view />
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
