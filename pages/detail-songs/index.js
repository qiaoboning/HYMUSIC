// pages/detail-songs/index.js
import { rankingStore } from "../../store/ranking-store";
import { playStore } from "../../store/index"
import { getMenuSongDetail } from "../../service/api_detail_song"

Page({
  data: {
    type:"",
    rankName:'',
    songInfo:{},
  },
  onLoad: function (options) {
    if(options.type == 'rank'){
      const rankName = options.ranking;
      this.setData({ rankName,type:'rank' })
      rankingStore.onState( rankName,this.getRankingData )
    }else if(options.type == 'menu'){
      const id = options.id;
      getMenuSongDetail(id).then(res => {
        this.setData({
          songInfo:res.playlist,
          type:'menu'
        })
      })
    }
  },
  getRankingData(res){
    this.setData({
      songInfo : res
    })
  },
  handleSongItem(event){
    const index = event.currentTarget.dataset.index;
    playStore.setState('playListIndex',index)
    playStore.setState('playListSongs',this.data.songInfo.tracks)    
  },
  onUnload: function () {
    if(this.data.rankName){
      rankingStore.offState( this.data.rankName,this.getRankingData )
    }
  }
})