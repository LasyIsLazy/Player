export class Lyrics {
  tagLineCount = 0
  lyricLineCount = 0
  tagLines: { id: string; value: string }[] = []
  /**
   * time: 毫秒
   */
  lyricLines: { time: number; text: string }[] = []
  constructor(private lrc: string) {
    this.parse()
  }

  parse() {
    const lines = this.lrc.replaceAll('\r\n', '\n').split('\n')
    lines.forEach((str, idx) => {
      if (!str || /^\s+$/g.exec(str)) {
        // 空行
        return
      }
      const match = /^\[(.+?)\](.*)$/g.exec(str)
      if (!match) {
        console.warn(`歌词第${idx + 1}行"${str}"解析失败`)
        return
      }
      const [, left, right] = match

      const timeRegexMatch = /^(\d+):(\d{2})\.(\d{2})$/g.exec(left)
      if (timeRegexMatch) {
        // 歌词
        const [, mStr, sStr, hsStr] = timeRegexMatch
        const m = Number(mStr)
        const s = Number(sStr)
        const hs = Number(hsStr)
        if (Number.isNaN(m) || Number.isNaN(s) || Number.isNaN(hs)) {
          console.warn(`歌词第${idx + 1}行"${str}"时间解析失败`)
          return
        }
        this.lyricLines.push({
          // hs是百分之一秒
          // https://zh.wikipedia.org/wiki/LRC%E6%A0%BC%E5%BC%8F
          time: (m * 60 + s) * 1000 + hs * 10,
          text: right,
        })
      } else if (/.+:.+/g.exec(left)) {
        // ID tags
        const [id, value] = left.split(':')
        this.tagLines.push({
          id,
          value,
        })
      } else {
        console.warn(`歌词第${idx + 1}行"${str}"解析失败`)
      }
    })
    this.tagLineCount = this.tagLines.length
    this.lyricLineCount = this.lyricLines.length
  }
}
