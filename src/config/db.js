import pg from 'pg'

// const pool = new pg.Pool({
//     user: process.env.PG_USER,
//     password: process.env.PG_PASSWORD,
//     database: process.env.PG_DATABASE,
//     host: process.env.PG_HOST,
//     port: process.env.PG_PORT,
// })
//postgres://mcwkakdk:bMaJUWs1t18YKHqSq3lMxgbZcz0SmyMD@arjuna.db.elephantsql.com/mcwkakdk/
const pool = new pg.Pool({
    user: 'mcwkakdk',
    password: 'bMaJUWs1t18YKHqSq3lMxgbZcz0SmyMD',
    database: 'mcwkakdk',
    host: 'arjuna.db.elephantsql.com',
    port: 5432,
})

async function db (query, ...params) {
    const client = await pool.connect()

    try {
        const {rows} = await client.query(query, params.length ? params : null)
        return rows
    } catch (error) {
        console.log('Database error:', error.message);
        throw new Error(error.message)
    }finally{
        client.release()
    }
}

export default db