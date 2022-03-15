import { HYEventStore } from 'hy-event-store'
import { getSongDetail,getSongLyric } from '../service/api_player'
import { parseLyric } from '../utils/parse-lyric'

// 创建播放器
const audioContext =  wx.createInnerAudioContext();
// wx.setInnerAudioOption({ obeyMuteSwitch:false })
const playStore = new HYEventStore({
  state:{
    id:'',
    currentSong:{},
    durationTime:0,
    lyricInfos:[]
  },
  actions:{
    playSongWithIdAction(ctx,{ id }){
      ctx.id = id
      // 1.请求数据
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
      })
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        const lyrics = parseLyric(lyricString);
        ctx.lyricInfos = lyrics
      })
      // 2.播放对应id得歌曲
      audioContext.stop();//播放下一首之前停止当前播放的
      audioContext.src = encodeURI(`https://music.163.com/song/media/outer/url?id=${id}.mp3`)
      audioContext.autoplay = true
    }
  }
})
export {
  audioContext,
  playStore
}