
// Arquivos
import userRouter from './Routes/userRouter.js'
import urlRouter from './Routes/urlRouter.js'

// Npm 
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config();

const server = express();
server.use(express.json());
server.use(cors());

server.use(userRouter)

server.use(urlRouter)

server.use(rankingRoter)

server.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});