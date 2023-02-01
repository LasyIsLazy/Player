import { Client, getClient, RequestOptions } from '@tauri-apps/api/http'
import { SongDetail } from './types/common-type'
import { ListenUrlData } from './types/listen-url'
import { PlaylistData } from './types/playlist'

interface ResData<T> {
  code: string
  info: string
  data: T
}
type ResDataV3<T> = {
  returnCode: string
  msg: string
} & T

const defaultCover =
  'data:image/jpeg;base64,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'

class RequestError extends Error {}
class MiGuError extends Error {}

export class MusicService {
  private client: Client | null
  constructor() {
    this.client = null
  }

  async get<T>(url: string, options?: RequestOptions) {
    if (!this.client) {
      this.client = await getClient()
    }
    console.log('get========================', url, options)
    return this.client.get<ResData<T> | undefined>(url, options).then((res) => {
      if (!res.ok) {
        // TODO: 错误信息细化
        throw new RequestError(String(res.status))
      }
      if (!res.data || res.data?.code !== '000000') {
        throw new MiGuError(res.data?.info || '缺少响应数据')
      }
      console.log('data==============', res.data.data)
      return res.data.data
    })
  }

  async getV3<T>(url: string, options?: RequestOptions) {
    if (!this.client) {
      this.client = await getClient()
    }
    console.log('get========================', url, options)
    if (!options) {
      options = {}
    }
    if (!options.headers) {
      options.headers = {}
    }
    if (!options.headers.referer) {
      options.headers['referer'] = 'https://music.migu.cn/v3/music/player/audio'
    }
    return this.client
      .get<ResDataV3<T> | undefined>(url, options)
      .then((res) => {
        if (!res.ok) {
          // TODO: 错误信息细化
          throw new RequestError(String(res.status))
        }
        if (!res.data || res.data?.returnCode !== '000000') {
          throw new MiGuError(res.data?.msg || '缺少响应数据')
        }
        console.log('data==============', res.data)
        return res.data
      })
  }

  playlist(playlistId: number) {
    return this.get<PlaylistData>(
      'https://app.c.nf.migu.cn/MIGUM3.0/resource/playlist/song/v2.0',
      {
        query: {
          pageNo: String(1),
          pageSize: String(50),
          playlistId: String(playlistId),
        },
      }
    )
  }

  listenUrl(params: {
    songId: string
    albumId: string
    lowerQualityContentId: string
    resourceType: string
    toneFlag: string
  }) {
    return this.get<ListenUrlData>(
      'https://app.c.nf.migu.cn/MIGUM2.0/strategy/listen-url/v2.4',
      {
        query: params,
        headers: {
          // TODO: 必须，还不知道是做什么的，可能是App版本？
          channel: '0146921',
        },
      }
    )
  }

  async getSongDetail(params: {
    songId: string
    albumId: string
    lowerQualityContentId: string
    resourceType: string
    toneFlag: string
  }): Promise<SongDetail> {
    const [listenUrlData, songPic] = await Promise.all([
      this.listenUrl(params),
      this.getSongPic(params).catch((err) => {
        console.warn(`获取歌曲${params.songId}封面失败`, err)
        console.log((err as Error).cause)
        return { largePic: defaultCover }
      }),
    ])
    console.log(listenUrlData, songPic)
    return {
      ...listenUrlData,
      ...listenUrlData.song,
      cover: songPic.largePic || defaultCover,
    }
  }

  getSongPic(params: { songId: string }) {
    return this.getV3<{
      returnCode: string
      msg: string
      smallPic: string
      mediumPic: string
      largePic: string
    }>('https://music.migu.cn/v3/api/music/audioPlayer/getSongPic', {
      query: params,
    })
  }
}
