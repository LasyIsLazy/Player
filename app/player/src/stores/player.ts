import { MusicService } from 'music-service'
import { defineStore } from 'pinia'
import { useCollectionStore, Collection } from './collection'
import { Howl } from 'howler'
import { computed, ref } from 'vue'
import { SongDetail } from 'music-service/types/common-type'
import { PlayMode } from '@/common/const'

type Song = SongDetail & {
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
  const playMode = ref(PlayMode.All)

  const song = computed(() => playing.value?.data)
  const songName = computed(() => playing.value?.data.songName ?? '')
  const singerName = computed(() =>
    playing.value?.data.singerList.map((item) => item.name).join('/')
  )
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

  /**
   * 准备下一首歌的所有信息
   * @param songId 歌曲ID
   * @param collectionId 歌单ID
   */
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
    const res = await service.getSongDetail({
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
      onload: () => {
        console.log('howl onload')
      },
    })
    nextPlay.value = {
      data: {
        ...res,
        songName: res.songName,
        url: res.url,
        collection: nextCollection,
      },
      sound,
    }

    return res
  }

  /**
   * 播放
   */
  const play = async (songId?: string, collectionId?: number) => {
    console.log('play', songId, collectionId)
    if (songId && playing.value?.data.songId !== songId) {
      // 要播放的不是当前歌曲，需要进行准备和切换
      await prepare(songId, collectionId)
      await switchNext()
    }
    if (!playing.value) {
      return
    }
    const sound = playing.value.sound

    const listenProgress = () => {
      curTime.value = sound.seek() ?? 0
      duration.value = sound.duration() ?? 0
      if (status.value !== PlayStatus.Playing) {
        sound.once('play', listenProgress)
        return
      }
      requestAnimationFrame(listenProgress)
    }
    listenProgress()

    status.value = PlayStatus.Playing

    // 实际播放
    sound.play()
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
    console.log('switchPlay', status.value)
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

  /**
   * 跳转播放进度
   * @param progress 要跳转的进度。如：0.5
   */
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
    curTime.value = duration.value * progress
    console.log(`seek ${curTime.value}/${duration.value}`)
    sound.seek(curTime.value)
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

  const getNextSong = () => {
    const collection = playing.value?.data.collection
    if (!collection?.list.length) {
      // collection中是空的
      return
    }
    switch (playMode.value) {
      case PlayMode.All: {
        const idx = collection.list.findIndex(
          (val) => val.songId === playing.value?.data.songId
        )
        return collection.list[idx + 1] || collection.list[0]
      }

      case PlayMode.Random: {
        return collection.list[
          Math.floor(Math.random() * collection.list.length)
        ]
      }

      default:
        break
    }

    return
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
    curTime.value = nextPlay.value.sound.seek()
    duration.value = nextPlay.value.sound.duration()
    // FIXME: 这里是 0
    console.log(`已获取duration ${duration.value}`)
    nextPlay.value = undefined
  }

  let failedCount = 0
  // TODO: 改为配置项
  const maxFailedCount = 5

  const next = async () => {
    const song = getNextSong()
    if (!song) {
      return
    }
    try {
      await play(song.songId)
    } catch (error) {
      console.warn(error)
      if (++failedCount < maxFailedCount) {
        // TODO: 给个失败提示
        // 失败后跳过（尝试下一首）
        next()
      }
    }
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
    playMode,

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
    switchNext,
    next,
    last,
  }
})
