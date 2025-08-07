import 'dotenv/config'
import { fastify } from "fastify"
import { adicionarFornecedor } from './controllers/fornecedores.controllers.js'

const { PORT } = process.env
const app = fastify()

app.get("/fornecedor", () => {
    // usuariosDB.create()
})

app.post("/fornecedor/adicionar", async (request, reply) => {

    const usuario = request.body
    console.log(usuario);
    
    await adicionarFornecedor(usuario)
})

app.listen({
    port: PORT || 3333
})