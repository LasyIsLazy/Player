import { ref } from "vue";

export const playListVisible = ref(false);

export const showPlayList = () => (playListVisible.value = true);
export const closePlayList = () => (playListVisible.value = false);
export const togglePlayList = () =>
  (playListVisible.value = !playListVisible.value);
