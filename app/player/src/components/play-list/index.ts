import { ref } from "vue";

export const playListVisible = ref(true);

export const showPlayList = () => (playListVisible.value = true);
export const closePlayList = () => (playListVisible.value = false);
