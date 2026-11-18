const userController = require("../src/controllers/userControllers")
const taskModel = require("../src/models/taskModel")
const userModel = require('../src/models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
process.env.JWT_SECRET = '1dk1nd10pnjdpq' //Chave ficticia para testes

jest.mock('../src/models/userModel')

describe('Add Users controller', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Should add an user properly', async() => {
        const req = {
            body: {
                email: 'pedro@gmail.com',
                password: 'pedro123'
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        userModel.findOne.mockResolvedValue({ email: 'exemplo@gmail.com'})
        userModel.create.mockResolvedValue(req)
        await userController.adicionarUsuario(req, res)
        const senhaArmazenada = userModel.create.mock.calls[0][0].password

        expect(senhaArmazenada).not.toBe(req.body.password)
        expect(await bcrypt.compare(req.body.password, senhaArmazenada)).toBe(true)
        expect(userModel.create).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(201)

        const resposta = res.json.mock.calls[0][0]
        expect(resposta).not.toHaveProperty('password')
    })

    it("Should fail without an email", async() => {
        const req = {
            body: {
                email: '',
                password: 'pedro123'
            }
        }

        await expect(userController.adicionarUsuario(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: "E-mail de usuário obrigatório"
        })
        expect(userModel.create).not.toHaveBeenCalled()
    })

    it("Should fail if email is just spaces", async() => {
        const req = {
            body: {
                email: '  ',
                password: 'pedro123'
            }
        }

        await expect(userController.adicionarUsuario(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: "E-mail de usuário obrigatório"
        })
        expect(userModel.create).not.toHaveBeenCalled()
    })

    it("Should fail if the email is in an invalid format", async() => {
        const req = {
            body: {
                email: "pedrogmail",
                password: 'pedro123'
            }
        }

        await expect(userController.adicionarUsuario(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: 'E-mail inválido'
        })
        expect(userModel.create).not.toHaveBeenCalled()
    })

    it("Should fail without a password", async() => {
        const req = {
            body: {
                email: 'pedro@gmail.com',
                password: ''
            }
        }

        await expect(userController.adicionarUsuario(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: "Senha de usuário obrigatória"
        })
        expect(userModel.create).not.toHaveBeenCalled()
    })
    
    it("Should fail with password is just spaces", async() => {
        const req = {
            body: {
                email: 'pedro@gmail.com',
                password: '   '
            }
        }

        await expect(userController.adicionarUsuario(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: "A senha não pode ser apenas espaços"
        })
        expect(userModel.create).not.toHaveBeenCalled()
    })

    it("Should fail if the password is in an invalid format", async() => {
        const req = {
            body: {
                email: "pedro@gmail.com",
                password: 'ped'
            }
        }

        await expect(userController.adicionarUsuario(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: 'A senha tem que ter no mínimo 6 caracteres'
        })
        expect(userModel.create).not.toHaveBeenCalled()
    })

    it("Should fail if already exists an account with this email", async() => {
        const req = {
            body: {
                email: 'pedro@gmail.com',
                password: 'pedro123'
            }
        }

        userModel.findOne.mockResolvedValue({email: "pedro@gmail.com"})
        await expect(userController.adicionarUsuario(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: "Usuário já cadastrado! Vá para a tela de login"
        })
        expect(userModel.create).not.toHaveBeenCalled()
    })

    it("Should fail if something goes wrong with the server", async() => {
        const req = {
            body: {
                email: 'pedro@gmail.com',
                password: 'pedro123'
            }
        }
        userModel.findOne.mockResolvedValue({email: "exemplo@gmail.com"})
        userModel.create.mockRejectedValue(new Error("Erro interno no servidor"))
        await expect(userController.adicionarUsuario(req, {})).rejects.toThrow("Erro interno no servidor")
        expect(userModel.create).toHaveBeenCalledTimes(1)
    })
})

describe('Validate Users controller', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("Should validate an user properly", async() => {
        const senhaHash = await bcrypt.hash('pedro123', 10)
        const req = {
            body: {
                email:'pedro@gmail.com',
                password: 'pedro123',
                _id: '123456'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        var user = userModel.findOne.mockResolvedValue({
            email: req.body.email,
            password: senhaHash,
            _id: req.body._id
        })
        await userController.validarUsuario(req, res)
        const senhaArmazenada = userModel.findOne.mock.results[0].value.password
        const resposta = res.json.mock.calls[0][0]

        expect(resposta.token).toBeDefined()
        expect(typeof resposta.token).toBe('string')

        const decode = jwt.verify(resposta.token, process.env.JWT_SECRET)
        expect(decode.id).toBe(user._id)

        expect(senhaArmazenada).not.toBe(req.body.password)
        expect(await bcrypt.compare(req.body.password, senhaArmazenada)).toBe(true)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(userModel.findOne).toHaveBeenCalledTimes(1)
    })
})