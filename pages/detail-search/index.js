// pages/detail-search/index.js
import { getSearchHot,getSearchSuggest,getSearchResult } from "../../service/api_search";
import { stringToNodes } from "../../utils/string2nodes"
Page({
  data: {
    searchValue:"",
    hotKeyWords:[],
    suggestSongs:[],
    resultSongs:[],
    suggestSongsNodes:[]
  },
  onLoad: function (options) {
    this.getPageData();
  },
  getPageData(){
    getSearchHot().then(res => {
      this.setData({
        hotKeyWords:res.result.hots
      })
    })
  },
  handleSearchSuggest(event){
    const searchValue = event.detail
    this.setData({searchValue})
    if(!searchValue.length){
      this.setData({
        suggestSongs:[],
        resultSongs:[]
      })
      return
    }
    getSearchSuggest(searchValue).then(res => {
      // if(!this.data.searchValue.length){
      //   return
      // }
      const suggestSongs = res.result.allMatch
      this.setData({
        suggestSongs
      })
      if(!suggestSongs.length) return
      const suggestKeywords = suggestSongs.map(item => item.keyword);
      const suggestSongsNodes = []
      for(const keyword of suggestKeywords){
        const nodes = stringToNodes(keyword,searchValue)
        suggestSongsNodes.push(nodes);
      }
      this.setData({
        suggestSongsNodes
      })
    })
  },
  handleSearchAction(){
    const searchValue = this.data.searchValue;
    getSearchResult(searchValue).then(res => {
      this.setData({
        resultSongs:res.result.songs
      })
    })
  },
  handleClickItem(event){
    const index = event.currentTarget.dataset.index;
    const searchValue = this.data.suggestSongs[index].keyword
    this.setData({
      searchValue
    })
    this.handleSearchAction()
  },
  handleClickDefaultItem(event){
    const searchValue =  event.currentTarget.dataset.item
    this.setData({
      searchValue
    })
    this.handleSearchAction()
  }
})