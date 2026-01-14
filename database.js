import { pg } from "pg"
import dotenv from "dotenv"

dotenv.config()

const database = new pg({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT_DB,
})

export default database