import hyRequest from './index.js'
export function getTopMv(offset,limit = 10){
  return hyRequest.get('/top/mv',{offset,limit})
}
// 请求MV的播放地址
export function getMVURL(id){
  return hyRequest.get("/mv/url",{
    id
  })
}
// 请求MV的详情
export function getMVDetail(mvid){
  return hyRequest.get("/mv/detail",{
    mvid
  })
}
// 请求相关视频
export function getRelateVideo(id){
  return hyRequest.get("/related/allvideo",{
    id
  })
}