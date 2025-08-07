import 'dotenv/config'
import { fastify } from "fastify"
import { adicionarFornecedor } from './controllers/fornecedores.controllers.js'

const { PORT } = process.env
const app = fastify()

app.get("/usuario", () => {
    // usuariosDB.create()
})

app.post("/usuario", async (request, reply) => {

    const usuario = request.body
    console.log(usuario);
    
    await adicionarFornecedor(usuario)
})

app.listen({
    port: PORT || 3333
})