const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

client.connect()
  .then(() => console.log('✅ DB connected'))
  .catch(err => console.error('❌ DB connection error:', err));


// --- Utils Query --- //

async function initDB() {
    client.query(`DROP TABLE IF EXISTS users`)
    client.query(`CREATE TABLE users(id SERIAL PRIMARY KEY, username VARCHAR(255), password VARCHAR(255))`)
    client.query(`DROP TABLE IF EXISTS tasks`)
    client.query(`CREATE TABLE tasks(id SERIAL PRIMARY KEY, user_id INT, title VARCHAR(255), CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id))`)
}


// --- USER Query --- //

async function findAllUsers() {
  const response = await client.query('SELECT * FROM users')
    
  return response.rows
}

async function findUserByUsername(username) {
  const response = await client.query('SELECT * FROM users WHERE username = $1', [username])
    
  return response.rows
}

async function addUser (user) {
  await client.query(
    "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
    [
      user.username,
      user.email,
      user.password
    ]
  )
}


// --- Task Query --- //

async function getTasksByUser (userId) {
  const response = await client.query("SELECT * FROM tasks WHERE user_id = $1", [userId])

  return response.rows
}

async function getTaskByUser (userId, taskId) {
  const response = await client.query("SELECT * FROM tasks WHERE user_id = $1 AND id = $2", [userId, taskId])

  return response.rows
}

async function createTask (userId, title) {
  await client.query("INSERT INTO tasks (user_id, title) VALUES($1, $2)", [userId, title])
}

async function deleteTask (userId, taskId) {
  await client.query("DELETE FROM tasks WHERE user_id = $1 AND id = $2", [userId, taskId])
}


module.exports = {initDB, findAllUsers, findUserByUsername, addUser, createTask, deleteTask, getTaskByUser, getTasksByUser };