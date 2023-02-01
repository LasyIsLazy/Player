import { Lyrics } from '../lyrics'

export interface Singer {
  id: string
  name: string
  avatar: string
  nameSpelling: string
}
export interface SongDetail {
  // resourceType: string;
  // contentId: string;
  songId: string
  songName: string
  mvId: string
  url: string
  cover: string
  lyrics: Lyrics
  // mvCopyrightType: number;
  // ringToneId: string;
  // ringCopyrightId: string;
  // haveShockRing: number;
  // showTags: string[];
  // songPinyin: string;
  // duration: number;
  // copyrightId: string;
  // copyrightType: number;
  // restrictType: number;
  // albumId: string;
  // album: string;
  // albumPinyin: string;
  // img1: string;
  // img2: string;
  // img3: string;
  singerList: Singer[]
}
