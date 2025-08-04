import { Request, Response } from 'express'
import { addUser, findUserByUsername } from '../config/db'
import { LoginRequest } from '../types'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export async function authRegister(req: Request, res: Response) {
    const user = req.body

    await addUser(user)

    return res.json({ message: 'Registration successful!' })
}

export async function authLogin(req: Request<{}, {}, LoginRequest>, res: Response) {
    const { username, password }: LoginRequest = req.body

    const user = await findUserByUsername(username)

    if (user !== undefined) {
        if (user.password === password) {
            // create jwt token
            const accessToken = jwt.sign(
                { 'username': user.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            )

            const refreshToken = jwt.sign(
                { 'username': user.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            )

            return res.json({ message: 'Login success' })
        }
    }
    else {
        res.sendStatus(401)

        res.json({ message: 'User not found' })
    }
}