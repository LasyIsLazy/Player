import { Singer } from './common-type'

interface ListenUrlSong {
  resourceType: string
  contentId: string
  songId: string
  songName: string
  mvId: string
  mvCopyrightType: number
  ringToneId: string
  ringCopyrightId: string
  haveShockRing: number
  showTags: string[]
  songPinyin: string
  duration: number
  copyrightId: string
  copyrightType: number
  restrictType: number
  albumId: string
  album: string
  albumPinyin: string
  img1: string
  img2: string
  img3: string
  singerList: Singer[]
}

export interface ListenUrlData {
  version: string
  url: string
  audioFormatType: string
  lrcUrl: string
  mrcUrl: string
  trcUrl: string
  song: ListenUrlSong
  freeListenType: string
  haveVisualMv: boolean
}
