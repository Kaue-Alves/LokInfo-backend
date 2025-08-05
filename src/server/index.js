import 'dotenv/config'
import { fastify } from "fastify"

const { PORT } = process.env
const app = fastify()

app.get("/", () => {
    console.log("Server funcionando");
    
})

app.listen({
    port: PORT || 3333
})