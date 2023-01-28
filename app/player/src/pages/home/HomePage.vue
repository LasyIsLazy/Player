<script setup lang="ts">
import MusicControl from '../../components/music-control/MusicControl.vue';
import SideMenu from '../../components/side-menu/SideMenu.vue';
import PlayingList from '@/components/play-list/PlayList.vue';
</script>
<template>
  <div class="home-page">
    <aside><SideMenu /></aside>
    <main>
      <PlayingList />
    </main>
    <footer>
      <MusicControl />
    </footer>
  </div>
</template>
<style lang="scss" scoped>
.home-page {
  --footer-height: 100px;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 250px auto;
  grid-template-rows: auto var(--footer-height);
  grid-template-areas:
    "sidebar main"
    "footer footer";
}
aside,
main,
footer {
  display: flex;
  justify-content: stretch;
  align-items: stretch;
}
aside {
  grid-area: sidebar;
}
main {
  grid-area: main;
}
footer {
  grid-area: footer;
}
</style>
