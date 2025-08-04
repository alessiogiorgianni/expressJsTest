import express from 'express'
import { addTask, removeTask } from '../controllers/taskController' 

const router = express.Router()

router.post('/new', addTask)
router.post('/delete', removeTask)

export default router