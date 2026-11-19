const jwt = require('jsonwebtoken')
const authMid = require('../src/middlewares/authMiddleware')
process.env.JWT_SECRET = 'ldqpdcqfvnpwern' //Segredo aleatório para fins de teste

describe('Authentication Middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Should properly validate a token', () => {
        const token = jwt.sign({id: '1234'}, process.env.JWT_SECRET, {expiresIn: '1h'})
        const req = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
        const next = jest.fn()
        authMid(req, {}, next)
        expect(req.user).toMatchObject({
            id: '1234'
        })
        expect(next).toHaveBeenCalledTimes(1)
    })

    it("Should fail if the token was not informed", () => {
        const req = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const next = jest.fn()
        try{
            authMid(req, {}, next)
        }catch(error){
            expect(error.message).toBe('Token não informado')
            expect(error.statusCode).toBe(401)
        }
        expect(next).not.toHaveBeenCalled()
    })

    it("Should fail if the token expired", () => {
        const token = jwt.sign({id: '1234'}, process.env.JWT_SECRET, {expiresIn: '0s'})
        const req = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
        const next = jest.fn()
        try {
            authMid(req, {}, next)
        } catch (error) {
            expect(error.message).toBe('Token expirado! Faça login novamente')
            expect(error.statusCode).toBe(401)
        }

        const erro = new Error('Token expirado! Faça login novamente')
        erro.statusCode = 401

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(erro)
    })

    it("Should fail if the token is invalid", () => {
        const token = jwt.sign({id: '1234'}, process.env.JWT_SECRET, {expiresIn: '1h'})
        const req = {
            headers: {
                'authorization': `Bearer qadqdq`
            }
        }
        const next = jest.fn()
        try {
            authMid(req, {}, next)
        } catch (error) {
            expect(error.message).toBe('Token inválido!')
            expect(error.statusCode).toBe(401)
        }

        const erro = new Error('Token inválido!')
        erro.statusCode = 401

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(erro)
    })
})  