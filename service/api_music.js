import hyRequest from './index.js'
export function getSwiperBanner(){
  return hyRequest.get("/banner",{
    type:2
  })
}
export function getRanking(idx){
  return hyRequest.get("/top/list",{
    idx
  })
}
export function getSongMenu(cat="全部",limit=6,offset=0){
  return hyRequest.get("/top/playlist",{
    cat,
    limit,
    offset
  })
}

export function getRecommendSongMenu(cat="全部",limit=6,offset=0){
  return hyRequest.get("/top/playlist",{
    cat,
    limit,
    offset
  })
}
