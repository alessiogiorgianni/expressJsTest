const express = require('express')
const path = require('path')
const authRouter = require('./routes/auth')
const taskRouter = require('./routes/task')
const db = require('./config/db')

const app = express()

const PORT = process.env.NODE_PORT || 3000

db.initDB()

app.set('view engine', 'ejs')
app.set("views", path.join(process.cwd(), "views"))

app.use(express.json())
app.use('/auth', authRouter)
app.use('/task', taskRouter)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})