import { defineStore } from "pinia";

interface Collection {
  id: number;
  name: string;
  list: any[];
}

export const useCollectionStore = defineStore({
  id: "collection",
  state: () => ({
    collectionList: [] as Collection[],
  }),
  actions: {
    addCollection(collection: Collection) {
      this.collectionList.push(collection);
    },
    deleteCollection(id: number) {
      const idx = this.collectionList.findIndex((item) => item.id === id);
      this.collectionList.splice(idx, 1);
    },
  },
  getters: {
    //
  },
});
