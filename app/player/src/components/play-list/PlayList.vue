<script setup lang="ts">
import { Song } from "music-service/types/playlist";
import { computed, ref } from "vue";
import { playListVisible } from ".";
import { usePlayerStore } from "../../stores/player";

const playerStore = usePlayerStore();
const len = computed(() => playerStore.collection?.list.length ?? 0);

const visible = playListVisible;

const handlePlay = async (song: Song) => {
  await playerStore.prepare(song.songId);
  await playerStore.play();
};

const handleCollapse = () => {
  visible.value = false;
};
</script>
<template>
  <div class="playing-list" v-show="visible">
    <div class="title">播放列表</div>
    <div class="amount">{{ len }}首歌</div>
    <div class="list">
      <template v-for="(item, idx) in playerStore.collection?.list ?? []">
        <div class="num">{{ idx + 1 }}</div>
        <div class="name ellipse">{{ item.songName }}</div>
        <div class="singer ellipse">
          {{ item.singerList.map((i) => i.name).join("/") }}
        </div>
        <div class="action">
          <button @click="handlePlay(item)">播放</button>
        </div>
      </template>
    </div>
    <button @click="handleCollapse">收起</button>
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
  height: 100vh;
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
