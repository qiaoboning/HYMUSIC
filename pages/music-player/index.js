// pages/music-player/index.js
import { getSongDetail } from '../../service/api_player'
const globalData = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',//当前歌曲id
    currentSong:[],
    currentPage:0,
    contentHeight:0,
    isMusicLynic:false,//是否显示歌词
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
    console.log(deviceRadio)
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({contentHeight,isMusicLynic:deviceRadio >= 2})

    // 创建播放器
    const audioContext =  wx.createInnerAudioContext();
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // audioContext.play();
  },
  getPageData(id){
    getSongDetail(id).then(res => {
      this.setData({currentSong:res.songs[0]})
    })
  },
  handleSwiperItem(event){
    const currentPage = event.detail.current;
    this.setData({ currentPage })
  },
  sliderChange(){

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