import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

const database = new Pool({
    user: process.env.DB_USER,      // Antes decía USER
    host: process.env.DB_HOST,      // Antes decía HOST
    database: process.env.DB_NAME,  // Antes decía DATABASE
    password: String(process.env.DB_PASSWORD), // Antes decía PASSWORD
    port: parseInt(process.env.DB_PORT),       // Antes decía PORT_DB
})

export default database