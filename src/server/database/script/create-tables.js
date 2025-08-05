import { sql } from "../config/db.js";
import { resetDatabase } from "./reset-database.js";

createTables();

export async function createTables() {
    await resetDatabase();
    
    await createTableUsuarios();
    await createTableJogos();
}

async function createTableUsuarios() {
    try {
        await sql`
            CREATE TABLE usuarios (
                id SERIAL PRIMARY KEY,
                nome TEXT NOT NULL,
                email TEXT NOT NULL,
                cpf TEXT NOT NULL,
                dataNasc DATE NOT NULL
            );`;
        console.log("Tabela de usuarios criada.");
    } catch (error) {
        console.error("Erro ao criar tabela usuarios:", error);
    }
}

async function createTableJogos() {
    try {
        await sql`
            CREATE TABLE jogos (
                id SERIAL PRIMARY KEY,
                titulo TEXT NOT NULL UNIQUE,
                categoria TEXT NOT NULL,
                classificacao INTEGER NOT NULL
            );`;
        console.log("Tabela de jogos criada.");
    } catch (error) {
        console.error("Erro ao criar tabela jogos:", error);
    }
}
