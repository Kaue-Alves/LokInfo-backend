import { sql } from "../config/db.js";

export class Usuarios {
    async create() {
        try {
            await sql`CALL adicionar_fornecedor('Kaue', '12122122000128', '89998898998', 'kaue@email.com')`;
            console.log("✅ Fornecedor adicionado com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao adicionar fornecedor:", error);
        }
    }
}
