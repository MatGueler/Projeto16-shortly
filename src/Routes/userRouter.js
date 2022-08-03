
// Funções
import { CreateUser } from '../Controllers/userController.js';

// Auxiliares
import { Router } from 'express'

const server = Router()

server.get('/signup', CreateUser)
// server.post()

export default server;