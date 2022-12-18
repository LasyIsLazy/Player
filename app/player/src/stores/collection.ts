import { MusicService } from "music-service";
import { Song } from "music-service/types/playlist";
import { defineStore } from "pinia";

interface Collection {
  id: number;
  name: string;
  list: Song[];
}

const service = new MusicService();

export const useCollectionStore = defineStore({
  id: "collection",
  state: () => ({
    collectionList: [] as Collection[],
  }),
  actions: {
    async init() {
      // TODO: 临时歌单
      this.addCollection({
        id: 173191649,
        list: [],
        name: "我喜欢的",
      });
    },
    async fetchCollectionDetail(id: number) {
      const { publishTime, songList, totalCount } = await service.playlist(id);
      const collection = this.collectionList.find((item) => item.id === id);
      if (!collection) {
        throw new Error("未找到对应的collection");
      }
      collection.list = songList;
    },
    addCollection(collection: Collection) {
      this.collectionList.push(collection);
    },
    deleteCollection(id: number) {
      const idx = this.collectionList.findIndex((item) => item.id === id);
      this.collectionList.splice(idx, 1);
    },
  },
  getters: {
    getCollection() {
      return (id: number) => {
        return this.collectionList.find((item) => item.id === id);
      };
    },
    getSongInfo() {
      return (songId: string, collectionId: number) => {
        const c = this.getCollection(collectionId);
        if (!c) {
          return;
        }
        return c.list.find((item) => item.songId === songId);
      };
    },
  },
});
