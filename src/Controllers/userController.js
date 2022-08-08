import connection from '../dbStrategy/postgres.js'
import joi from 'joi'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export async function CreateUser(req, res) {

    try {
        const { name, email, password, confirmPassword } = req.body

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

        const crypPassword = bcrypt.hashSync(password, 10)

        await connection.query(`INSERT INTO users (name, email, password) 
        VALUES ($1,$2,$3)`
            , [name, email, crypPassword]);

        return res.send(201)
    }
    catch {
        return res.send(500)
    }
}

export async function loginUser(req, res) {

    try {
        const { email, password } = req.body

        const { rows: users } = await connection.query
            (`SELECT * FROM users
         WHERE email=$1`
                , [email])

        const noExist = users.length === 0;

        const userSchema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().min(8).required(),
        });

        const validation = userSchema.validate({ email, password }, { abortEarly: true });

        const verifyPassword = bcrypt.compareSync(password, users.password);

        if (validation.error || noExist || !verifyPassword) {
            let err;
            if (noExist) {
                err = "This account doesn't exist"
                return res.status(401).send(err)
            }
            if (validation.error) {
                err = validation.error.details[0].message
                return res.status(422).send(err)
            }
            if (!verifyPassword) {
                err = 'incorrect data'
                return res.status(401).send(err)
            }
        }

        const dados = { id: users[0].id };
        const chaveSecreta = process.env.JWT_SECRET;
        const token = jwt.sign(dados, chaveSecreta);

        return res.status(200).send(token)
    }
    catch {
        return res.send(500)
    }

}

