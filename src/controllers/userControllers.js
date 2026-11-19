const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adicionarUsuario = async(req, res) => {
    const {email, password} = req.body
    const senhaHash = await bcrypt.hash(password, 10) //Hash de senha (criptografia)
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if(!email || email.trim() === ''){
        const error = new Error("E-mail de usuário obrigatório")
        error.statusCode = 400
        throw error
    }else if(!regexEmail.test(email)){  
        const error = new Error("E-mail inválido")
        error.statusCode = 400
        throw error        
    }else if(!password){
        const error = new Error("Senha de usuário obrigatória")
        error.statusCode = 400
        throw error
    }else if(password.trim() === ''){
        const error = new Error("A senha não pode ser apenas espaços")
        error.statusCode = 400
        throw error
    }else if(password.length < 6){
        const error = new Error("A senha tem que ter no mínimo 6 caracteres")
        error.statusCode = 400
        throw error
    }

    const user = await userModel.findOne({ email })
    if(user.email == email){
        const error = new Error("Usuário já cadastrado! Vá para a tela de login")
        error.statusCode = 400
        throw error
    }else{
        const user = await userModel.create({
            email: email,
            password: senhaHash
        })
        return res.status(201).json({
            message: 'Usuário criado com sucesso!',
            email: user.email
        })
    }
}

const consultarUsuarios = async(req, res) => {
    const users = await userModel.find({})
    res.status(200).json(users)
}

const validarUsuario = async(req, res) => {
    const {email, password} = req.body
    if(!email || email.trim() === ''){
        const error = new Error('Usuário obrigatório *')
        error.statusCode = 400
        throw error
    }else if(!password){
        const error = new Error('Senha obrigatória *')
        error.statusCode = 400
        throw error
    }
    const user = await userModel.findOne({ email })
    if(!user){
        const error = new Error('Usuário não encontrado')
        error.statusCode = 404
        throw error
    }else{
        const validacao = await bcrypt.compare(password, user.password) //Comparar se a senha digitada corresponde ao hash dela (criptografia)
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'})
        if(validacao){
            return res.status(200).json({
                "mensagem": "Login realizado com sucesso!",
                "status": 200,
                "usuario": {
                    "id": user.id,
                    "e-mail": user.email
                },
                token
            })
        }else{
            const error = new Error("Usuário ou senha incorretos")
            error.statusCode = 401
            throw error
        }
    }
}

module.exports = {
    adicionarUsuario,
    consultarUsuarios,
    validarUsuario
}