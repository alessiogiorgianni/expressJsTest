import { User } from '../types'
import { Client } from 'pg'
import { Task } from '../types'

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3000'),
});

client.connect()
  .then(() => console.log('✅ DB connected'))
  .catch((err: unknown) => {
    if (err instanceof Error) {
      console.error('❌ DB connection error:', err)
    }
  });


// --- Utils Query --- //

export async function initDB() {
  client.query(`DROP TABLE IF EXISTS users`)
  client.query(`CREATE TABLE users(id SERIAL PRIMARY KEY, username VARCHAR(255), password VARCHAR(255), refresh_token VARCHAR(128))`)
  client.query(`DROP TABLE IF EXISTS tasks`)
  client.query(`CREATE TABLE tasks(id SERIAL PRIMARY KEY, user_id INT, title VARCHAR(255), CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id))`)
}


// --- USER Query --- //

export async function findAllUsers(): Promise<User[]> {
  const response = await client.query('SELECT * FROM users')

  return response.rows
}

export async function findUserByUsername(username: string) {
  const response = await client.query('SELECT * FROM users WHERE username = $1', [username])

  return response.rows
}

export async function addUser(user: User) {
  await client.query(
    "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
    [
      user.username,
      user.password
    ]
  )
}

export async function addJwtRefreshtokenTouser(user: User, refreshToken: string) {
  await client.query(
    "UPDATE users SET refresh_token = $1 WHERE id = $2",
    [
      refreshToken,
      user.id
    ]
  )
}


// --- Task Query --- //

export async function getTasksByUser(userId: number): Promise<Task[]> {
  const response = await client.query("SELECT * FROM tasks WHERE user_id = $1", [userId])

  return response.rows
}

export async function getTaskByUser(userId: number, taskId: number): Promise<Task[]> {
  const response = await client.query("SELECT * FROM tasks WHERE user_id = $1 AND id = $2", [userId, taskId])

  return response.rows
}

export async function createTask(userId: number, title: string) {
  await client.query("INSERT INTO tasks (user_id, title) VALUES($1, $2)", [userId, title])
}

export async function deleteTask(userId: number, taskId: number) {
  await client.query("DELETE FROM tasks WHERE user_id = $1 AND id = $2", [userId, taskId])
}