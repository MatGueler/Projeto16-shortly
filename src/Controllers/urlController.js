import connection from '../dbStrategy/postgres.js'
import { nanoid } from 'nanoid/non-secure'
import joi from 'joi'

export async function EncodeUrl(req, res, next) {

    try {
        const { id } = res.locals.dados
        const url = res.locals.url

        let shortUrl;

        const userSchema = joi.object({
            url: joi.string().uri().required()
        });

        const validation = userSchema.validate({ url }, { abortEarly: true });

        if (validation.error) {
            let err = validation.error.details[0].message
            return res.status(422).send(err)
        }

        const { rows: myUrl } = await connection.query
            (`SELECT * FROM urls
        WHERE url=$1`
                , [url])

        const urlNotExist = myUrl.length === 0;

        // Para o caso dessa url ainda nao ter sido reduzida
        if (urlNotExist) {

            shortUrl = nanoid()

            await connection.query(`INSERT INTO urls (url) 
            VALUES ($1)`
                , [url]);

            const { rows: myUrl } = await connection.query
                (`SELECT * FROM urls
            WHERE url=$1`
                    , [url])

            const urlId = myUrl[0].id

            await connection.query(`INSERT INTO "shortUrls" ("urlId","shortUrl") 
            VALUES ($1,$2)`
                , [urlId, shortUrl]);

        }

        const urlId = myUrl[0].id

        const { rows: myShortUrl } = await connection.query
            (`SELECT * FROM "shortUrls"
        WHERE "urlId"=$1`
                , [urlId])

        const urlShortId = myShortUrl[0].id

        const { rows: myUserShort } = await connection.query
            (`SELECT * FROM "usersShort"
        WHERE id=$1 AND "shortUrlId"=$2`
                , [id, urlShortId])

        if (myUserShort.length === 0) {
            await connection.query(`INSERT INTO "usersShort" ("userId","shortUrlId") 
            VALUES ($1,$2)`
                , [id, urlShortId]);

            shortUrl = myShortUrl[0].shortUrl
        }

        const body = {
            shortUrl
        }

        return res.status(201).send(shortUrl)
    }
    catch {
        return res.send(500)
    }


    // try {
    //     const { email, password } = req.body

    //     // const cryptPassword = 

    //     const { rows: users } = await connection.query
    //         (`SELECT * FROM users
    //     WHERE email=$1`
    //             , [email])

    //     const noExist = users.length === 0;

    //     const userSchema = joi.object({
    //         email: joi.string().email().required(),
    //         password: joi.string().min(8).required(),
    //     });

    //     const validation = userSchema.validate({ email, password }, { abortEarly: true });

    //     if (validation.error || noExist) {
    //         let err;
    //         if (noExist) {
    //             err = "This account doesn't exist"
    //             return res.status(401).send(err)
    //         }
    //         if (validation.error) {
    //             err = validation.error.details[0].message
    //             return res.status(422).send(err)
    //         }
    //     }

    //     const dados = { id: users.id };
    //     const chaveSecreta = process.env.JWT_SECRET;
    //     const token = jwt.sign(dados, chaveSecreta);

    //     // await connection.query(`INSERT INTO tokens (token) 
    //     // VALUES ($1)`
    //     //     , [token]);

    //     return res.status(201).send(token)
    // }
    // catch {
    //     return res.send(500)
    // }

}