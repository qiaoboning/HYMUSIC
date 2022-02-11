import hyRequest from "./index";

export function getMenuSongDetail(id){
    return hyRequest.get('/playlist/detail/dynamic',{
        id
    })
}