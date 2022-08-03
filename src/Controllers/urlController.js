import connection from '../dbStrategy/postgres.js'
import joi from 'joi'

export async function EncodeUrl(req, res) {

    const { authorization } = req.headers

    const body = req.body

    const token = authorization?.replace('Bearer ', '')

    return res.send(token)

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