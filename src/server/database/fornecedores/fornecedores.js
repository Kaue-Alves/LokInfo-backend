import { sql } from "../config/db.js";

export class Fornecedores {
    async create(nome, cnpj, telefone, email) {
        try {
            await sql`CALL adicionar_fornecedor(${nome}, ${cnpj}, ${telefone}, ${email})`;
            console.log("✅ Fornecedor adicionado com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao adicionar fornecedor:", error);
        }
    }

    async get() {
        try {
            const result = await sql`SELECT * FROM listar_fornecedores()`;
            console.log("📋 Fornecedores encontrados:", result.length);
            return result;
        } catch (error) {
            console.error("❌ Erro ao buscar fornecedores:", error);
        }
    }

    async update(id, nome, cnpj, telefone, email) {
        try {
            await sql`CALL atualizar_fornecedor(${id}, ${nome}, ${cnpj}, ${telefone}, ${email})`;
            console.log("✅ Fornecedor atualizado com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao atualizar fornecedor:", error);
        }
    }

    async delete(id) {
        try {
            await sql`CALL remover_fornecedor(${id})`;
            console.log("✅ Fornecedor removido com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao remover fornecedor:", error);
        }
    }
}
