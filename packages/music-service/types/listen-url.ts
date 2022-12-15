interface Singer {
  id: string;
  name: string;
  img: string;
  nameSpelling: string;
}

interface Song {
  resourceType: string;
  contentId: string;
  songId: string;
  songName: string;
  mvId: string;
  mvCopyrightType: number;
  ringToneId: string;
  ringCopyrightId: string;
  haveShockRing: number;
  showTags: string[];
  songPinyin: string;
  duration: number;
  copyrightId: string;
  copyrightType: number;
  restrictType: number;
  albumId: string;
  album: string;
  albumPinyin: string;
  img1: string;
  img2: string;
  img3: string;
  singerList: Singer[];
}

export interface SongDetail {
  version: string;
  url: string;
  audioFormatType: string;
  lrcUrl: string;
  mrcUrl: string;
  trcUrl: string;
  song: Song;
  freeListenType: string;
  haveVisualMv: boolean;
}
