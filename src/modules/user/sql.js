const GET_USERS = `
    select 
        user_id,
        username,
        password,
        profile_img
    from users
    offset $1 limit $2 
`
const GET_USER = `
    select 
        user_id,
        username,
        password,
        profile_img
    from users where user_id::varchar = $1
`
const CREATE_USER = `
    insert into users (username,password,profile_img) values ($1,$2,$3) returning *
`


export default {
    GET_USERS,
    GET_USER,
    CREATE_USER
}
