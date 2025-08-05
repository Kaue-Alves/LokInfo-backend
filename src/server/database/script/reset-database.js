import { sql } from "../config/db.js";

export async function resetDatabase() {
    console.log("🔄 Resetando banco de dados...");

    await deleteTableRegistros();
    await deleteTableJogos();
    await deleteTableUsuarios();

    console.log("✅ Reset completo!");
}

async function deleteTableRegistros() {
    try {
        await sql`DROP TABLE IF EXISTS registros CASCADE;`;
        console.log("📋 Tabela de registros deletada.");
    } catch (error) {
        console.error("❌ Erro ao deletar tabela registros:", error);
    }
}

async function deleteTableUsuarios() {
    try {
        await sql`DROP TABLE IF EXISTS usuarios CASCADE;`;
        console.log("👤 Tabela de usuarios deletada.");
    } catch (error) {
        console.error("❌ Erro ao deletar tabela usuarios:", error);
    }
}

async function deleteTableJogos() {
    try {
        await sql`DROP TABLE IF EXISTS jogos CASCADE;`;
        console.log("🎮 Tabela de jogos deletada.");
    } catch (error) {
        console.error("❌ Erro ao deletar tabela jogos:", error);
    }
}
