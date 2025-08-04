import express from 'express'
import { addTask, removeTask } from '../controllers/taskController' 
import { auth } from '../middleware/authMiddleware'

const router = express.Router()

router.post("/new", auth, addTask)
router.post('/delete', auth, removeTask)

export default router