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
    lyricInfos:[],
    currentTime:0,//当前播放的时间
    currentLyricText:'',
    currentIndex:0,
    
    playModeIndex:0, //0:顺序 1：单曲循环 2：随机
    isPlaying:false,

    playListSongs:[],
    playListIndex:0, //当前歌曲的索引

    isFirstPlay:true
  },
  actions:{
    playSongWithIdAction(ctx,{ id,isRefresh = false }){
      if(ctx.id == id && !isRefresh) {
        this.dispatch("changeMusicPlayStatusAction",true)
        return
      }
      // 重置，已去除上一次歌曲的残留（原因：如果当前歌曲的数据还没请求回来则可能当前仍然展示的是上一首歌曲的信息）
      ctx.currentSong = {}
      ctx.durationTime = 0,
      ctx.lyricInfos = [],
      ctx.currentTime = 0,
      ctx.currentLyricText = '',
      ctx.currentIndex = 0,

      ctx.id = id
      // 修改播放状态
      ctx.isPlaying = true;
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

      // 监听audioContext,但没必要每次添加新的监听，因为是给同一个audioContext添加，只需第一首歌曲的时候添加监听
      if(ctx.isFirstPlay){
        this.dispatch("setUpAudioContextListenerAction")
        ctx.isFirstPlay = false;
      }
    },
    setUpAudioContextListenerAction(ctx){
      // 1.监听歌曲可以播放
      audioContext.onCanplay(() => {
        audioContext.play();
      })
      // 2.监听播放时间的改变
      audioContext.onTimeUpdate(() => {
        const currentTime = audioContext.currentTime * 1000
        ctx.currentTime = currentTime

        if(!ctx.lyricInfos.length) return
        let i=0
        for(;i<ctx.lyricInfos.length;i++){
          const lyricInfo = ctx.lyricInfos[i]
          if(currentTime < lyricInfo.time){
            break         
          }
        }
        const currentIndex = i - 1
        if(currentIndex !== ctx.currentIndex){
          const currentLyricInfo = ctx.lyricInfos[currentIndex]
          // this.setData({ currentLyricText: currentLyricInfo.text,currentIndex,lyricTextScroll: currentIndex * 35})
          ctx.currentLyricText = currentLyricInfo.text
          ctx.currentIndex = currentIndex
        }
      })
      // 3.监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch('changeNewMusicAction')
      })
    },
    changeMusicPlayStatusAction(ctx,isPlaying = true){
      ctx.isPlaying = isPlaying
      if(ctx.isPlaying){
        audioContext.play()
      }else{
        audioContext.pause()
      }
    },
    changeNewMusicAction(ctx,isNext = true){
      let index = ctx.playListIndex
      // 根据不同播放模式获取下一首歌曲
      switch(ctx.playModeIndex){
        case 0:
          index = isNext ? index + 1 : index - 1
          if(index === ctx.playListSongs.length) index = 0
          if(index === -1) index = ctx.playListSongs.length - 1
          break
        case 1:
          break  
        case 2:
          index = Math.floor(Math.random() * ctx.playListSongs.length)
          break  
      }  
      let currentSong = ctx.playListSongs[index]
      if(!currentSong){
        currentSong = ctx.currentSong
      }else{
        ctx.playListIndex = index
      }
      this.dispatch('playSongWithIdAction',{ id:currentSong.id,isRefresh:true })
    },
  }
})
export {
  audioContext,
  playStore
}