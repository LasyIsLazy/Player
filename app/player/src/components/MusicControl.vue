<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { usePlayerStore } from "../stores/player";
import { useCollectionStore } from "../stores/collection";

const { collectionList, fetchCollectionDetail, init } = useCollectionStore();
const playerStore = usePlayerStore();
const { progressText, songName, singerName } = toRefs(playerStore);
const { switchPlay, next, last } = playerStore;

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

const audio = ref<HTMLAudioElement>();
watch(audio, (el) => {
  if (!el) {
    throw new Error("audio el not found");
  }
  el.volume = 0.5;
});

const handleProgress = (val: number) => {
  console.log(val);
  playerStore.seek(val);
};
</script>

<template>
  <div class="music-control">
    <div class="cover">
      <img :src="playerStore.song?.cover" :alt="songName" />
    </div>
    <div class="info">
      <div class="name">{{ songName }} - {{ singerName }}</div>
      <div class="progress-text">{{ progressText }}</div>
    </div>
    <div class="extend-area"></div>
    <!-- <div>
      {{ playerStore.statusText }}：《{{ playerStore.song?.songName }}》
    </div>
    <div>{{ playerStore.progress }}</div>
    <div>
      进度：
      <input
        type="number"
        :value="playerStore.progress"
        @change="e => handleProgress((e.target as any).value)"
      />
    </div>
    <div>
      音量：
      <input
        type="number"
        :value="playerStore.volume"
        @change="e => playerStore.setVolume((e.target as any).value)"
      />
    </div> -->
    <div class="control">
      <button @click="last">Last</button>
      <button @click="switchPlay">Play Or Pause</button>
      <button @click="next">Next</button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.music-control {
  padding: 0 20px;
  text-align: left;
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}
.cover {
  width: 60px;
  height: 60px;
  > img {
    width: 100%;
    height: 100%;
  }
}
.info {
  margin-right: auto;
}
.control {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-columns: repeat(3, 200px);
  gap: 30px;
}
</style>
