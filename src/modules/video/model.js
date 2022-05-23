import db from '#pg'
import query from './sql.js'

async function getVideos({page,limit,search}){
    const video = await db(query.GET_VIDEOS,(page-1)*limit,limit,search)
    return video
}
async function getVideo({userId}){
    const video = await db(query.GET_VIDEO, userId)
    return video
}
async function addVideo(userId,videoName,viewFile,createTime,createDate,downloadLink,size){
    const video = await db(query.ADD_VIDEO,userId,videoName,viewFile,createTime,createDate,downloadLink,size)
   
    return video
}

async function deleteVideo(videoId,userId){
    const video = await db(query.DELETE_VIDEO, videoId,userId)
    return video
}

async function changeVideo(video_name,videoId,user_id){
    const video = await db(query.UPDATE_VIDEO, video_name,videoId,user_id)
    return video
}

export default {
    getVideos,
    getVideo,
    addVideo,
    deleteVideo,
    changeVideo
}