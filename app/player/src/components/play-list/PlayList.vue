<script setup lang="ts">
import { Song } from 'music-service/types/playlist'
import { computed } from 'vue'
import { playListVisible } from '.'
import { usePlayerStore } from '../../stores/player'

const playerStore = usePlayerStore()
const len = computed(() => playerStore.collection?.list.length ?? 0)

const visible = playListVisible

const handlePlay = async (song: Song) => {
  await playerStore.play(song.songId)
}
</script>
<template>
  <div
    v-show="visible"
    class="playing-list"
  >
    <div class="title">播放列表</div>
    <div class="amount">{{ len }}首歌</div>
    <div class="list">
      <template
        v-for="(item, idx) in playerStore.collection?.list ?? []"
        :key="'item' + idx"
      >
        <div class="num">
          {{ idx + 1 }}
        </div>
        <div class="name ellipse">
          {{ item.songName }}
        </div>
        <div class="singer ellipse">
          {{ item.singerList.map((i) => i.name).join('/') }}
        </div>
        <div class="action">
          <button @click="handlePlay(item)">播放</button>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.playing-list {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  background-color: aquamarine;
  z-index: 1;
  height: calc(100vh - var(--footer-height));
  text-align: left;
  display: flex;
  flex-direction: column;
  .list {
    flex: 1;
    overflow: hidden auto;
    display: grid;
    grid-template-columns: max-content auto 100px 80px;
  }
}
.ellipse {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.flex {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
}
.info {
  flex: 1;
  overflow: hidden;
}
.num {
  flex: 0 0 20px;
}
.action {
  flex: 0 0 auto;
}
.name {
  flex: 1 0 100px;
}
.singer {
  flex: 0 0 100px;
}
</style>
