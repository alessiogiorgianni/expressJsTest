import express from 'express'
import path from 'path'
import authRouter from './routes/auth'
import taskRouter from './routes/task'
import { initDB } from './config/db'

const app = express()

const PORT = process.env.NODE_PORT || 3000

initDB()

app.set('view engine', 'ejs')
app.set("views", path.join(process.cwd(), "views"))

app.use(express.json())
app.use('/auth', authRouter)
app.use('/task', taskRouter)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})


