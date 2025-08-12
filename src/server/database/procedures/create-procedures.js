import { sql } from "../config/db.js";

export async function createProcedures() {
    await createProcedureAdicionarFornecedor();
    await createProcedureAtualizarFornecedor();
    await createProcedureRemoverFornecedor();

    await createProcedureAdicionarProduto();
    await createProcedureAtualizarProduto();
    await createProcedureRemoverProduto();
    await createProcedureSaidaProduto();

    console.log("✅ Todas as procedures foram criadas!");
}

// ========== FORNECEDORES ==========

async function createProcedureAdicionarFornecedor() {
    try {
        await sql`
            CREATE OR REPLACE PROCEDURE adicionar_fornecedor(
                p_nome TEXT,
                p_cnpj VARCHAR(14),
                p_telefone VARCHAR(15),
                p_email TEXT
            )
            LANGUAGE plpgsql
            AS $$
            BEGIN
                INSERT INTO fornecedores (nome, cnpj, telefone, email)
                VALUES (p_nome, p_cnpj, p_telefone, p_email);

                RAISE NOTICE 'Fornecedor % adicionado com sucesso.', p_nome;
            END;
            $$;
        `;
        console.log("🔧 Procedure 'adicionar_fornecedor' criada com sucesso!");
    } catch (error) {
        console.error(
            "❌ Erro ao criar procedure adicionar_fornecedor:",
            error
        );
    }
}

async function createProcedureAtualizarFornecedor() {
    try {
        await sql`
            CREATE OR REPLACE PROCEDURE atualizar_fornecedor(
                p_id INT,
                p_nome TEXT,
                p_cnpj VARCHAR(14),
                p_telefone VARCHAR(15),
                p_email TEXT
            )
            LANGUAGE plpgsql
            AS $$
            BEGIN
                UPDATE fornecedores
                SET nome = p_nome,
                    cnpj = p_cnpj,
                    telefone = p_telefone,
                    email = p_email
                WHERE id = p_id;

                RAISE NOTICE 'Fornecedor com ID % atualizado com sucesso.', p_id;
            END;
            $$;
        `;
        console.log("🔧 Procedure 'atualizar_fornecedor' criada com sucesso!");
    } catch (error) {
        console.error(
            "❌ Erro ao criar procedure atualizar_fornecedor:",
            error
        );
    }
}

async function createProcedureRemoverFornecedor() {
    try {
        await sql`
            CREATE OR REPLACE PROCEDURE remover_fornecedor(p_id INT)
            LANGUAGE plpgsql
            AS $$
            DECLARE
                v_total_produtos INTEGER;
                v_total_registros INTEGER;
            BEGIN
                -- Contar produtos e registros relacionados ao fornecedor
                SELECT COUNT(*) INTO v_total_produtos FROM produtos WHERE id_fornecedor = p_id;
                SELECT COUNT(*) INTO v_total_registros FROM registros WHERE id_fornecedores = p_id;

                RAISE NOTICE 'Iniciando remoção do fornecedor ID %. Produtos: %, Registros: %', 
                            p_id, v_total_produtos, v_total_registros;

                -- 1. Primeiro, remover todos os registros relacionados aos produtos deste fornecedor
                DELETE FROM registros 
                WHERE id_fornecedores = p_id;

                RAISE NOTICE 'Removidos % registros do fornecedor ID %', v_total_registros, p_id;

                -- 2. Depois, remover todos os produtos deste fornecedor
                DELETE FROM produtos 
                WHERE id_fornecedor = p_id;

                RAISE NOTICE 'Removidos % produtos do fornecedor ID %', v_total_produtos, p_id;

                -- 3. Finalmente, remover o fornecedor
                DELETE FROM fornecedores
                WHERE id = p_id;

                RAISE NOTICE 'Fornecedor com ID % removido com sucesso (em cascata).', p_id;
            END;
            $$;
        `;
        console.log(
            "🔧 Procedure 'remover_fornecedor' criada com remoção em cascata!"
        );
    } catch (error) {
        console.error("❌ Erro ao criar procedure remover_fornecedor:", error);
    }
}

// ========== PRODUTOS ==========

