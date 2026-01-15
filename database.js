import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

const database = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE, 
    password: String(process.env.PASSWORD),
    port: parseInt(process.env.PORT_BD), 
})

database.on('error', (err) => {
    console.error('Error inesperado en el pool de la base de datos:', err.message);
});

export default database