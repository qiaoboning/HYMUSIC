// pages/detail-video/index.js
import {getMVURL,getMVDetail,getRelateVideo} from "../../service/api_video.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    MVURLInfos:{},
    MVDetail:{},
    MVRelateVideoS:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id;
    this.getPageData(id);
  },
  // 网络请求
  getPageData(id){
    // 请求MV的播放地址
    getMVURL(id).then(res => {
      this.setData({ MVURLInfos:res.data })
    })
    // 请求MV的详情
    getMVDetail(id).then(res => {
      this.setData({ MVDetail:res.data })
    })
    // 请求相关视频
    getRelateVideo(id).then(res => {
      this.setData({ MVRelateVideoS:res.data })
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  }
})