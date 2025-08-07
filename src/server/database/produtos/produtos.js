import { sql } from "../config/db.js";

export class Produtos {
    async create(nome, precoUnitario, quantidadeEstoque, idFornecedor) {
        try {
            await sql`CALL adicionar_produto(${nome}, ${precoUnitario}, ${quantidadeEstoque}, ${idFornecedor})`;
            console.log("✅ Produto adicionado com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao adicionar produto:", error);
            throw error;
        }
    }

    async get() {
        try {
            const result = await sql`SELECT * FROM listar_produtos()`;
            console.log("📦 Produtos encontrados:", result.length);
            return result;
        } catch (error) {
            console.error("❌ Erro ao buscar produtos:", error);
            throw error;
        }
    }

    async update(id, nome, precoUnitario, quantidadeEstoque, idFornecedor) {
        try {
            await sql`CALL atualizar_produto(${id}, ${nome}, ${precoUnitario}, ${quantidadeEstoque}, ${idFornecedor})`;
            console.log("✅ Produto atualizado com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao atualizar produto:", error);
            throw error;
        }
    }

    async delete(id) {
        try {
            await sql`CALL remover_produto(${id})`;
            console.log("✅ Produto removido com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao remover produto:", error);
            throw error;
        }
    }

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
