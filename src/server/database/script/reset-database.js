import { sql } from "../config/db.js";

export async function resetDatabase() {
    console.log("🔄 Resetando banco de dados...");

    await deleteTableRegistros();
    await deleteTableFornecedores();
    await deleteTableProdutos();

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

async function deleteTableProdutos() {
    try {
        await sql`DROP TABLE IF EXISTS produtos CASCADE;`;
        console.log("👤 Tabela de produtos deletada.");
    } catch (error) {
        console.error("❌ Erro ao deletar tabela produtos:", error);
    }
}

async function deleteTableFornecedores() {
    try {
        await sql`DROP TABLE IF EXISTS fornecedores CASCADE;`;
        console.log("🎮 Tabela de fornecedores deletada.");
    } catch (error) {
        console.error("❌ Erro ao deletar tabela fornecedores:", error);
    }
}
