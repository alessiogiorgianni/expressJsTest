const db = require('../config/db')


async function register(req, res) {
    const user = req.body

    await db.addUser(user)

    return res.json({message: 'Registration successful!'})
}

async function login(req, res) {
    const {username, password} = req.body

    const user = await db.findUserByUsername(username)

    if (user !== undefined) {
        const message = (user.password === password) 
            ? 'Login success!'
            : 'Login failed!'
        
        return res.json({message})
    }

    res.json({message: 'Login failed'})
}

module.exports = {register, login}