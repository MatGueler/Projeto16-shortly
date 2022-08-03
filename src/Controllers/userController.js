import connection from '../dbStrategy/postgres.js'
import joi from 'joi'

export async function CreateUser(req, res) {

    const { rows: users } = await connection.query('SELECT * FROM users')

    try {
        const { name, email, password, confirmPassword } = req.body

        const difPassword = password !== confirmPassword

        const userSchema = joi.object({
            name: joi.string().required(),
            email: joi.string().email().required(),
            password: joi.string().min(8).required(),
            confirmPassword: joi.string().min(8).required(),
        });

        const validation = userSchema.validate({ name, email, password, confirmPassword }, { abortEarly: true });

        if (validation.error || difPassword) {
            let err;
            if (difPassword) {
                err = "The passwords must be the same"
            }
            else {
                err = validation.error.details[0].message
            }
            return res.status(422).send(err)
        }

        return res.send(201)
    }
    catch {
        return res.send(500)
    }
}

// export async function postCategories(req, res) {

// }

