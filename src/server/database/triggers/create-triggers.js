import { sql } from "../config/db.js";

export async function createTriggers() {
    await createTriggerRegistrarAdicaoProduto();
    await createTriggerRegistrarAtualizacaoProduto();

    console.log("✅ Todas as triggers foram criadas!");
}

// ========== TRIGGER PARA REGISTRO DE ADIÇÃO DE PRODUTOS ==========

async function createTriggerRegistrarAdicaoProduto() {
    try {
        // Primeiro criar a função que será executada pelo trigger de INSERT
        await sql`
            CREATE OR REPLACE FUNCTION fn_registrar_adicao_produto()
            RETURNS TRIGGER
            LANGUAGE plpgsql
            AS $$
            BEGIN
                -- Inserir registro quando um produto for adicionado (INSERT)
                INSERT INTO registros (
                    id_produtos, 
                    id_fornecedores, 
                    data_registro, 
                    quantidade,
                    tipo_movimentacao
                )
                VALUES (
                    NEW.id,
                    NEW.id_fornecedor,
                    CURRENT_TIMESTAMP,
                    NEW.quantidade_estoque,
                    'ENTRADA'
                );
                
                RAISE NOTICE 'Registro INSERT criado: Produto ID % (%) - Fornecedor ID % - Quantidade: % - Tipo: ENTRADA', 
                            NEW.id, NEW.nome, NEW.id_fornecedor, NEW.quantidade_estoque;
                
                RETURN NEW;
            END;
            $$;
        `;

        // Criar trigger para INSERT
        await sql`
            CREATE OR REPLACE TRIGGER tr_registrar_adicao_produto
            AFTER INSERT ON produtos
            FOR EACH ROW
            EXECUTE FUNCTION fn_registrar_adicao_produto();
        `;

        console.log(
            "🔥 Trigger 'tr_registrar_adicao_produto' criado com sucesso!"
        );
    } catch (error) {
        console.error("❌ Erro ao criar trigger de adição de produto:", error);
    }
}

// ========== TRIGGER PARA REGISTRO DE ATUALIZAÇÃO DE PRODUTOS ==========

async function createTriggerRegistrarAtualizacaoProduto() {
    try {
        // Função para registrar atualizações de quantidade (incluindo quando a procedure faz UPDATE)
        await sql`
            CREATE OR REPLACE FUNCTION fn_registrar_atualizacao_produto()
            RETURNS TRIGGER
            LANGUAGE plpgsql
            AS $$
            DECLARE
                quantidade_diferenca INTEGER;
                tipo_movimento VARCHAR(7);
            BEGIN
                -- Só registra se a quantidade foi alterada
                IF OLD.quantidade_estoque != NEW.quantidade_estoque THEN
                    quantidade_diferenca := NEW.quantidade_estoque - OLD.quantidade_estoque;
                    
                    -- Determinar o tipo de movimentação
                    IF quantidade_diferenca > 0 THEN
                        tipo_movimento := 'ENTRADA';
                    ELSE
                        tipo_movimento := 'SAIDA';
                        quantidade_diferenca := ABS(quantidade_diferenca);  -- Converter para positivo
                    END IF;
                    
                    -- Inserir registro da atualização
                    INSERT INTO registros (
                        id_produtos, 
                        id_fornecedores, 
                        data_registro, 
                        quantidade,
                        tipo_movimentacao
                    )
                    VALUES (
                        NEW.id,
                        NEW.id_fornecedor,
                        CURRENT_TIMESTAMP,
                        quantidade_diferenca,
                        tipo_movimento
                    );
                    
                    RAISE NOTICE 'Registro UPDATE criado: Produto ID % (%) - Fornecedor ID % - Tipo: % - Quantidade: % (de % para %)', 
                                NEW.id, NEW.nome, NEW.id_fornecedor, tipo_movimento, quantidade_diferenca, OLD.quantidade_estoque, NEW.quantidade_estoque;
                END IF;
                
                RETURN NEW;
            END;
            $$;
        `;

        // Trigger para atualizações
        await sql`
            CREATE OR REPLACE TRIGGER tr_registrar_atualizacao_produto
            AFTER UPDATE ON produtos
            FOR EACH ROW
            EXECUTE FUNCTION fn_registrar_atualizacao_produto();
        `;

        console.log(
            "🔥 Trigger 'tr_registrar_atualizacao_produto' criado com sucesso!"
        );
    } catch (error) {
        console.error(
            "❌ Erro ao criar trigger de atualização de produto:",
            error
        );
    }
}

// ========== EXECUTAR TRIGGERS ==========
createTriggers();
