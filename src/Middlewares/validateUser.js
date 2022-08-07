import jwt from 'jsonwebtoken'

async function validateUser(req, res, next) {

    try {
        const { authorization } = req.headers

        console.log(req.headers)

        const token = authorization?.replace('Bearer ', '')

        const chaveSecreta = process.env.JWT_SECRET;

        const dados = jwt.verify(token, chaveSecreta);

        res.locals.dados = dados
    }
    catch {
        return res.send(401)
    }
    next();

}

export default validateUser;