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

    async saida(id, quantidade_saida) {
        try {
            await sql`CALL saida_produto(${id}, ${quantidade_saida})`;
            console.log(`✅ Saída de produto registrada: Produto ${id}, Quantidade ${quantidade_saida}`);
        } catch (error) {
            console.error("❌ Erro ao registrar saída de produto:", error);
            throw error;
        }
    }

}
