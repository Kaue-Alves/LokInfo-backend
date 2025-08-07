import 'dotenv/config'
import { fastify } from "fastify"
import { adicionarFornecedor, atualizarFornecedor, listarFornecedores, removerFornecedor } from './controllers/fornecedores.controllers.js'
import { listarProdutos } from './controllers/produtos.controllers.js'

const { PORT } = process.env
const app = fastify()

app.get("/fornecedores", async () => {
    
    const result = await listarFornecedores()
    
    return result.data
})

app.post("/fornecedores/adicionar", async (request, reply) => {

    // {
    //     "nome": "kaue",
    //     "cnpj": "12345678901234",
    //     "telefone": "1234567890",
    //     "email": "
    // }

    const fornecedor = request.body
    
    await adicionarFornecedor(fornecedor)
    return reply.status(201).send({message: "Fornecedor adicionado com sucesso!"})
})

app.put("/fornecedores/atualizar/:id", async (request, reply) => { 
    const { id } = request.params
    
    const fornecedor = request.body

    await atualizarFornecedor(id, fornecedor)

    return reply.status(200).send({ message: `Fornecedor com ID ${id} atualizado com sucesso!` })
})

app.delete("/fornecedores/remover/:id", async (request, reply) => {
    const { id } = request.params

    await removerFornecedor(id)

    return reply.status(200).send({
        message: `Fornecedor com ID ${id} removido com sucesso!`
    })
})

app.get("/produtos", async () => {
    const result = await listarProdutos()
    
    return result.data
})

app.listen({
    port: PORT || 3333
})