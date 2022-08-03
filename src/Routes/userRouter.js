
// Funções
import { CreateUser } from '../Controllers/userController.js';

// Auxiliares
import { Router } from 'express'

const server = Router()

server.post('/signup', CreateUser)
// server.post()

export default server;