<script setup lang="ts">
import MusicControl from "@/components/MusicControl.vue";
import PlayingList from "../../../components/play-list/PlayList.vue";
</script>
<template>
  <div class="home-page">
    <PlayingList></PlayingList>
    <main></main>
    <footer>
      <MusicControl></MusicControl>
    </footer>
  </div>
</template>

<style lang="scss">
$footerHeight: 200px;
main {
  width: 100vw;
  height: calc(100vh - $footerHeight);
}
footer {
  width: 100vw;
  height: $footerHeight;
}
</style>
