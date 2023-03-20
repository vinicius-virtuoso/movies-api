import 'dotenv/config'
import { Client } from 'pg'

export const client = new Client({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT),
})

export const startDatabase = async (): Promise<void> => {
  await client.connect()
  console.log('Database connected.')
}
