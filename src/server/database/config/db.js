//database: LokiGames
import "dotenv/config";
import postgres from "postgres";

const { DATABASE_URL } = process.env;

console.log(DATABASE_URL);

export const sql = postgres(DATABASE_URL, {ssl: false});
