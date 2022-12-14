import { fetch, FetchOptions } from "@tauri-apps/api/http";
import { PlaylistData } from "./types/playlist";

interface ResData<T> {
  code: string;
  info: string;
  data: T;
}

class RequestError extends Error {}

const get = async <T>(url: string, options?: FetchOptions) => {
  return fetch<ResData<T> | undefined>(
    url,
    Object.assign(
      {
        method: "GET",
      },
      options
    )
  ).then((res) => {
    if (!res.ok) {
      // TODO: 错误信息细化
      throw new RequestError(String(res.status));
    }
    if (!res.data || res.data?.code !== "000000") {
      throw new RequestError(res.data?.info || "缺少响应数据");
    }
    return res.data.data;
  });
};
export class MusicService {
  playlist() {
    return get<PlaylistData>(
      "https://app.c.nf.migu.cn/MIGUM3.0/resource/playlist/song/v2.0?pageNo=1&pageSize=50&playlistId=173191649"
    );
  }
}
