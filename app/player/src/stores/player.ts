import { MusicService } from "music-service";
import { defineStore } from "pinia";
import { useCollectionStore, Collection } from "./collection";
import { Howl, Howler } from "howler";
import { SongDetail } from "music-service/types/listen-url";
interface Song {
  url: string;
  songName: string;
  raw: SongDetail;
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
  sound: Howl | null;
  curTime: number;
  duration: number;
}

export const usePlayerStore = defineStore({
  id: "player",
  state: (): State => ({
    song: null,
    status: PlayStatus.Stop,
    volume: 0.5,
    collection: null,
    sound: null,
    curTime: 0,
    duration: 0,
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
      this.song = {
        raw: res,
        songName: res.song.songName,
        url: res.url,
      };
      this.sound = new Howl({
        src: res.url,
        html5: true,
        volume: this.volume,
        onend: () => {
          this.next();
        },
      });
      const listenProgress = () => {
        const curTime = this.sound?.seek();
        const duration = this.sound?.duration();
        this.curTime = curTime ?? 0;
        this.duration = duration ?? 0;
        if (this.status !== PlayStatus.Playing) {
          this.sound?.once("play", listenProgress);
          return;
        }
        requestAnimationFrame(listenProgress);
      };
      listenProgress();
      return res;
    },
    async play() {
      if (!this.sound) {
        return;
      }
      this.sound.play();
      console.log("play", this.song);
      this.status = PlayStatus.Playing;
      return this.song;
    },

    async pause() {
      if (this.status !== PlayStatus.Playing) {
        return;
      }
      this.sound?.pause();
      this.status = PlayStatus.Paused;
    },
    async resume() {
      if (this.status !== PlayStatus.Paused) {
        return;
      }
      this.sound?.play();
      this.status = PlayStatus.Playing;
    },

    async switch() {
      if (!this.sound) {
        return;
      }
      switch (this.status) {
        case PlayStatus.Stop:
          return this.play();

        case PlayStatus.Playing:
          return this.pause();

        case PlayStatus.Paused:
          return this.resume();

        default:
          break;
      }
    },

    async stop() {
      if (!this.sound) {
        return;
      }
      console.log(`stop`, this.song);
      this.sound.stop();
      this.sound = null;
      this.song = null;
    },

    async seek(progress: number) {
      if (progress > 1) {
        progress = 1;
      }
      if (progress < 0) {
        progress = 0;
      }
      if (!this.sound) {
        return;
      }
      const duration = this.sound.duration();
      this.sound.seek(duration * progress);
    },
    async setVolume(volume: number) {
      this.volume = volume;
      if (!this.sound) {
        return;
      }
      this.sound.volume(volume);
    },

    getRandomSong() {
      if (!this.collection?.list.length) {
        return;
      }
      const song =
        this.collection.list[
          Math.floor(Math.random() * this.collection.list.length)
        ];
      return song;
    },

    async next() {
      const song = this.getRandomSong();
      if (!song) {
        return;
      }
      await this.stop();
      await this.prepare(song.songId);
      await this.play();
      return song;
    },
  },
  getters: {
    url(state) {
      console.log("getter");
      return state.song?.url ?? "";
    },
    statusText(state) {
      const textMap: Record<PlayStatus, string> = {
        [PlayStatus.Paused]: "已暂停",
        [PlayStatus.Playing]: "播放中",
        [PlayStatus.Stop]: "已结束",
      };
      return textMap[state.status];
    },
    progress(state) {
      return state.curTime / state.duration;
    },
  },
});
