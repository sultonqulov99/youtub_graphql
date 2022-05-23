import { USER_CONFIG } from '../../config/index.js'
import { finished } from 'stream/promises'
import JWT from '#helpers/jwt'
import sha256 from 'sha256'
import ip from '#helpers/getIp'
import fs from 'fs'
import path from 'path'
import model from './model.js'

export default {
    Mutation: {
        login: async (_,{ username, password },{userIp, agent }) => {
            try {
                username = username.trim()
                password = password.trim()
                let users = await model.getUsers({page: USER_CONFIG.PAGINATION.PAGE,limit:USER_CONFIG.PAGINATION.LIMIT})
                let user = users.find(user => user.username == username && user.password == sha256(password))
                if(user) {
                    return {
                        status: 200,
                        message: "The user successfully",
                        data: user,
                        token: JWT.sign({
                            userId: user.user_id,
                            userIp,
                            agent,
                        })
                    }
                }
                return {
                    status: 400,
                    message: "Invalid username or password"
                }
            } catch (error) {
                throw new error(error.message)
            }
        },  
        register: async (_, {username, password, profileImg }, {agent, userIp }) => {
            try {
                const { createReadStream, filename, mimetype } = await profileImg
                if(!mimetype.includes('image')){
                    return {
                        status:400,
                        message: 'file error',
                    }
                }
                let fileName = Date.now() + filename.replace(/\s/g, '')
                username = username.trim()
                password = password.trim()
    
    
                const out = fs.createWriteStream(path.join(process.cwd(), 'uploads', fileName))
                createReadStream().pipe(out)
                await finished(out)
                let size = out.bytesWritten / 1000000

                if(size > 1) {
                return {
                    status:400,
                    message: "The size of this fail is large"
                }
            }
                password = sha256(password)
                let user = await model.createUser(username,password,fileName)
    
                return {
                    status: 200,
                    message: "User successfully registered!",
                    data: user[0],
                    token: JWT.sign({
                        userId: user[0].user_id,
                        userIp,
                        agent,
                    })
                }
            } catch (error) {
                throw new error(error.message)
            }
        }
    },
    Query : {
        user: async (_, args) => {
            return  await model.getUser(args)
        },

        users:async (_, { pagination}) =>{
            return await model.getUsers({
                page: pagination?.page || USER_CONFIG.PAGINATION.PAGE,
                limit: pagination?.limit || USER_CONFIG.PAGINATION.LIMIT
            })
        }
    },
    User: {
        userId: global => global.user_id,
        profileImg: global => 'https://youtubbackendgraphql.herokuapp.com/' + global.profile_img
    }
}