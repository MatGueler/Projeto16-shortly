
// Funções
import { EncodeUrl } from '../Controllers/urlController.js';

// Auxiliares
import { Router } from 'express'

const server = Router()

server.post('/urls/shorten', EncodeUrl)

export default server;