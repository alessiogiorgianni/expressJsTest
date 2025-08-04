import bcrypt from 'bcrypt'


const saltRounds = 10


export function hashPassword(password: string) {
    const salt: string = bcrypt.genSaltSync(saltRounds)
    const hash: string = bcrypt.hashSync(password, salt)

    return {salt, hash}
}

export function isHashValid(password: string, salt: string, hash: string): boolean {
    const testHash: string = bcrypt.hashSync(password, salt)

    return hash === testHash
}