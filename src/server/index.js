import 'dotenv/config'
import { fastify } from "fastify"
import { adicionarFornecedor } from './controllers/fornecedores.controllers.js'

const { PORT } = process.env
const app = fastify()

app.get("/fornecedor", () => {
    // usuariosDB.create()
})

app.post("/fornecedor/adicionar", async (request, reply) => {

    const fornecedor = request.body
    
    await adicionarFornecedor(fornecedor)
    return reply.status(201).send({message: "Fornecedor adicionado com sucesso!"})
})

app.listen({
    port: PORT || 3333
})