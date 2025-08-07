import { sql } from "../config/db.js";

export async function createFunctions() {
    await createFunctionListarFornecedores();
    await createFunctionListarProdutos();
    await createFunctionListarRegistros();
    await createFunctionResumoEstoque();

    console.log("✅ Todas as functions foram criadas!");
}

// ========== FUNCTIONS DE LISTAGEM ==========

async function createFunctionListarFornecedores() {
    try {
        await sql`
            CREATE OR REPLACE FUNCTION listar_fornecedores()
            RETURNS TABLE(
                id INTEGER,
                nome TEXT,
                cnpj VARCHAR(14),
                telefone VARCHAR(15),
                email TEXT,
                total_produtos BIGINT,
                valor_total_estoque NUMERIC(12,2)
            )
            LANGUAGE plpgsql
            AS $$
            BEGIN
                RETURN QUERY
                SELECT 
                    f.id,
                    f.nome,
                    f.cnpj,
                    f.telefone,
                    f.email,
                    COUNT(p.id) as total_produtos,
                    COALESCE(SUM(p.preco_unitario * p.quantidade_estoque), 0) as valor_total_estoque
                FROM fornecedores f
                LEFT JOIN produtos p ON f.id = p.id_fornecedor
                GROUP BY f.id, f.nome, f.cnpj, f.telefone, f.email
                ORDER BY f.nome;
            END;
            $$;
        `;
        console.log("📋 Function 'listar_fornecedores' criada com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao criar function listar_fornecedores:", error);
    }
}

async function createFunctionListarProdutos() {
    try {
        await sql`
            CREATE OR REPLACE FUNCTION listar_produtos()
            RETURNS TABLE(
                id INTEGER,
                nome TEXT,
                preco_unitario NUMERIC(10,2),
                quantidade_estoque INTEGER,
                valor_total_produto NUMERIC(12,2),
                fornecedor_nome TEXT,
                fornecedor_cnpj VARCHAR(14)
            )
            LANGUAGE plpgsql
            AS $$
            BEGIN
                RETURN QUERY
                SELECT 
                    p.id,
                    p.nome,
                    p.preco_unitario,
                    p.quantidade_estoque,
                    (p.preco_unitario * p.quantidade_estoque) as valor_total_produto,
                    f.nome as fornecedor_nome,
                    f.cnpj as fornecedor_cnpj
                FROM produtos p
                INNER JOIN fornecedores f ON p.id_fornecedor = f.id
                ORDER BY p.nome;
            END;
            $$;
        `;
        console.log("📦 Function 'listar_produtos' criada com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao criar function listar_produtos:", error);
    }
}

async function createFunctionListarRegistros() {
    try {
        await sql`
            CREATE OR REPLACE FUNCTION listar_registros()
            RETURNS TABLE(
                id INTEGER,
                data_registro TIMESTAMP,
                produto_nome TEXT,
                fornecedor_nome TEXT,
                fornecedor_cnpj VARCHAR(14),
                quantidade INTEGER
            )
            LANGUAGE plpgsql
            AS $$
            BEGIN
                RETURN QUERY
                SELECT 
                    r.id,
                    r.data_registro,
                    p.nome as produto_nome,
                    f.nome as fornecedor_nome,
                    f.cnpj as fornecedor_cnpj,
                    r.quantidade
                FROM registros r
                INNER JOIN produtos p ON r.id_produtos = p.id
                INNER JOIN fornecedores f ON r.id_fornecedores = f.id
                ORDER BY r.data_registro DESC;
            END;
            $$;
        `;
        console.log("📝 Function 'listar_registros' criada com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao criar function listar_registros:", error);
    }
}

async function createFunctionResumoEstoque() {
    try {
        await sql`
            CREATE OR REPLACE FUNCTION resumo_estoque()
            RETURNS TABLE(
                valor_total_estoque NUMERIC(15,2),
                quantidade_total_produtos BIGINT,
                total_produtos_cadastrados BIGINT
            )
            LANGUAGE plpgsql
            AS $$
            BEGIN
                RETURN QUERY
                SELECT 
                    COALESCE(SUM(p.preco_unitario * p.quantidade_estoque), 0)::NUMERIC(15,2) as valor_total_estoque,
                    COALESCE(SUM(p.quantidade_estoque), 0)::BIGINT as quantidade_total_produtos,
                    COUNT(p.id)::BIGINT as total_produtos_cadastrados
                FROM produtos p;
            END;
            $$;
        `;
        console.log("💰 Function 'resumo_estoque' criada com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao criar function resumo_estoque:", error);
    }
}

// ========== EXECUTAR FUNCTIONS ==========
createFunctions();
