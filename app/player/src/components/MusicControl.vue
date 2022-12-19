<script setup lang="ts">
import { ref, watch } from "vue";
import { usePlayerStore } from "../stores/player";
import { useCollectionStore } from "../stores/collection";

const { collectionList, fetchCollectionDetail, init } = useCollectionStore();
const playerStore = usePlayerStore();

init().then(async () => {
  const curList = collectionList[0];
  await fetchCollectionDetail(curList.id);
  console.log("歌单信息已获取");
  const song = curList.list[0];

  const songDetail = await playerStore.prepare(song.songId, curList.id);
  console.log("准备播放", songDetail);
  console.log("url", playerStore.url);
  console.log("storeSong", playerStore.song);
});

const handlePlay = () => {
  playerStore.play();
};

const audio = ref<HTMLAudioElement>();
watch(audio, (el) => {
  if (!el) {
    throw new Error("audio el not found");
  }
  el.volume = 0.5;
});
</script>

<template>
  <div class="music-control">
    <audio
      :src="playerStore.url"
      controls
      @play="handlePlay"
      ref="audio"
    ></audio>
  </div>
</template>
