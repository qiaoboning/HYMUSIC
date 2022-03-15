// pages/music-player/index.js
import { audioContext,playStore } from '../../store/play-store'
const globalData = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',//当前歌曲id

    currentSong:{},
    durationTime:0,//歌曲总时间
    lyricInfos:[],

    currentTime:0,//当前播放的时间
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
    // const globalData = getApp().globalData
    const deviceRadio = globalData.deviceRadio
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({contentHeight,isMusicLynic:deviceRadio >= 2})

    this.audioContextListener()

    // audioContext的事件监听
    this.setUpPlayerStoreListener()
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

      if(!this.data.lyricInfos.length) return
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
  // 左上角返回btn监听
  handleBackClick(){
    wx.navigateBack()
  },
  setUpPlayerStoreListener(){
    playStore.onStates(['currentSong','durationTime','lyricInfos'],({
      currentSong,
      durationTime,
      lyricInfos
    }) => {
      if (currentSong) this.setData({ currentSong })
      if (durationTime) this.setData({ durationTime })
      if (lyricInfos) this.setData({ lyricInfos })
    })
  },
  onUnload: function () {
    audioContext.stop();
  },
 
})