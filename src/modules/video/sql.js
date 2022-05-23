
const GET_VIDEOS = `
    select  
        video_id,
        user_id,
        video_name,
        view_file,
        create_time,
        create_date,
        download_link,
        size 
    from videos 
    where video_name ilike concat('%',$3::varchar,'%')
    offset $1 limit $2 
`
const GET_VIDEO = `
    select 
        video_id,
        user_id,
        video_name,
        view_file,
        create_time,
        create_date,
        download_link,
        size
    from videos where user_id::varchar = $1
`
const ADD_VIDEO =  `
    insert into videos (
        user_id, 
        video_name,
        view_file,
        create_time,
        create_date,
        download_link,
        size
    ) 
    values($1,$2,$3,$4,$5,$6,$7) returning *
`

const DELETE_VIDEO = `
    delete from videos where video_id = $1 and user_id = $2 returning *
`
const UPDATE_VIDEO = `
    update videos set 
    video_name = $1
    where video_id = $2 and user_id = $3 returning *
`

export default {
    GET_VIDEOS,
    GET_VIDEO,
    ADD_VIDEO,
    DELETE_VIDEO,
    UPDATE_VIDEO
}
