import { Client, getClient, RequestOptions } from '@tauri-apps/api/http'
import { SongDetail } from './types/listen-url'
import { PlaylistData } from './types/playlist'

interface ResData<T> {
  code: string
  info: string
  data: T
}

class RequestError extends Error {}

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
        throw new RequestError(res.data?.info || '缺少响应数据')
      }
      console.log('data==============', res.data.data)
      return res.data.data
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
    return this.get<SongDetail>(
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
}

