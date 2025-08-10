import "dotenv/config";
import { fastify } from "fastify";
import cors from '@fastify/cors';
import {
    listarRegistros,
    resumoEstoque,
} from "./controllers/registros.controller.js";
import {
    adicionarFornecedor,
    atualizarFornecedor,
    listarFornecedores,
    removerFornecedor,
} from "./controllers/fornecedores.controllers.js";
import {
    listarProdutos,
    adicionarProduto,
    atualizarProduto,
    removerProduto,
    saidaProduto,
} from "./controllers/produtos.controllers.js";

// const { PORT } = process.env;
const app = fastify();
await app.register(cors, {
    origin: true 
});

// ==================== ROTAS REGISTROS ====================
app.get("/registros", async () => {
    const result = await listarRegistros();
    return result.data;
});

app.get("/registros/resumo", async () => {
    const result = await resumoEstoque();
    return result.data;
});

// ==================== ROTAS FORNECEDORES ====================
app.get("/fornecedores", async () => {
    const result = await listarFornecedores();
    return result.data;
});

app.post("/fornecedores/adicionar", async (request, reply) => {
    const fornecedor = request.body;
    await adicionarFornecedor(fornecedor);
    return reply.status(201).send({ message: "Fornecedor adicionado com sucesso!" });
});

app.put("/fornecedores/atualizar/:id", async (request, reply) => {
    const { id } = request.params;
    const fornecedor = request.body;
    await atualizarFornecedor(id, fornecedor);
    return reply.status(200).send({ message: `Fornecedor com ID ${id} atualizado com sucesso!` });
});

app.delete("/fornecedores/remover/:id", async (request, reply) => {
    const { id } = request.params;
    await removerFornecedor(id);
    return reply.status(200).send({ message: `Fornecedor com ID ${id} removido com sucesso!` });
});

// ==================== ROTAS PRODUTOS ====================
app.get("/produtos", async () => {
    const result = await listarProdutos();
    return result.data;
});

app.post("/produtos/adicionar", async (request, reply) => {
    const produto = request.body;
    await adicionarProduto(produto);
    return reply.status(201).send({ message: "Produto adicionado com sucesso!" });
});

app.put("/produtos/atualizar/:id", async (request, reply) => {
    const { id } = request.params;
    const produto = request.body;
    await atualizarProduto(id, produto);
    return reply.status(200).send({ message: `Produto com ID ${id} atualizado com sucesso!` });
});

app.delete("/produtos/remover/:id", async (request, reply) => {
    const { id } = request.params;
    await removerProduto(id);
    return reply.status(200).send({ message: `Produto com ID ${id} removido com sucesso!` });
});

app.post("/produtos/saida/:id", async (request, reply) => {
    const { id } = request.params;
    const { quantidade_saida } = request.body;
    await saidaProduto(id, quantidade_saida);
    return reply.status(200).send({
        message: `Saída de ${quantidade_saida} unidade(s) do produto ${id} registrada com sucesso!`,
    });
});

// ==================== INICIAR SERVIDOR ====================
app.listen({
    port: process.env.PORT ?? 3334,
    host: '0.0.0.0'
}).then(() => {
    console.log(`Servidor rodando na porta ${process.env.PORT ?? 3334}`);
});