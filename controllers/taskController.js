const db = require('../config/db')


async function createTask (req, res) {
    const task = req.body

    await db.createTask(task)

    res.json({message: 'Tak creates successfully!'})
}

async function deleteTask (req, res) {
    const userId = req.user
    const taskId = req.task

    const tasks = await db.getTaskByUser(userId)

    if (tasks.length === 0) {
        res.json({message: `No task with id ${taskId} found for user ${userId}!`})
    }

    await db.deleteTask(userId, taskId)
}


module.exports = {createTask, deleteTask}