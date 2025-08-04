import { Request, Response } from 'express'
import { addUser, findUserByUsername, updateUserRefreshToken } from '../config/db'
import { LoginRequest, User } from '../types'
import jwt from 'jsonwebtoken'
import { isHashValid } from '../util'

export async function authRegister(req: Request, res: Response) {
    const user = req.body

    await addUser(user.username, user.password)

    return res.json({ message: 'Registration successful!' })
}

export async function authLogin(req: Request<{}, {}, LoginRequest>, res: Response) {
    const { username, password }: LoginRequest = req.body

    const users: User[] = await findUserByUsername(username)
    const user = (users.length >= 0) ? users[0] : undefined
    
    if (user !== undefined && isHashValid(password, user.password_salt, user.password_hash)) {
        // create jwt token
        const accessToken = jwt.sign(
            { 'username': user.username },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: '3600s' }
        )

        const refreshToken = jwt.sign(
            { 'username': user.username },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '1d' }
        )

        updateUserRefreshToken(user.id, refreshToken)

        res.header('Authorization', `Bearer ${accessToken}`)
        
        return res.sendStatus(200)
    }

    res.sendStatus(401)

    return res.json({ message: 'Unauthorized' })
}