<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { MusicService } from "music-service";
import { PlaylistData, Song } from "music-service/types/playlist";
import { ref } from "vue";
const audioSrc = ref("");
const service = new MusicService();
const playlistData = ref<PlaylistData>();
const getPlayList = async () => {
  const res = await service.playlist();
  console.log("res", res);
  playlistData.value = res;
};

getPlayList();
const handlePlay = async ({
  songId,
  albumId,
  contentId,
  resourceType,
  audioFormats,
}: Song) => {
  const res = await service.listenUrl({
    songId,
    albumId,
    lowerQualityContentId: contentId,
    resourceType,
    toneFlag: audioFormats.slice(-1)[0].formatType,
  });
  console.log("res", res);
  audioSrc.value = res.url;
};
</script>

<template>
  <div class="player">
    <audio :src="audioSrc" controls></audio>
  </div>
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
      <div class="item" v-for="(item, idx) in playlistData.songList">
        <div>
          {{ idx }}
        </div>
        <div>{{ item.songName }}</div>
        <div>{{ item.singerList.map(({ name }) => name).join(" / ") }}</div>
        <div>{{ item.album }}</div>
        <div><button @click="handlePlay(item)">Play</button></div>
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
  grid-template-columns: 20px 2fr 1fr 1fr 100px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
