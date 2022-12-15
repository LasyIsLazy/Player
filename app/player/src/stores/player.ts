import { defineStore } from "pinia";

interface Song {
  url: string;
}
enum PlayStatus {
  Stop,
  Playing,
  Paused,
}

export const usePlayerStore = defineStore({
  id: "player",
  state: () => ({
    song: null as Song | null,
    status: PlayStatus.Stop,
  }),
  actions: {
    play(song: Song) {
      this.song = song;
      this.status = PlayStatus.Playing;
    },
  },
  getters: {
    url(state) {
      return state.song?.url ?? "";
    },
  },
});
