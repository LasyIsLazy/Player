import { MusicService } from "music-service";
import { defineStore } from "pinia";
import { useCollectionStore, Collection } from "./collection";

interface Song {
  url: string;
}
enum PlayStatus {
  Stop,
  Playing,
  Paused,
}
const service = new MusicService();

interface State {
  song: Song | null;
  status: PlayStatus;
  volume: number;
  collection: Collection | null;
}

export const usePlayerStore = defineStore({
  id: "player",
  state: (): State => ({
    song: null,
    status: PlayStatus.Stop,
    volume: 50,
    collection: null,
  }),
  actions: {
    async prepare(songId: string, collectionId?: number) {
      const { getSongInfo, getCollection } = useCollectionStore();
      if (collectionId) {
        const c = getCollection(collectionId);
        if (!c) {
          throw new Error(`collectionId ${collectionId} 未找到`);
        }
        this.collection = c;
      } else {
        if (!this.collection) {
          throw new Error("当前没有collection");
        }
        collectionId = this.collection.id;
      }
      collectionId = this.collection.id;
      const song = getSongInfo(songId, collectionId);
      if (!song) {
        throw new Error(
          `songId ${songId} 在collectionId ${collectionId} 中未找到`
        );
      }
      const { albumId, contentId, resourceType, audioFormats } = song;
      const res = await service.listenUrl({
        songId,
        albumId,
        lowerQualityContentId: contentId,
        resourceType,
        toneFlag: audioFormats.slice(-1)[0].formatType,
      });
      console.log("song detail", res);
      this.song = res;
      return res;
    },
    async play() {
      console.log("play", this.song);
      this.status = PlayStatus.Playing;
      return this.song;
    },
  },
  getters: {
    url(state) {
      console.log("getter");
      return state.song?.url ?? "";
    },
  },
});
