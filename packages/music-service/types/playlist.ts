export interface AudioFormat {
  resourceType: string;
  formatType: string;
  isize: string;
  asize: string;
  iformat: string;
  aformat: string;
  showTags: string[];
}

export interface Singer {
  id: string;
  name: string;
  img: string;
  nameSpelling: string;
}

export interface Song {
  resourceType: string;
  contentId: string;
  songId: string;
  songName: string;
  mvCopyrightType: number;
  ringToneId: string;
  ringCopyrightId: string;
  haveShockRing: number;
  showTags: string[];
  songPinyin: string;
  audioFormats: AudioFormat[];
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
  mvId: string;
  playNumDesc: string;
  downloadTags: string[];
}

export interface PlaylistData {
  totalCount: number;
  publishTime: string;
  songList: Song[];
}
