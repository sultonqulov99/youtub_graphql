import db from '#pg'
import query from './sql.js'

async function getUsers({page,limit,search}){
    return await db(query.GET_USERS, (page-1)* limit,limit,search)
}
async function getUser({userId}){
    const [user] = await db(query.GET_USER, userId)
    return user
}
async function createUser(username,password,profileImg){
    const user = await db(query.CREATE_USER,username,password,profileImg)
    return user
}

export default {
    getUsers,
    getUser,
    createUser
}