// pages/home-music/index.js
import { getSwiperBanner } from '../../service/api_music'
import { getSongMenu } from '../../service/api_music'
import { getRecommendSongMenu } from '../../service/api_music'
import { rankingStore,rankingMap } from "../../store/index"
import querySelector from "../../utils/query-select"
import throttle from "../../utils/throttle" 

const throttleQueryRect = throttle(querySelector)
Page({
  data: {
    bannerList:[],
    swiperHeight:0,
    title:'推荐歌曲',
    rightText:'更多',
    recommendSongs:[],
    hotSongs:[],
    recommendSongMenu:[],
    rankings:{ 0:{}, 2:{}, 3:{} }
  },
  onLoad(options) {
    // 请求页面数据
    this.getPageData();

    // 请求store数据
    rankingStore.dispatch('getRankingDataAction');

    //监听store里面的数据
    rankingStore.onState("hotRanking", (res) => {
      if(!res.tracks) return
      this.setData({ recommendSongs:res.tracks.slice(0,6) })
    })

    rankingStore.onState("newRanking",this.getRankingHandle(0))
    rankingStore.onState("originRanking",this.getRankingHandle(2))
    rankingStore.onState("upRanking",this.getRankingHandle(3))
  },
  // 网络请求
  getPageData(){
    getSwiperBanner().then(res => {
      // setData是同步的还是异步的（在设置data时是同步的，在渲染wxml时是异步的）
      this.setData({ bannerList:res.banners })
    }),
    getSongMenu().then(res => {
      this.setData({ hotSongs:res.playlists })
    }),
    getRecommendSongMenu("华语").then(res => {
      this.setData({ recommendSongMenu:res.playlists })
    })
  },
  // 事件触发
  handleSearch(){
    wx.navigateTo({
      url: '/pages/detail-search/index'
    })
  },
  handleSwiperLoaded(){
    // 获取image组件的高度(此处调用多次，使用节流函数)
    querySelector(".swiper-image").then(res => {
      this.setData({ swiperHeight:res[0].height })
    })
  },
  // 点击更多,跳转到歌曲列表
  handleMoreClick(){
    this.handleJumpDetailSongs('hotRanking');
  },
  // 点击巅峰榜的每一项,跳转到歌曲列表
  handleDeatilSongs(event){
    let idx = event.currentTarget.dataset.idx;
    this.handleJumpDetailSongs(rankingMap[idx]);
  },
  handleJumpDetailSongs(rankName){
    wx.navigateTo({
      url:`/pages/detail-songs/index?ranking=${rankName}&type=rank`
    })
  },
  onUnload() {
    // rankingStore.offState("newRanking",this.getNewRankingHandle)
  },
  getRankingHandle(idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return
      const name = res.name;
      const playCount = res.playCount;
      const coverImgUrl = res.coverImgUrl;
      const songList = res.tracks.slice(0,3);
      const rankingObj = { name,coverImgUrl,songList,playCount }
      const newRankimgs = { ...this.data.rankings,[idx]:rankingObj};
      this.setData({
        rankings : newRankimgs
      })
    }
  }
})