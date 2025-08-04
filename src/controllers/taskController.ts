import { Request, Response } from 'express'
import { CreateTaskRequest, DeleteTaskRequest, Task } from '../types'
import { createTask, deleteTask, getTasksByUser } from '../config/db'


export async function addTask(req: Request<{}, {}, CreateTaskRequest>, res: Response) {
    const { userId, title }: CreateTaskRequest = req.body

    await createTask(userId, title)

    return res.json({ message: 'Task created successfully!' })
}

export async function removeTask(req: Request<{}, {}, DeleteTaskRequest>, res: Response) {
    const { taskId, userId }: DeleteTaskRequest = req.body

    const tasks = await getTasksByUser(userId)

    if (tasks.length === 0) {
        res.json({ message: `No task with id ${taskId} found for user ${userId}!` })
    }

    const taskToDelete = tasks.filter((task: Task) => task.id === taskId)
    
    if (taskToDelete.length > 0) {
        const task = taskToDelete[0]

        // Verify if user has permission to delete HIS task (cannot delete other user's task)
        if (task.user_id === userId) {
            deleteTask(userId, taskId)
        }
    }

    return res.json({message: 'Task deleted successfully!'})
}