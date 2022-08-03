import connection from '../dbStrategy/postgres.js'
import joi from 'joi'

export async function CreateUser(req, res) {


    try {
        const { name, email, password, confirmPassword } = req.body

        const userSchema = joi.object({
            name: joi.string().required(),
            email: joi.string().required(),
            password: joi.string().min(8).required(),
            confirmPassword: joi.string().required(),
        });

        return res.send(200)
    }
    catch {
        return res.send(500)
    }
}

// export async function postCategories(req, res) {

// }

