<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { usePlayerStore } from "../../stores/player";
import { useCollectionStore } from "../../stores/collection";
import Icon from "../icon/Icon.vue";
import PlayButton from "../icon/PlayIcon.vue";
import SwitchIcon from "../icon/SwitchIcon.vue";
import { togglePlayList } from "../play-list";
import VolumeControl from "./VolumeControl.vue";

const { collectionList, fetchCollectionDetail, init } = useCollectionStore();
const playerStore = usePlayerStore();
const { progressText, songName, singerName, status } = toRefs(playerStore);
const { switchPlay, next, last, switchNext } = playerStore;

init().then(async () => {
  const curList = collectionList[0];
  await fetchCollectionDetail(curList.id);
  console.log("歌单信息已获取");
  const song = curList.list[0];

  const songDetail = await playerStore.prepare(song.songId, curList.id);
  await switchNext();
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

const handlePlayList = () => {
  togglePlayList();
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
    <div class="extend-area">
      <Icon class="play-list" name="list" @click="handlePlayList"></Icon>
      <VolumeControl />
    </div>
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
      <SwitchIcon @click="last" type="last"></SwitchIcon>
      <PlayButton @click="switchPlay" :status="status" />
      <SwitchIcon @click="next" type="next"></SwitchIcon>
    </div>
  </div>
</template>
<style scoped lang="scss">
$controlIconSize: 40px;
$extendIconAmount: 2;
$extendIconSize: 30px;
.music-control {
  padding: 0 20px;
  text-align: left;
  display: grid;
  grid-template-columns: 60px 1fr max-content;
  gap: 10px;
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
.progress-text {
  user-select: none;
}
.control {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-columns: repeat(3, $controlIconSize);
  grid-template-rows: $controlIconSize;
  gap: 30px;
  > * {
    cursor: pointer;
  }
}
.extend-area {
  display: grid;
  gap: 30px;
  grid-template-columns: repeat($extendIconAmount, $extendIconSize);
  grid-template-rows: $extendIconSize;
  > * {
    cursor: pointer;
  }
}
</style>
