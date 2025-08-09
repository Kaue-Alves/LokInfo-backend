import { Produtos } from "../database/produtos/produtos.js";
const produtos = new Produtos();

// ==================== FUNÇÕES AUXILIARES ====================

function prepararDadosProduto({
    nome,
    preco_unitario,
    quantidade_estoque,
    id_fornecedor,
}) {
    return {
        nome: nome?.toString().trim(),
        preco_unitario: Number(preco_unitario),
        quantidade_estoque: Number(quantidade_estoque),
        id_fornecedor: Number(id_fornecedor),
    };
}

function validarDadosProduto({
    nome,
    preco_unitario,
    quantidade_estoque,
    id_fornecedor,
}) {
    if (!nome || nome.length < 2) {
        throw new Error("Nome do produto deve ter pelo menos 2 caracteres");
    }
    if (isNaN(preco_unitario) || preco_unitario <= 0) {
        throw new Error("Preço unitário deve ser um número positivo");
    }
    if (isNaN(quantidade_estoque) || quantidade_estoque < 0) {
        throw new Error("Quantidade em estoque deve ser um número não negativo");
    }
    if (isNaN(id_fornecedor) || id_fornecedor <= 0) {
        throw new Error("ID do fornecedor deve ser um número válido");
    }
}

// ==================== CONTROLLERS PRINCIPAIS ====================

export async function listarProdutos() {
    try {
        const produtosList = await produtos.get();
        return {
            success: true,
            data: produtosList || [],
            total: produtosList?.length || 0,
        };
    } catch (error) {
        console.error("❌ Erro no controller listarProdutos:", error.message);
        throw error;
    }
}

export async function adicionarProduto(produto) {
    try {
        if (!produto || typeof produto !== "object") {
            throw new Error("Dados do produto não fornecidos ou inválidos");
        }
        const { nome, preco_unitario, quantidade_estoque, id_fornecedor } = produto;
        const camposObrigatorios = { nome, preco_unitario, quantidade_estoque, id_fornecedor };
        const camposFaltando = Object.entries(camposObrigatorios)
            .filter(([_, value]) => value === undefined || value === null || value === "")
            .map(([key]) => key);
        if (camposFaltando.length > 0) {
            throw new Error(`Campos obrigatórios faltando: ${camposFaltando.join(", ")}`);
        }
        const dadosPreparados = prepararDadosProduto({
            nome,
            preco_unitario,
            quantidade_estoque,
            id_fornecedor,
        });
        validarDadosProduto(dadosPreparados);
        await produtos.create(
            dadosPreparados.nome,
            dadosPreparados.preco_unitario,
            dadosPreparados.quantidade_estoque,
            dadosPreparados.id_fornecedor
        );
        return {
            success: true,
            message: "Produto adicionado com sucesso!",
            data: dadosPreparados,
        };
    } catch (error) {
        console.error("❌ Erro no controller adicionarProduto:", error.message);
        throw error;
    }
}

export async function atualizarProduto(id, produto) {
    try {
        if (!id || isNaN(parseInt(id))) {
            throw new Error("ID inválido fornecido");
        }
        if (!produto || typeof produto !== "object") {
            throw new Error("Dados do produto não fornecidos ou inválidos");
        }
        const { nome, preco_unitario, quantidade_estoque, id_fornecedor } = produto;
        const dadosPreparados = prepararDadosProduto({
            nome,
            preco_unitario,
            quantidade_estoque,
            id_fornecedor,
        });
        validarDadosProduto(dadosPreparados);
        await produtos.update(
            parseInt(id),
            dadosPreparados.nome,
            dadosPreparados.preco_unitario,
            dadosPreparados.quantidade_estoque,
            dadosPreparados.id_fornecedor
        );
        return {
            success: true,
            message: "Produto atualizado com sucesso!",
            data: { id: parseInt(id), ...dadosPreparados },
        };
    } catch (error) {
        console.error("❌ Erro no controller atualizarProduto:", error.message);
        throw error;
    }
}

export async function removerProduto(id) {
    try {
        if (!id || isNaN(parseInt(id))) {
            throw new Error("ID inválido fornecido");
        }
        await produtos.delete(parseInt(id));
        return {
            success: true,
            message: "Produto removido com sucesso!",
            data: { id: parseInt(id) },
        };
    } catch (error) {
        console.error("❌ Erro no controller removerProduto:", error.message);
        throw error;
    }
}

export async function saidaProduto(id, quantidade_saida) {
    try {
        if (!id || isNaN(parseInt(id))) {
            throw new Error("ID do produto inválido");
        }
        if (
            !quantidade_saida ||
            isNaN(Number(quantidade_saida)) ||
            Number(quantidade_saida) <= 0
        ) {
            throw new Error("Quantidade de saída deve ser um número positivo");
        }
        await produtos.saida(parseInt(id), Number(quantidade_saida));
        return {
            success: true,
            message: `Saída de ${quantidade_saida} unidade(s) do produto ${id} registrada com sucesso!`,
            data: {
                id: parseInt(id),
                quantidade_saida: Number(quantidade_saida),
            },
        };
    } catch (error) {
        console.error("❌ Erro no controller saidaProduto:", error.message);
        throw error;
    }
}