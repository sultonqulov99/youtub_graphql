import { USER_CONFIG } from '../../config/index.js'
import { finished } from 'stream/promises'
import fs from 'fs'
import path from 'path'
import model from './model.js'

export default {
    Mutation : {
        addVideo : async (_, {viewFile,videoName},{userId}) =>{
            try {
                const { createReadStream, filename, mimetype } = await viewFile
    
                if(!mimetype.includes('video')){
                    return {
                        status:400,
                        message: 'file error',
                    }
                }
                const fileName = Date.now() + filename.replace(/\s/g, '')
                videoName = videoName.trim()
    
                const out = fs.createWriteStream(path.join(process.cwd(), 'uploads', fileName))
                createReadStream().pipe(out)
                await finished(out)
                
                let date = new Date()
                viewFile = fileName
                let createTime = date.toTimeString().split(0,20).splice(1,1)
                let createDate = date
                let downloadLink = fileName
                let size = out.bytesWritten / 1000000
    
                if(size > 20) {
                    return {
                        status:400,
                        message: "The size of this fail is large"
                    }
                }
    
                let [video] = await model.addVideo(userId,videoName,viewFile,createTime,createDate,downloadLink,size)
                return {
                    status: 200,
                    message: "Video succassfully added!",
                    data: video
                }
            } catch (error) {
                throw new Error(error.message)
            }
        },
        deleteVideo:async (_,{videoId},{userId}) =>{
            try {
                const video = await model.deleteVideo(videoId,userId)
                if(video.length == 0){
                    return {
                        status:404,
                        message:"You are not allowed"
                    }
                }
                return{
                    status:200,
                    message:"Delete video",
                    data:video[0]
                }
            } catch (error) {
                throw new Error(error.message)
            }
        },
        changeVideo: async (_,{videoName,videoId},{userId}) => {
            try {
                const [putVideo] = await model.changeVideo(videoName,videoId,userId)
                if(putVideo.length == 0){
                    return {
                        status: 404,
                        message: "You are not allowed"
                    }
                }
                return {
                    status: 200,
                    message: "Update video",
                    data: putVideo
                }
            } catch (error) {
                throw new Error(error.message)
            }
        }
    },
    Query : {
        videos: async (_, { pagination , search}) =>{
            return await model.getVideos({
                page: pagination?.page || USER_CONFIG.PAGINATION.PAGE,
                limit: pagination?.limit || USER_CONFIG.PAGINATION.LIMIT,
                search
            })
        },
        video: async (_, args) => {
            return  await model.getVideo(args)
        },
        adminVideos: async(_,args,{userId})=>{
            const videos = await model.getVideos({page: USER_CONFIG.PAGINATION.PAGE,limit:USER_CONFIG.PAGINATION.LIMIT})
            const video = videos.filter(video => video.user_id == userId)
            return video
        }
    },
    Video: {
        videoId: global => global.video_id,
        userId: global => global.user_id,
        videoName: global => global.video_name,
        viewFile: global => 'https://youtubbackendgraphql.herokuapp.com/' + global.view_file,
        createTime: global => global.create_time,
        createDate: global => global.create_date,
        downloadLink: global => global.download_link,
        size: global => global.size
    },
    Admin: {
        videoId: global => global.video_id,
        userId: global => global.user_id,
        videoName: global => global.video_name,
        viewFile: global => 'https://youtubbackendgraphql.herokuapp.com/'+ global.view_file,
        createTime: global => global.create_time,
        createDate: global => global.create_date,
        downloadLink: global => global.download_link,
        size: global => global.size
    }
}