// db.js
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

// Obtener la URL de conexión de Supabase
const connectionString = process.env.DATABASE_URL;

// Validar que la URL de conexión existe
if (!connectionString) {
    console.error('❌ DATABASE_URL no está definida en las variables de entorno');
    process.exit(1);
}

// Configurar la conexión SQL
const sql = postgres(connectionString, {
    // Configuraciones recomendadas para Supabase
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    connect_timeout: 10,
    
    // Configuraciones opcionales adicionales
    ssl: {
        rejectUnauthorized: false // Necesario para conexiones SSL con Supabase
    },
    
    // Transformar nombres de columnas (opcional)
    transform: {
        column: {
            // Convertir snake_case a camelCase automáticamente
            from: postgres.fromCamel,
            to: postgres.toCamel
        }
    }
});

// Manejar eventos de conexión
sql`
    SELECT 1
`.then(() => {
    console.log('✅ Conexión a Supabase establecida correctamente');
}).catch(err => {
    console.error('❌ Error al conectar con Supabase:', err.message);
    process.exit(1);
});

// Manejar cierre de conexión en señales de terminación
process.on('SIGINT', async () => {
    await sql.end();
    console.log('🔒 Conexión a Supabase cerrada');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await sql.end();
    console.log('🔒 Conexión a Supabase cerrada');
    process.exit(0);
});

export default sql;