
// Funções
import { EncodeUrl, ShowUrl, OpenUrl, userUrls } from '../Controllers/urlController.js';
import validateUser from '../Middlewares/validateUser.js'

// Auxiliares
import { Router } from 'express'

const server = Router()

server.post('/urls/shorten', validateUser, EncodeUrl)
server.get('/urls/:id', ShowUrl)
server.get('/urls/open/:shortUrl', OpenUrl)
server.get('/users/me', validateUser, userUrls)

export default server;