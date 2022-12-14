<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { MusicService } from "music-service";
import { PlaylistData, Song } from "music-service/types/playlist";
import { ref } from "vue";
const service = new MusicService();
const playlistData = ref<PlaylistData>();
const getPlayList = async (params: any) => {
  const res = await service.playlist();
  console.log("res", res);
  playlistData.value = res;
};
</script>

<template>
  <div class="btn-container">
    <button @click="getPlayList">getPlayList</button>
    <!-- <button @click="getPlayList">getPlayList</button> -->
  </div>

  <section v-if="playlistData">
    <h2>playlist</h2>
    <div class="playlist">
      <div class="item">
        <div></div>
        <div>歌名</div>
        <div>歌手</div>
        <div>专辑</div>
      </div>
      <div
        class="item"
        v-for="({ songName, singerList, album }, idx) in playlistData.songList"
      >
        <div>
          {{ idx }}
        </div>
        <div>{{ songName }}</div>
        <div>{{ singerList.map(({ name }) => name).join(" / ") }}</div>
        <div>{{ album }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.btn-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.playlist .item {
  display: grid;
  grid-template-columns: 20px 2fr 1fr 1fr;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
