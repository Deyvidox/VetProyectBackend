import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

const database = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: parseInt(process.env.PORT_DB),
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000
})

database.on('connect', () => {
    console.log('✅ Conexión a PostgreSQL establecida')
})

database.on('error', (err) => {
    console.error('❌ Error en la conexión a PostgreSQL:', err)
})

database.on('error', (err) => {
    console.error('Error inesperado en el pool de la base de datos:', err.message);
});

export default database