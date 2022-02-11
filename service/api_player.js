import hyRequest from './index.js'
export function getSongDetail(ids){
  return hyRequest.get("/song/detail",{
    ids
  })
}