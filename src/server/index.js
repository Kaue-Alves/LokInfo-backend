import 'dotenv/config'
import { fastify } from "fastify"
import { Usuarios } from './database/usuarios/usuarios.js'

const { PORT } = process.env
const app = fastify()

const usuariosDB = new Usuarios 

app.get("/", () => {
    usuariosDB.create()
})

app.listen({
    port: PORT || 3333
})