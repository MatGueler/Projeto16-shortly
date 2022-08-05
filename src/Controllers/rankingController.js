
import connection from '../dbStrategy/postgres.js'

export async function rankingUsers(req, res) {

    try {

        const { rows: ranking } = await connection.query
            (`SELECT users.id,users.name,COUNT(su."shortUrl") AS "linksCount",SUM(v.view) AS "visitCount" FROM views v
            JOIN "shortUrls" su ON v."shortUrlId"=su.id
            JOIN users ON su."userId"=users.id
            GROUP BY users.name,users.id
            ORDER BY "visitCount" DESC LIMIT 10`)

        return res.status(200).send(ranking)
    }
    catch {
        return res.send(500)
    }

}