import { sql } from "../config/db.js";

export async function resetDatabase() {
    await deleteTableUsuarios()
    await deleteTableJogos()
}

async function deleteTableUsuarios() {
    try {
        await sql`DROP TABLE IF EXISTS usuarios;`;
        console.log("Tabela de usuarios deletada.");
    } catch (error) {
        console.error("Erro ao deletar tabela:", error);
    }
}

async function deleteTableJogos() {
    try {
        await sql`DROP TABLE IF EXISTS jogos;`;
        console.log("Tabela de jogos deletada.");
    } catch (error) {
        console.error("Erro ao deletar tabela jogos:", error);
    }
}