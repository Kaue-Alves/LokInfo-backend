import 'dotenv/config'
import { fastify } from "fastify"
import { adicionarUsuario } from './controllers/usuarios.controllers.js'

const { PORT } = process.env
const app = fastify()

app.get("/", () => {
    // usuariosDB.create()
})

app.post("/usuario", async (request, reply) => {

    const usuario = request.body
    console.log(usuario);
    
    await adicionarUsuario(usuario)
})

app.listen({
    port: PORT || 3333
})