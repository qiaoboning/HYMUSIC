const timePatter = /\[(\d{2}):(\d{2}).(\d{2,3})\]/
export function parseLyric(lyricString){
  const lyricStrings = lyricString.split("\n")
  const lyricInfos = []
  for(const lineString of lyricStrings){
    // 1.获取时间
    const resultTime = timePatter.exec(lineString)
    if(!resultTime) continue
    const minute = resultTime[1] * 60 * 1000
    const second = resultTime[2] * 1000
    const millSecond = resultTime[3].length === 2 ? resultTime[3] * 10 : resultTime[3] * 1
    const time = minute + second + millSecond
    // 2.获取歌词文本
    const text = lineString.replace(resultTime[0],"")
    const lyricInfo = {time,text}
    lyricInfos.push(lyricInfo)
  }
  return lyricInfos
}