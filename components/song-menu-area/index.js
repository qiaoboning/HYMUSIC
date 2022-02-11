// components/song-menu-area/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:'歌单'
    },
    menuData:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    jumpToDetailSongs(options){
      const id = options.currentTarget.dataset.item.id;
      wx.navigateTo({
        url:`/pages/detail-songs/index?id=${id}&type=menu`
      })
    }
  }
})
