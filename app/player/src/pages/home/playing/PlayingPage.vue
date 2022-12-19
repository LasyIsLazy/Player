<script setup lang="ts">
import MusicControl from "@/components/MusicControl.vue";
import PlayingList from "../../../components/play-list/PlayList.vue";
</script>
<template>
  <div class="home-page">
    <aside>
      <PlayingList></PlayingList>
    </aside>
    <main></main>
    <footer>
      <MusicControl></MusicControl>
    </footer>
  </div>
</template>

<style lang="scss">
aside {
}
</style>
