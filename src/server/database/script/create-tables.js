import { sql } from "../config/db.js";
import { resetDatabase } from "./reset-database.js";

export async function createTables() {
    await resetDatabase();

    await createTableFornecedores();
    await createTableProdutos();
    await createTableRegistros();
}

async function createTableProdutos() {
    try {
        await sql`
            CREATE TABLE produtos (
                id SERIAL PRIMARY KEY,
                nome TEXT NOT NULL UNIQUE,
                preco_unitario DECIMAL(10, 2) NOT NULL,
                quantidade_estoque INTEGER NOT NULL,
                id_fornecedor INTEGER NOT NULL REFERENCES fornecedores(id)
            );`;
        console.log("📦 Tabela de produtos criada.");
    } catch (error) {
        console.error("❌ Erro ao criar tabela produtos:", error);
    }
}

async function createTableFornecedores() {
    try {
        await sql`
            CREATE TABLE fornecedores (
                id SERIAL PRIMARY KEY,
                nome TEXT NOT NULL,
                cnpj VARCHAR(14) NOT NULL UNIQUE,
                telefone VARCHAR(15) NOT NULL,
                email TEXT NOT NULL
            );`;
        console.log("🏭 Tabela de fornecedores criada.");
    } catch (error) {
        console.error("❌ Erro ao criar tabela fornecedores:", error);
    }
}

async function createTableRegistros() {
    try {
        await sql`
            CREATE TABLE registros (
                id SERIAL PRIMARY KEY,
                id_produtos INTEGER NOT NULL REFERENCES produtos(id),
                id_fornecedores INTEGER NOT NULL REFERENCES fornecedores(id),
                data_registro TIMESTAMP NOT NULL
            );`;
        console.log("📋 Tabela de registros criada.");
    } catch (error) {
        console.error("❌ Erro ao criar tabela registros:", error);
    }
}

createTables();