
// Funções
import { EncodeUrl } from '../Controllers/urlController.js';
import validateUser from '../Middlewares/validateUser.js'

// Auxiliares
import { Router } from 'express'

const server = Router()

server.post('/urls/shorten', validateUser, EncodeUrl)

export default server;