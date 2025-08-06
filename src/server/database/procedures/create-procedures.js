import { sql } from "../config/db.js";

export async function createProcedures() {
    await createProcedureAdicionarFornecedor();
    await createProcedureAtualizarFornecedor();
    await createProcedureRemoverFornecedor();

    await createProcedureAdicionarProduto();
    await createProcedureAtualizarProduto();
    await createProcedureRemoverProduto();

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
            BEGIN
                DELETE FROM fornecedores
                WHERE id = p_id;

                RAISE NOTICE 'Fornecedor com ID % removido com sucesso.', p_id;
            END;
            $$;
        `;
        console.log("🔧 Procedure 'remover_fornecedor' criada com sucesso!");
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
            BEGIN
                DELETE FROM produtos
                WHERE id = p_id;

                RAISE NOTICE 'Produto com ID % removido.', p_id;
            END;
            $$;
        `;
        console.log("🔧 Procedure 'remover_produto' criada com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao criar procedure remover_produto:", error);
    }
}

// ========== REGISTROS ==========
// deve ser um trigger
// async function createProcedureAdicionarRegistro() {
//     try {
//         await sql`
//             CREATE OR REPLACE PROCEDURE adicionar_registro(
//                 p_id_produtos INTEGER,
//                 p_id_fornecedores INTEGER,
//                 p_data_registro TIMESTAMP
//             )
//             LANGUAGE plpgsql
//             AS $$
//             BEGIN
//                 INSERT INTO registros (id_produtos, id_fornecedores, data_registro)
//                 VALUES (p_id_produtos, p_id_fornecedores, p_data_registro);

//                 RAISE NOTICE 'Registro adicionado com sucesso.';
//             END;
//             $$;
//         `;
//         console.log("🔧 Procedure 'adicionar_registro' criada com sucesso!");
//     } catch (error) {
//         console.error("❌ Erro ao criar procedure adicionar_registro:", error);
//     }
// }

// Executar a criação das procedures
createProcedures();
//teste