<script setup lang="ts">
import { toRefs, watch } from 'vue'
import { usePlayerStore } from '../../stores/player'
import { useCollectionStore } from '../../stores/collection'
import CommonIcon from '../icon/CommonIcon.vue'
import PlayButton from '../icon/PlayIcon.vue'
import SwitchIcon from '../icon/SwitchIcon.vue'
import { togglePlayList } from '../play-list'
import VolumeControl from './VolumeControl.vue'
import ProgressBar from '../progress-bar/ProgressBar.vue'
import PlayModeControl from './PlayModeControl.vue'

const { collectionList, fetchCollectionDetail, init } = useCollectionStore()
const playerStore = usePlayerStore()
const { progressText, songName, singerName, status, progress } =
  toRefs(playerStore)
const { switchPlay, next, last, switchNext, seek } = playerStore

watch(status, (val) => {
  console.log('status', val)
})

init().then(async () => {
  const curList = collectionList[0]
  await fetchCollectionDetail(curList.id)
  console.log('歌单信息已获取')
  const song = curList.list[0]

  const songDetail = await playerStore.prepare(song.songId, curList.id)
  await switchNext()
  console.log('准备播放', songDetail)
  console.log('url', playerStore.url)
  console.log('storeSong', playerStore.song)
})

const handlePlayList = () => {
  togglePlayList()
}
</script>

<template>
  <div class="music-control">
    <div class="cover">
      <img
        :src="playerStore.song?.cover"
        :alt="songName"
      />
    </div>
    <div class="info">
      <div class="name">{{ songName }} - {{ singerName }}</div>
      <div class="progress-text">
        {{ progressText }}
      </div>
    </div>
    <div class="extend-area">
      <CommonIcon
        class="play-list"
        name="list"
        @click="handlePlayList"
      />
      <VolumeControl />
      <PlayModeControl />
    </div>
    <ProgressBar
      direction="row"
      :progress="progress"
      class="play-progress"
      @progress-change="seek"
    ></ProgressBar>
    <div class="control">
      <SwitchIcon
        type="last"
        @click="last"
      />
      <PlayButton
        :status="status"
        @click="switchPlay"
      />
      <SwitchIcon
        type="next"
        @click="next"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
$controlIconSize: 40px;
$extendIconAmount: 3;
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
.play-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
}
</style>
