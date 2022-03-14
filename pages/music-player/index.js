// pages/music-player/index.js
import { getSongDetail,getSongLyric } from '../../service/api_player'
import { audioContext } from '../../store/play-store'
import { parseLyric } from '../../utils/parse-lyric'
const globalData = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',//当前歌曲id
    currentSong:{},
    durationTime:0,//歌曲总时间
    currentTime:0,//当前播放的时间
    lyricInfos:[],
    currentLyricText:'',
    currentIndex:0,
    lyricTextScroll:0,

    isMusicLynic:false,//是否显示歌词
    currentPage:0,
    contentHeight:0,
    sliderValue:0,
    isSliderChanging:false,//记录是否正在拖拽slider,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id;
    this.setData({id})
    this.getPageData(id)
    // const globalData = getApp().globalData
    const deviceRadio = globalData.deviceRadio
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({contentHeight,isMusicLynic:deviceRadio >= 2})

    // 使用audioContext播放音乐
    audioContext.stop();//播放下一首之前停止当前播放的
    audioContext.src = encodeURI(`https://music.163.com/song/media/outer/url?id=${id}.mp3`)
    this.audioContextListener()
  },
  // 网络请求
  getPageData(id){
    getSongDetail(id).then(res => {
      this.setData({ currentSong:res.songs[0],durationTime: res.songs[0].dt})
    })
    getSongLyric(id).then(res => {
      const lyricString = res.lrc.lyric
      const lyricInfos = parseLyric(lyricString);
      this.setData({ lyricInfos })
    })
  },
  // audio监听
  audioContextListener(){
    audioContext.onCanplay(() => {
      audioContext.play();
    })
    // 当前播放时间
    audioContext.onTimeUpdate(() => {
      const currentTime = audioContext.currentTime * 1000
      if(!this.data.isSliderChanging){
        this.setData({
          currentTime,
          sliderValue:(currentTime / this.data.durationTime) * 100
        })
      }  
      let i=0
      for(;i<this.data.lyricInfos.length;i++){
        const lyricInfo = this.data.lyricInfos[i]
        if(currentTime < lyricInfo.time){
          break         
        }
      }
      const currentIndex = i - 1
      if(currentIndex !== this.data.currentIndex){
        const currentLyricInfo = this.data.lyricInfos[currentIndex]
        this.setData({ currentLyricText: currentLyricInfo.text,currentIndex,lyricTextScroll: currentIndex * 35})
      }

      // const currentLyricInfo = this.data.lyricInfos.find(item => {
      //   console.log(item)
      //   item.time > currentTime
      // })
      // console.log(currentLyricInfo);
      // this.setData({lyricText:currentLyricInfo.text})
    })
  },
  // slider正在改变（用户手指拖拽中）
  sliderChanging(event){
    const value = event.detail.value;
    const currentTime = this.data.durationTime * (value / 100)
    this.setData({ isSliderChanging:true,currentTime })
  },
  // slider改变
  sliderChange(event){
    const value = event.detail.value;
    const currentTime = this.data.durationTime * (value / 100)
    audioContext.pause()
    audioContext.seek(currentTime / 1000)
    // 记录最新的sliderValue
    this.setData({ sliderValue:value,isSliderChanging:false })
  },
  // 事件处理
  handleSwiperItem(event){
    const currentPage = event.detail.current;
    this.setData({ currentPage })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    audioContext.stop();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})