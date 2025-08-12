import { Registros } from "../database/registros/registros.js";
const registros = new Registros();

export async function listarRegistros() {
    try {
        const lista = await registros.getRegistros();
        return {
            success: true,
            data: lista || [],
            total: lista?.length || 0,
        };
    } catch (error) {
        console.error("❌ Erro no controller listarRegistros:", error.message);
        throw error;
    }
}

export async function resumoEstoque() {
    try {
        const resumo = await registros.getResumoEstoque();
        return {
            success: true,
            data: resumo || {},
        };
    } catch (error) {
        console.error("❌ Erro no controller resumoEstoque:", error.message);
        throw error;
    }
}
