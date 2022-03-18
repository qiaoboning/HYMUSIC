// pages/music-player/index.js
import { audioContext,playStore } from '../../store/play-store'
const globalData = getApp().globalData
const playModeNames = ['order','repeat','random']
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

    playModeIndex:0,
    playModeName:'order',
    isPlaying:false,
    playingName:'pause'
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

    // audioContext的事件监听
    this.setUpPlayerStoreListener()
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
  handleModeBtnClick(){
    let currentPlayModeIndex = this.data.playModeIndex + 1;
    if(currentPlayModeIndex == 3){
      currentPlayModeIndex = 0
    }
    playStore.setState('playModeIndex',currentPlayModeIndex)
  },
  handlePlayBtnClick(){
    playStore.dispatch('changeMusicPlayStatusAction',!this.data.isPlaying)
  },
  // 上一首
  handlePrevBtnClick(){
    playStore.dispatch("changeNewMusicAction",false)
  },
  // 下一首
  handleNextBtnClick(){
    playStore.dispatch("changeNewMusicAction")
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

    playStore.onStates(['currentTime','currentLyricText','currentIndex'],({
      currentTime,
      currentLyricText,
      currentIndex
    }) => {
      // 时间变化
      if(currentTime && !this.data.isSliderChanging){
        this.setData({
          currentTime,
          sliderValue:(currentTime / this.data.durationTime) * 100
        })
      } 
      // 歌词变化
      if(currentIndex){
        this.setData({ currentIndex: currentIndex,lyricTextScroll: currentIndex * 35})
      }
      if(currentLyricText){
        this.setData({ currentLyricText })
      }
    })

    // 3.监听播放模式数据
    playStore.onStates(['playModeIndex','isPlaying'],({playModeIndex,isPlaying}) => {
      if(playModeIndex !== undefined){
        this.setData({
          playModeIndex,
          playModeName:playModeNames[playModeIndex]
        })
      }
      if(isPlaying !== undefined){
        this.setData({
          isPlaying,
          playingName:isPlaying ? "pause":"resume"
        })
      }
    })
  },
  onUnload: function () {
    audioContext.stop();
  }, 
})