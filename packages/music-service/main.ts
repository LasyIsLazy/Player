import { fetch, FetchOptions } from "@tauri-apps/api/http";
export class MusicService {
  playlist() {
    const options: FetchOptions = {
      method: "GET",
      headers: {},
    };

    fetch(
      "https://app.c.nf.migu.cn/MIGUM3.0/resource/playlist/song/v2.0?pageNo=1&pageSize=50&playlistId=173191649",
      options
    )
      .then((response) => {
        return response;
      })
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  }
}