async function createProcedureAdicionarProduto() {
    try {
        await sql`
            CREATE OR REPLACE PROCEDURE adicionar_produto(
                p_nome TEXT,
                p_preco_unitario DECIMAL,
                p_quantidade_estoque INTEGER,
                p_id_fornecedor INTEGER
            )
            LANGUAGE plpgsql
            AS $$
            DECLARE
                v_id_produto INTEGER;
            BEGIN
                -- Verifica se já existe um produto com o mesmo nome e mesmo fornecedor
                SELECT id INTO v_id_produto 
                FROM produtos 
                WHERE nome = p_nome AND id_fornecedor = p_id_fornecedor;

                IF v_id_produto IS NULL THEN
                    -- Produto novo (nome + fornecedor): faz INSERT
                    INSERT INTO produtos (nome, preco_unitario, quantidade_estoque, id_fornecedor)
                    VALUES (p_nome, p_preco_unitario, p_quantidade_estoque, p_id_fornecedor);

                    RAISE NOTICE 'Produto % inserido com sucesso para o fornecedor %.', p_nome, p_id_fornecedor;
                ELSE
                    -- Produto já existe: apenas atualiza quantidade
                    UPDATE produtos
                    SET quantidade_estoque = quantidade_estoque + p_quantidade_estoque
                    WHERE id = v_id_produto;

                    RAISE NOTICE 'Produto % do fornecedor % já existe. Quantidade atualizada.', p_nome, p_id_fornecedor;
                END IF;
            END;
            $$;
        `;
        console.log(
            "🔧 Procedure 'adicionar_produto' criada com lógica de verificação por nome e fornecedor!"
        );
    } catch (error) {
        console.error("❌ Erro ao criar procedure adicionar_produto:", error);
    }
}

async function createProcedureAtualizarProduto() {
    try {
        await sql`
            CREATE OR REPLACE PROCEDURE atualizar_produto(
                p_id INTEGER,
                p_nome TEXT,
                p_preco_unitario DECIMAL,
                p_quantidade_estoque INTEGER,
                p_id_fornecedor INTEGER
            )
            LANGUAGE plpgsql
            AS $$
            BEGIN
                UPDATE produtos
                SET nome = p_nome,
                    preco_unitario = p_preco_unitario,
                    quantidade_estoque = p_quantidade_estoque,
                    id_fornecedor = p_id_fornecedor
                WHERE id = p_id;

                RAISE NOTICE 'Produto com ID % atualizado.', p_id;
            END;
            $$;
        `;
        console.log("🔧 Procedure 'atualizar_produto' criada com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao criar procedure atualizar_produto:", error);
    }
}

async function createProcedureRemoverProduto() {
    try {
        await sql`
            CREATE OR REPLACE PROCEDURE remover_produto(p_id INTEGER)
            LANGUAGE plpgsql
            AS $$
            DECLARE
                v_total_registros INTEGER;
            BEGIN
                -- Remover registros relacionados ao produto
                SELECT COUNT(*) INTO v_total_registros FROM registros WHERE id_produtos = p_id;
                IF v_total_registros > 0 THEN
                    DELETE FROM registros WHERE id_produtos = p_id;
                    RAISE NOTICE 'Removidos % registros relacionados ao produto %.', v_total_registros, p_id;
                END IF;

                -- Remover o produto
                DELETE FROM produtos WHERE id = p_id;
                RAISE NOTICE 'Produto com ID % removido.', p_id;
            END;
            $$;
        `;
        console.log(
            "🔧 Procedure 'remover_produto' criada com remoção em cascata!"
        );
    } catch (error) {
        console.error("❌ Erro ao criar procedure remover_produto:", error);
    }
}

async function createProcedureSaidaProduto() {
    try {
        await sql`
            CREATE OR REPLACE PROCEDURE saida_produto(
                p_id_produto INTEGER,
                p_quantidade_saida INTEGER
            )
            LANGUAGE plpgsql
            AS $$
            DECLARE
                v_quantidade_atual INTEGER;
                v_nome_produto TEXT;
                v_id_fornecedor INTEGER;
            BEGIN
                -- Buscar informações do produto
                SELECT quantidade_estoque, nome, id_fornecedor
                INTO v_quantidade_atual, v_nome_produto, v_id_fornecedor
                FROM produtos
                WHERE id = p_id_produto;

                -- Verificar se o produto existe
                IF v_quantidade_atual IS NULL THEN
                    RAISE EXCEPTION 'Produto com ID % não encontrado.', p_id_produto;
                END IF;

                -- Verificar se há quantidade suficiente em estoque
                IF v_quantidade_atual < p_quantidade_saida THEN
                    RAISE EXCEPTION 'Quantidade insuficiente em estoque. Disponível: %, Solicitado: %', 
                                    v_quantidade_atual, p_quantidade_saida;
                END IF;

                -- Verificar se a quantidade de saída é válida
                IF p_quantidade_saida <= 0 THEN
                    RAISE EXCEPTION 'A quantidade de saída deve ser maior que zero.';
                END IF;

                -- Atualizar o estoque do produto
                UPDATE produtos
                SET quantidade_estoque = quantidade_estoque - p_quantidade_saida
                WHERE id = p_id_produto;

                RAISE NOTICE 'Saída registrada: Produto % (ID: %) - Quantidade retirada: % - Estoque restante: %', 
                            v_nome_produto, p_id_produto, p_quantidade_saida, (v_quantidade_atual - p_quantidade_saida);
            END;
            $$;
        `;
        console.log("🔧 Procedure 'saida_produto' criada com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao criar procedure saida_produto:", error);
    }
}

// Executar a criação das procedures
createProcedures();
