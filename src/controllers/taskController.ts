import { Request, Response } from 'express'
import { CreateTaskRequest, DeleteTaskRequest, Task } from '../types'
import { createTask, deleteTask, getTasksByUser } from '../config/db'


export async function addTask(req: Request<{}, {}, CreateTaskRequest>, res: Response) {
    const { userId, title }: CreateTaskRequest = req.body

    await createTask(userId, title)

    res.json({ message: 'Task created successfully!' })
}

export async function removeTask(req: Request<{}, {}, DeleteTaskRequest>, res: Response) {
    const { taskId, userId }: DeleteTaskRequest = req.body

    const tasks = await getTasksByUser(userId)

    if (tasks.length === 0) {
        res.json({ message: `No task with id ${taskId} found for user ${userId}!` })
    }

    const taskToDelete = tasks.filter((task: Task) => task.id === taskId)

    taskToDelete.forEach(async (task: Task) => {
        // Verify if user has permission to delete HIS task (cannot delete other user's task)
        if (task.userId === userId) {
            await deleteTask(userId, taskId)
        }
    })
}


module.exports = { createTask: addTask, deleteTask: removeTask }