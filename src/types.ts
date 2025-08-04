export interface LoginRequest {
    username: string,
    password: string
}

export interface RegistrationRequest {
    username: string,
    password: string,
    repeatPassword: string
}

export interface CreateTaskRequest {
    userId: number,
    title: string
}

export interface DeleteTaskRequest {
    taskId: number,
    userId: number
}

export interface User {
    id: number,
    username: string,
    password_hash: string,
    password_salt: string,
    refresh_token?: string
}

export interface Task {
    id?: number,
    user_id: number,
    title: string
}