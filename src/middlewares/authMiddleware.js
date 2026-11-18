const jwt = require('jsonwebtoken') //Importa a lib do jwt

const authentication = (req, res, next) => {
    const authHeader = req.headers.authorization //Pega o token no cabeçalho da requisição
    if(!authHeader){ //Se não existir esse token, gera um erro
        const error = new Error("Token não informado")
        error.statusCode = 401 //Unauthorized
        throw error
    }
    const token = authHeader.split(' ')[1] //Separa o 'Bearer' do token (vem como bearer token)
    try{
        const verificacao = jwt.verify(token, process.env.JWT_SECRET) //Verifica se o token é válido
        req.user = verificacao //Recebe o token no corpo da requisição para conferência
        return next() //Passa para o próximo middleware
    }catch(error){
        const erro = new Error('Token inválido')
        erro.statusCode = 401
        return next(erro)
    }
}

module.exports = authentication