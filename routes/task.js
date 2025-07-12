const express = require('express')
const router = express.Router()

const {createTask, deleteTask} = require('../controllers/taskController')

router.post('/new', createTask)
router.post('/delete', deleteTask)

module.exports = router