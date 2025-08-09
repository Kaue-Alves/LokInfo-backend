import { sql } from "../config/db.js";

export class Registros {
    
    async getRegistros() {
        try {
            const result = await sql`SELECT * FROM listar_registros()`;
            console.log("📝 Registros encontrados:", result.length);
            return result;
        } catch (error) {
            console.error("❌ Erro ao buscar registros:", error);
            throw error;
        }
    }

    async getResumoEstoque() {
        try {
            const result = await sql`SELECT * FROM resumo_estoque()`;
            console.log("💰 Resumo do estoque:", result[0]);
            return result[0];
        } catch (error) {
            console.error("❌ Erro ao buscar resumo do estoque:", error);
            throw error;
        }
    }

}
