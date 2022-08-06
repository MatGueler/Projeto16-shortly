
import connection from '../dbStrategy/postgres.js'

export async function rankingUsers(req, res) {

    try {

        const { rows: ranking } = await connection.query
            (`SELECT users.id,users.name,COUNT(su."shortUrl") AS "linksCount",SUM(views.view) AS "visitCount" FROM  users
            LEFT JOIN "shortUrls" su ON su."userId"=users.id
            LEFT JOIN views ON su.id=views."shortUrlId"
            GROUP BY users.id
            ORDER BY "visitCount" DESC`)

        return res.status(200).send(ranking)
    }
    catch {
        return res.send(500)
    }

}