import connection from '../dbStrategy/postgres.js'
import { nanoid } from 'nanoid/non-secure'
import joi from 'joi'

export async function EncodeUrl(req, res) {

    try {
        const { id } = res.locals.dados

        const { url } = req.body

        let shortUrl;

        const userSchema = joi.object({
            url: joi.string().uri().required()
        });

        const validation = userSchema.validate({ url }, { abortEarly: true });

        if (validation.error) {
            let err = validation.error.details[0].message
            return res.status(422).send(err)
        }

        let { rows: myUrl } = await connection.query
            (`SELECT * FROM urls
        WHERE url=$1`
                , [url])

        let urlId;

        const urlNotExist = myUrl.length === 0;

        // Para o caso dessa url ainda nao ter sido reduzida
        if (urlNotExist) {

            await connection.query(`INSERT INTO urls (url) 
            VALUES ($1)`
                , [url]);

            const { rows: myUrl } = await connection.query
                (`SELECT * FROM urls
            WHERE url=$1`
                    , [url])

            urlId = myUrl[0].id
        }
        else {
            urlId = myUrl[0].id
        }

        console.log({ urlId, id })

        const { rows: myShortUrl } = await connection.query
            (`SELECT * FROM "shortUrls"
        WHERE "urlId"=$1 AND "userId"=$2`
                , [urlId, id])

        const urlNotShort = myShortUrl.length === 0

        if (urlNotShort) {

            shortUrl = nanoid()

            await connection.query(`INSERT INTO "shortUrls" ("urlId","userId","shortUrl") 
            VALUES ($1,$2,$3)`
                , [urlId, id, shortUrl]);

            const { rows: myShortUrl } = await connection.query
                (`SELECT * FROM "shortUrls"
            WHERE "urlId"=$1 AND "userId"=$2`
                    , [urlId, id])

            const shortUrlId = myShortUrl[0].id

            await connection.query(`INSERT INTO views ("shortUrlId") 
            VALUES ($1)`
                , [shortUrlId]);

            shortUrl = myShortUrl[0].shortUrl
        }
        else {
            shortUrl = myShortUrl[0].shortUrl
        }

        const body = {
            shortUrl
        }

        return res.status(201).send(body)
    }
    catch {
        return res.send(500)
    }

}

export async function ShowUrl(req, res) {

    try {

        const { id } = req.params;

        const { rows: url } = await connection.query
            (`SELECT "shortUrls".id,"shortUrls"."shortUrl",urls.url FROM "shortUrls"
            JOIN urls ON urls.id = "shortUrls"."urlId"
            WHERE "shortUrls".id=$1`
                , [id])

        const existUrl = url.length !== 0

        if (existUrl) {
            return res.status(200).send(url)
        }
        else {
            return res.send(404)
        }

    }
    catch {
        return res.send(500)
    }

}

export async function OpenUrl(req, res) {

    try {

        const { shortUrl } = req.params;

        const { rows: myShortUrl } = await connection.query
            (`SELECT "shortUrls".id,"shortUrls"."shortUrl",urls.url FROM "shortUrls"
            JOIN urls ON urls.id = "shortUrls"."urlId"
            WHERE "shortUrls"."shortUrl"=$1`
                , [shortUrl])

        const existUrl = myShortUrl.length !== 0

        if (existUrl) {

            const shortUrlId = myShortUrl[0].id
            const url = myShortUrl[0].url

            await connection.query(`INSERT INTO visits ("shortUrlId") 
            VALUES ($1)`
                , [shortUrlId]);

            const { rows: views } = await connection.query(`SELECT COUNT(v."shortUrlId") as viewsNumber FROM visits v
            WHERE v."shortUrlId"=($1)`
                , [shortUrlId]);

            const numberViews = views[0].viewsnumber

            await connection.query(`UPDATE views SET view = $1 
            WHERE views."shortUrlId" = $2`
                , [numberViews, shortUrlId]);

            return res.redirect(url)
        }
        else {
            return res.send(404)
        }

    }
    catch {
        return res.send(500)
    }

}

export async function userUrls(req, res) {

    try {

        const idUser = res.locals.dados.id

        const { rows: user } = await connection.query
            (`SELECT users.id,users.name,SUM(v.view) AS "visitCount" FROM views v
            JOIN "shortUrls" su ON v."shortUrlId"=su.id
            JOIN users ON su."userId"=users.id
            WHERE su."userId"=$1
            GROUP BY users.name,users.id`
                , [idUser])

        const { rows: shortUrls } = await connection.query
            (`SELECT su.id,su."shortUrl",urls.url,views.view AS "visitCount" FROM "shortUrls" su
            JOIN urls ON urls.id=su."urlId"
            JOIN views ON views."shortUrlId"=su.id
            WHERE su."userId"=$1`
                , [idUser])

        const body = { ...user[0], shortenedUrls: shortUrls }

        return res.status(200).send(body)
    }
    catch {
        return res.send(500)
    }

}