import { Fornecedores } from "../database/fornecedores/fornecedores.js";

const fornecedores = new Fornecedores();

export async function adicionarFornecedor(usuario) {
    try {
        // ✅ Validação inicial
        if (!usuario || typeof usuario !== "object") {
            throw new Error("Dados do usuário não fornecidos ou inválidos");
        }

        // ✅ Desestruturação com validação
        const { nome, cnpj, telefone, email } = usuario;

        // ✅ Validar campos obrigatórios
        const camposObrigatorios = { nome, cnpj, telefone, email };
        const camposFaltando = Object.entries(camposObrigatorios)
            .filter(([key, value]) => !value || value.trim() === "")
            .map(([key]) => key);

        if (camposFaltando.length > 0) {
            throw new Error(
                `Campos obrigatórios faltando: ${camposFaltando.join(", ")}`
            );
        }

        // ✅ Preparar e validar dados
        const dadosPreparados = prepararDados({ nome, cnpj, telefone, email });

        // ✅ Validar dados preparados
        validarDados(dadosPreparados);

        // ✅ Chamar método de criação
        await fornecedores.create(
            dadosPreparados.nome,
            dadosPreparados.cnpj,
            dadosPreparados.telefone,
            dadosPreparados.email
        );

        return {
            success: true,
            message: "Fornecedor adicionado com sucesso!",
            data: dadosPreparados,
        };
    } catch (error) {
        console.error("❌ Erro no controller adicionarUsuario:", error.message);
        throw error;
    }
}

// export async function buscarUsuarios() {
//     try {
//         const usuarios = await Fornecedores.get();
//         return {
//             success: true,
//             data: usuarios || [],
//             total: usuarios?.length || 0,
//         };
//     } catch (error) {
//         console.error("❌ Erro no controller buscarUsuarios:", error.message);
//         throw error;
//     }
// }

// export async function atualizarUsuario(id, usuario) {
//     try {
//         // ✅ Validar ID
//         if (!id || isNaN(parseInt(id))) {
//             throw new Error("ID inválido fornecido");
//         }

//         // ✅ Validar dados do usuário
//         if (!usuario || typeof usuario !== "object") {
//             throw new Error("Dados do usuário não fornecidos ou inválidos");
//         }

//         const { nome, cnpj, telefone, email } = usuario;
//         const dadosPreparados = prepararDados({ nome, cnpj, telefone, email });
//         validarDados(dadosPreparados);

//         // ✅ Chamar método de atualização
//         await Fornecedores.update(
//             parseInt(id),
//             dadosPreparados.nome,
//             dadosPreparados.cnpj,
//             dadosPreparados.telefone,
//             dadosPreparados.email
//         );

//         return {
//             success: true,
//             message: "Fornecedor atualizado com sucesso!",
//             data: { id: parseInt(id), ...dadosPreparados },
//         };
//     } catch (error) {
//         console.error("❌ Erro no controller atualizarUsuario:", error.message);
//         throw error;
//     }
// }

// export async function removerUsuario(id) {
//     try {
//         // ✅ Validar ID
//         if (!id || isNaN(parseInt(id))) {
//             throw new Error("ID inválido fornecido");
//         }

//         // ✅ Chamar método de remoção
//         await Fornecedores.delete(parseInt(id));

//         return {
//             success: true,
//             message: "Fornecedor removido com sucesso!",
//             data: { id: parseInt(id) },
//         };
//     } catch (error) {
//         console.error("❌ Erro no controller removerUsuario:", error.message);
//         throw error;
//     }
// }

// ========== FUNÇÕES AUXILIARES ==========

function prepararDados({ nome, cnpj, telefone, email }) {
    return {
        nome: nome?.toString().trim(),
        cnpj: cnpj?.toString().replace(/\D/g, ""), // Remove caracteres não numéricos
        telefone: telefone?.toString().replace(/\D/g, ""), // Remove caracteres não numéricos
        email: email?.toString().trim().toLowerCase(),
    };
}

function validarDados({ nome, cnpj, telefone, email }) {
    // ✅ Validar nome
    if (!nome || nome.length < 2) {
        throw new Error("Nome deve ter pelo menos 2 caracteres");
    }

    // ✅ Validar CNPJ
    if (!cnpj || cnpj.length !== 14) {
        throw new Error("CNPJ deve ter exatamente 14 dígitos");
    }

    // ✅ Validar telefone
    if (!telefone || telefone.length < 10 || telefone.length > 15) {
        throw new Error("Telefone deve ter entre 10 e 15 dígitos");
    }

    // ✅ Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        throw new Error("Email deve ter um formato válido");
    }
}
