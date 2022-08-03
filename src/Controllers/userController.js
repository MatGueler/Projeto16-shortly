import connection from '../dbStrategy/postgres.js'
import joi from 'joi'

export async function CreateUser(req, res) {

    try {
        const { name, email, password, confirmPassword } = req.body

        // const cryptPassword = 

        const { rows: users } = await connection.query
            (`SELECT * FROM users
        WHERE email=$1`
                , [email])

        const alreadyExist = users.length !== 0;
        const difPassword = password !== confirmPassword;

        const userSchema = joi.object({
            name: joi.string().required(),
            email: joi.string().email().required(),
            password: joi.string().min(8).required(),
            confirmPassword: joi.string().min(8).required(),
        });

        const validation = userSchema.validate({ name, email, password, confirmPassword }, { abortEarly: true });

        if (validation.error || difPassword || alreadyExist) {
            let err;
            if (difPassword) {
                err = "The passwords must be the same"
            }
            if (alreadyExist) {
                err = "This account already exist"
                return res.status(409).send(err)
            }
            if (validation.error) {
                err = validation.error.details[0].message
            }
            return res.status(422).send(err)
        }

        await connection.query(`INSERT INTO users (name, email, password) 
        VALUES ($1,$2,$3)`
            , [name, email, password]);

        return res.send(201)
    }
    catch {
        return res.send(500)
    }
}

// export async function postCategories(req, res) {

// }

