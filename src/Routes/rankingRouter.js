
// Funções
import { rankingUsers } from '../Controllers/rankingController.js';

// Auxiliares
import { Router } from 'express'

const server = Router()

server.get('/ranking', rankingUsers)

export default server;