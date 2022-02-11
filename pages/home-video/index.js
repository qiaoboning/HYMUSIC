// pages/home-video/index.js
import {getTopMv} from '../../service/api_video.js'
Page({
  data: {
    topMVS:[],
    hasMore:true
  },
  onLoad(options) {
    this.getTopMvData(0)
  },
  // 封装网络请求
  async getTopMvData(offset){
    if(!this.data.hasMore) return
    // 展示加载动画
    wx.showNavigationBarLoading()
    const res = await getTopMv(offset)
    if(offset === 0){
      this.setData({ topMVS:res.data,hasMore:res.hasMore })
    }else{
      this.setData({ topMVS:[...this.data.topMVS,...res.data],hasMore:res.hasMore })
    }
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },
  // 封装事件监听
  handleVideoItemClick(event){
    let id = event.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/pages/detail-video/index?id='+id,
    })
  },
  // 其他生命周期回调函数
  onPullDownRefresh(){
    this.getTopMvData(0)
  },
  onReachBottom(){
    this.getTopMvData(this.data.topMVS.length)
  },
  onUnload() {

  }
})