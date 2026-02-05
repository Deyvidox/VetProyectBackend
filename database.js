import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const database = new Pool({
    user: process.env.USER || 'postgres',
    host: process.env.HOST || 'localhost',
    database: process.env.DATABASE,
    password: String(process.env.PASSWORD || ''), 
    port: parseInt(process.env.PORT_DB) || 5432,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000
});

database.on('connect', () => {
    console.log('✅ Conexión a PostgreSQL establecida');
});

database.on('error', (err) => {
    console.error('❌ Error inesperado en el pool:', err.message);
});

export default database;