import { MusicService } from 'music-service'
import { defineStore } from 'pinia'
import { useCollectionStore, Collection } from './collection'
import { Howl } from 'howler'
import { SongDetail } from 'music-service/types/listen-url'
import { computed, ref } from 'vue'
interface Song {
  url: string
  songName: string
  cover: string
  raw: SongDetail
  collection: Collection
}

interface PlayingSong {
  data: Song
  sound: Howl
}

export enum PlayStatus {
  Stop,
  Playing,
  Paused,
}
const service = new MusicService()

export const usePlayerStore = defineStore('player', () => {
  // const song = ref<Song | null>(null);
  const playing = ref<PlayingSong>()
  const nextPlay = ref<PlayingSong>()
  const status = ref(PlayStatus.Stop)
  const volume = ref(0.5)
  const curTime = ref(0)
  const duration = ref(0)

  const song = computed(() => playing.value?.data)
  const songName = computed(() => playing.value?.data.songName ?? '')
  // TODO: 歌手
  const singerName = computed(() => playing.value?.data.songName ?? '歌手')
  const url = computed(() => playing.value?.data.url ?? '')
  const collection = computed(() => playing.value?.data.collection)
  const statusText = computed(() => {
    const textMap: Record<PlayStatus, string> = {
      [PlayStatus.Paused]: '已暂停',
      [PlayStatus.Playing]: '播放中',
      [PlayStatus.Stop]: '已结束',
    }
    return textMap[status.value]
  })
  const progress = computed(() => {
    if (!curTime.value || !duration.value) {
      return 0
    }
    return curTime.value / duration.value
  })
  const time2text = (time: number) => {
    return (
      String(Math.floor(time / 60))
        .padStart(2, '0')
        .slice(0, 2) +
      ':' +
      String(Math.floor(time % 60))
        .padStart(2, '0')
        .slice(0, 2)
    )
  }
  const progressText = computed(() => {
    return `${time2text(curTime.value)}/${time2text(duration.value)}`
  })

  const prepare = async (songId: string, collectionId?: number) => {
    const { getSongInfo, getCollection } = useCollectionStore()
    let nextCollection: Collection
    if (collectionId) {
      const c = getCollection(collectionId)
      if (!c) {
        throw new Error(`collectionId ${collectionId} 未找到`)
      }
      nextCollection = c
    } else {
      const c = playing.value?.data.collection
      if (!c) {
        throw new Error('当前没有collection')
      }
      nextCollection = c
    }
    const songInfo = getSongInfo(songId, nextCollection.id)
    if (!songInfo) {
      throw new Error(
        `songId ${songId} 在collectionId ${collectionId} 中未找到`
      )
    }
    const { albumId, contentId, resourceType, audioFormats } = songInfo
    const res = await service.listenUrl({
      songId,
      albumId,
      lowerQualityContentId: contentId,
      resourceType,
      toneFlag: audioFormats.slice(-1)[0].formatType,
    })
    console.log('song detail', res)

    const sound = new Howl({
      src: res.url,
      html5: true,
      volume: volume.value,
      onend: () => {
        next()
      },
    })
    nextPlay.value = {
      data: {
        raw: res,
        songName: res.song.songName,
        url: res.url,
        // TODO: 封面获取
        cover:
          'data:image/jpeg;base64,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',
        collection: nextCollection,
      },
      sound,
    }
    const listenProgress = () => {
      curTime.value = sound?.seek() ?? 0
      duration.value = sound?.duration() ?? 0
      if (status.value !== PlayStatus.Playing) {
        sound?.once('play', listenProgress)
        return
      }
      requestAnimationFrame(listenProgress)
    }
    listenProgress()
    return res
  }
  const play = () => {
    if (!playing.value) {
      return
    }
    status.value = PlayStatus.Playing

    // 实际播放
    playing.value.sound.play()
    console.log('play', playing.value)
    return playing.value
  }

  const pause = () => {
    if (status.value !== PlayStatus.Playing) {
      return
    }
    playing.value?.sound.pause()
    status.value = PlayStatus.Paused
    console.log('pause', playing.value)
  }

  const resume = () => {
    if (status.value !== PlayStatus.Paused) {
      return
    }
    playing.value?.sound.play()
    status.value = PlayStatus.Playing
    console.log('resume', playing.value)
  }

  const switchPlay = () => {
    if (!playing.value) {
      return
    }
    switch (status.value) {
      case PlayStatus.Stop:
        return play()

      case PlayStatus.Playing:
        return pause()

      case PlayStatus.Paused:
        return resume()

      default:
        break
    }
  }

  const stop = () => {
    if (!playing.value) {
      return
    }
    playing.value.sound.stop()
    playing.value = undefined
    status.value = PlayStatus.Stop
    console.log('stop', playing.value)
  }

  const seek = (progress: number) => {
    if (progress > 1) {
      progress = 1
    }
    if (progress < 0) {
      progress = 0
    }
    const sound = playing.value?.sound
    if (!sound) {
      return
    }
    const duration = sound.duration()
    sound.seek(duration * progress)
  }
  const setVolume = (v: number) => {
    console.log('设置音量', v)
    const sound = playing.value?.sound
    if (!sound) {
      return
    }
    volume.value = v
    sound.volume(v)
  }

  const getRandomSong = () => {
    const collection = playing.value?.data.collection
    if (!collection?.list.length) {
      // collection中是空的
      return
    }
    const song =
      collection.list[Math.floor(Math.random() * collection.list.length)]
    return song
  }

  /**
   * 切到下一首歌（不播放）
   * @returns
   */
  const switchNext = async () => {
    if (!nextPlay.value) {
      return
    }
    await stop()

    // 设置变量
    playing.value = nextPlay.value
    nextPlay.value = undefined
  }

  const next = async () => {
    // TODO: 支持多种模式
    const song = getRandomSong()
    if (!song) {
      return
    }
    await prepare(song.songId)
    await switchNext()
    await play()
    return song
  }
  const last = async () => {
    // TODO: 上一首
  }

  return {
    status,
    volume,
    curTime,
    duration,

    song,
    singerName,
    songName,
    url,
    statusText,
    progress,
    progressText,
    collection,

    prepare,
    play,
    pause,
    resume,
    switchPlay,
    stop,
    seek,
    setVolume,
    getRandomSong,
    switchNext,
    next,
    last,
  }
})
