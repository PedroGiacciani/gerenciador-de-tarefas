//DESCRIBE --> Bloco de testes - test suites
//IT or TEST --> Único teste unitário - test cases
//EXPECT --> asserções do resultado - validar resultados

const taskController = require("../src/controllers/taskControllers")
const taskModel = require('../src/models/taskModel')

jest.mock('../src/models/taskModel')

describe("Show Tasks controller", () => {
    it("Should fail if something goes wrong with the server", async() => {
        const req = {
            user:{
                id: '6afcab1b4cb1777e062989ae'
            }
        }
        taskModel.find.mockRejectedValue(new Error("Erro interno no servidor"))
        await expect(taskController.mostrarTarefas(req, {})).rejects.toThrow("Erro interno no servidor")
        expect(taskModel.find).toHaveBeenCalledTimes(1)
    })
})

describe("Add Tasks controller", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("Should add tasks", async() => {
        const req = {
            body: {
                nome: "Realizar teste",
                dataConclusao: "2999-12-12",
                descricao: "Realizar teste unitário para ver se a tarefa está sendo criada",
                concluida: false
            },
            user:{
                id: '6afcab1b4cb1777e062989ae'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        
        taskModel.create.mockResolvedValue(req.body)

        await taskController.adicionarTarefa(req, res)
        
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(taskModel.create).toHaveBeenCalledTimes(1)
        expect(taskModel.create).toHaveBeenCalledWith({
            ...req.body,
            idUsuario: req.user.id
        })
        expect(res.status).toHaveBeenCalledWith(201)
    })

    it("Should fail without a name", async() => {
        const req = {
            body: {
                nome: " ",
                dataConclusao: "2999-12-12",
                descricao: "Realizar teste unitário para ver se a tarefa está sendo criada",
                concluida: false
            }
        }

        await expect(taskController.adicionarTarefa(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: "Nome da tarefa é obrigatório"
        })
        expect(taskModel.create).not.toHaveBeenCalled()
    })

    it("Should fail without a conclusion date", async() => {
        const req = {
            body: {
                nome: "Realizar teste",
                dataConclusao: "",
                descricao: "Realizar teste unitário para ver se a tarefa está sendo criada"
            }
        }

        await expect(taskController.adicionarTarefa(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: "A data de conclusão da tarefa é obrigatória"
        })

        expect(taskModel.create).not.toHaveBeenCalled()
    })

    it("Should fail with a conclusion date on a invalid format", async() => {
        const req = {
            body: {
                nome: "Realizar teste",
                dataConclusao: "10/10/2025",
                descricao: "Realizar teste unitário para ver se a tarefa está sendo criada"
            }
        }

        await expect(taskController.adicionarTarefa(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: "Data de conclusão no padrão inválido. Utilize o padrão AAAA-MM-DD para requisições!"
        })
        expect(taskModel.create).not.toHaveBeenCalled()
    })

    it("Should fail with text written instead of numbers in conclusion date", async() => {
        const req = {
            body: {
                nome: "Realizar teste",
                dataConclusao: "pedro",
                descricao: "Realizar teste unitário para ver se a tarefa está sendo criada"
            }
        }

        await expect(taskController.adicionarTarefa(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: "Data de conclusão no padrão inválido. Utilize o padrão AAAA-MM-DD para requisições!"
        })
        expect(taskModel.create).not.toHaveBeenCalled()
    })
    
    it("Should fail with a non-existent month in conclusion date", async() => {
        const req = {
            body: {
                nome: "Realizar teste",
                dataConclusao: "2999-13-21",
                descricao: "Realizar teste unitário para ver se a tarefa está sendo criada"
            }
        }

        await expect(taskController.adicionarTarefa(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: "Data de conclusão no padrão inválido. Utilize o padrão AAAA-MM-DD para requisições!"
        })
        expect(taskModel.create).not.toHaveBeenCalled()
    })

    it("Should fail with a non-existent day in conclusion date", async() => {
        const req = {
            body: {
                nome: "Realizar teste",
                dataConclusao: "2999-04-31",
                descricao: "Realizar teste unitário para ver se a tarefa está sendo criada"
            }
        }

        await expect(taskController.adicionarTarefa(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: "Data de conclusão inválida"
        })
        expect(taskModel.create).not.toHaveBeenCalled()
    })

    it("Should fail without a task description", async() => {
        const req = {
            body: {
                nome: "Realizar teste",
                dataConclusao: "2999-11-21",
                descricao: " "
            }
        }

        await expect(taskController.adicionarTarefa(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: "Descrição da tarefa obrigatória!"
        })
        expect(taskModel.create).not.toHaveBeenCalled()
    })

    it("Should fail if name is just spaces", async() => {
        const req = {
            body: {
                nome: "  ",
                dataConclusao: "2999-02-22",
                descricao: "Testando validações"
            }
        }

        await expect(taskController.adicionarTarefa(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: "Nome da tarefa é obrigatório"
        })
        expect(taskModel.create).not.toHaveBeenCalled()
    })

    it("Should fail if description is just spaces", async() => {
        const req = {
            body: {
                nome: "Testando validações",
                dataConclusao: "2999-02-22",
                descricao: "   "
            }
        }

        await expect(taskController.adicionarTarefa(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: "Descrição da tarefa obrigatória!"
        })
        expect(taskModel.create).not.toHaveBeenCalled()
    })

    it("Should fail if something goes wrong with the server", async() => {
        const req = {
            body: {
                nome: "Testando validações",
                dataConclusao: "2999-02-22",
                descricao: "Testando validação"
            },
            user:{
                id: '6afcab1b4cb1777e062989ae'
            }
        }

        taskModel.create.mockRejectedValue(new Error("Erro interno no servidor"))

        await expect(taskController.adicionarTarefa(req, {})).rejects.toThrow("Erro interno no servidor")
        expect(taskModel.create).toHaveBeenCalledTimes(1)
    })
})

describe("Delete Tasks controller", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    
    it("Should delete a task", async() => {
        const req = {
            params: {
                id: "507f1f77bcf86cd799439011"
            },
            body: {
                nome: "Realizar teste",
                dataConclusao: "2999-12-12",
                descricao: "Realizar teste unitário para ver se a tarefa está sendo criada",
                concluida: false
            },
            user:{
                id: '6afcab1b4cb1777e062989ae'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        taskModel.findByIdAndDelete.mockResolvedValue(req)
        await taskController.deletarTarefa(req, res)

        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(taskModel.findByIdAndDelete).toHaveBeenCalledTimes(1)
        expect(taskModel.findByIdAndDelete).toHaveBeenCalledWith({
            _id: req.params.id,
            idUsuario: req.user.id
        })

    })

    it("Should fail if task id is not valid", async() => {
        const req = {
            params: {
                id: "123abc"
            },
            body: {
                nome: "Realizar teste",
                dataConclusao: "2999-12-12",
                descricao: "Realizar teste unitário para ver se a tarefa está sendo deletada",
                concluida: false
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await expect(taskController.deletarTarefa(req, res)).rejects.toMatchObject({
            statusCode: 400,
            message: "ID em formato inválido"
        })
        expect(taskModel.findByIdAndDelete).not.toHaveBeenCalled()
    })

    it("Should fail if the task was not found", async() => {
        const req = {
            params: {
                id: "507f1f77bcf86cd799439011"
            },
            body: {
                nome: "Realizar teste",
                dataConclusao: "2999-12-12",
                descricao: "Realizar teste unitário para ver se a tarefa está sendo criada",
                concluida: false
            },
            user:{
                id: '6afcab1b4cb1777e062989ae'
            }
        }

        taskModel.findByIdAndDelete.mockResolvedValue(null)

        await expect(taskController.deletarTarefa(req, {})).rejects.toMatchObject({
            statusCode: 404,
            message: "Tarefa não encontrada, verifique se o ID fornecido realmente existe!"
        })
        expect(taskModel.findByIdAndDelete).toHaveBeenCalledTimes(1)
    })

    it("Should fail if something goes wrong with the server", async() => {
        const req = {
            params: {
                id: "507f1f77bcf86cd799439011"
            },
            body: {
                nome: "Teste",
                dataConclusao: "2999-11-09",
                descricao: "Testando deleção de tarefas"
            },
            user:{
                id: '6afcab1b4cb1777e062989ae'
            }
        }

        taskModel.findByIdAndDelete.mockRejectedValue(new Error("Erro interno no servidor"))

        await expect(taskController.deletarTarefa(req, {})).rejects.toThrow("Erro interno no servidor")
        expect(taskModel.findByIdAndUpdate).not.toHaveBeenCalled()
    })
})

describe("Edit Tasks controller", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("Should update the task", async() => {
        const req = {
            params: {
                id: "507f1f77bcf86cd799439011"
            },
            body: {
                nome: "Teste",
                dataConclusao: "2999-11-09",
                descricao: "teste"
            },
            user:{
                id: '6afcab1b4cb1777e062989ae'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        taskModel.findByIdAndUpdate.mockResolvedValue(req)
        await taskController.editarTarefa(req, res)

        expect(taskModel.findByIdAndUpdate).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledTimes(1)
    
    })

    it("Should fail if the ID is in a invalid format", async() => {
        const req = {
            params: {
                id: "123abc"
            },
            body: {
                nome: "Teste",
                dataConclusao: "2999-11-09",
                descricao: "Teste"
            }
        }

        await expect(taskController.editarTarefa(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: "ID em formato inválido"
        })
        expect(taskModel.findByIdAndUpdate).not.toHaveBeenCalled()
    })

    it("Should fail if the task was not found", async() => {
        const req = {
            params: {
                id: "507f1f77bcf86cd799439011"
            },
            body: {
                nome: "Realizar teste",
                dataConclusao: "2999-12-12",
                descricao: "Realizar teste unitário para ver se a tarefa está sendo criada",
                concluida: false
            },
            user:{
                id: '6afcab1b4cb1777e062989ae'
            }
        }

        taskModel.findByIdAndUpdate.mockResolvedValue(null)
        await expect(taskController.editarTarefa(req, {})).rejects.toMatchObject({
            statusCode: 404,
            message: "Tarefa não encontrada, verifique se o ID fornecido realmente existe!"
        })
        expect(taskModel.findByIdAndUpdate).toHaveBeenCalledTimes(1)
    })

    it("Should fail if something goes wrong with the server", async() => {
        const req = {
            params: {
                id: "507f1f77bcf86cd799439011"
            },
            body: {
                nome: "Realizar teste",
                dataConclusao: "2999-12-12",
                descricao: "Realizar teste unitário para ver se a tarefa está sendo criada",
                concluida: false
            },
            user:{
                id: '6afcab1b4cb1777e062989ae'
            }
        }

        taskModel.findByIdAndUpdate.mockRejectedValue(new Error("Erro interno no servidor"))
        await expect(taskController.editarTarefa(req, {})).rejects.toThrow("Erro interno no servidor")
        expect(taskModel.findByIdAndUpdate).toHaveBeenCalledTimes(1)
    })
})

describe("Change Tasks status controller", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("Should change the task status", async() => {
        taskModel.findById.mockResolvedValue({
            concluida: false
        })
        
        const req = {
            params: {
                id: "507f1f77bcf86cd799439011"
            },
            body: {
                nome: "Teste",
                dataConclusao: "2999-11-09",
                descricao: "teste",
                concluida: true
            },
            user:{
                id: '6afcab1b4cb1777e062989ae'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }    

        taskModel.findByIdAndUpdate.mockResolvedValue(req)
        await taskController.mudarStatusTarefa(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(req)
        expect(taskModel.findByIdAndUpdate).toHaveBeenCalledTimes(1)
    })

    it("Should fail if the task ID is in a invalid format", async() => {
        const req = {
            params: {
                id: "123abc"
            },
            body: {
                nome: "Teste",
                dataConclusao: "2999-11-09",
                descricao: "teste"
            }
        }

        await expect(taskController.mudarStatusTarefa(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: "ID em formato inválido"
        })
        expect(taskModel.findByIdAndUpdate).not.toHaveBeenCalled()
    })

    it("Should fail if the task was not found", async() => {
        const req = {
            params: {
                id: "507f1f77bcf86cd799439011"
            },
            body: {
                nome: "Teste",
                dataConclusao: "2999-11-09",
                descricao: "teste"
            },
            user:{
                id: '6afcab1b4cb1777e062989ae'
            }
        }

        taskModel.findByIdAndUpdate.mockResolvedValue(null)
        
        await expect(taskController.mudarStatusTarefa(req, {})).rejects.toMatchObject({
            statusCode: 404,
            message: "Tarefa não encontrada, verifique se o ID fornecido realmente existe!"
        })
        expect(taskModel.findByIdAndUpdate).toHaveBeenCalledTimes(1)
    })

    it("Should fail if the new task status is equal to the actual one (false)", async() => {
        taskModel.findById.mockResolvedValue({
            concluida: false
        })

        const req = {
            params: {
                id: "507f1f77bcf86cd799439011"
            },
            body: {
                concluida: false
            },
            user:{
                id: '6afcab1b4cb1777e062989ae'
            }
        }

        taskModel.findByIdAndUpdate.mockResolvedValue(req)
        await expect(taskController.mudarStatusTarefa(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: "O status da tarefa é o mesmo da requisição. Nada mudou"
        })
        expect(taskModel.findByIdAndUpdate).not.toHaveBeenCalled()
    })

    it("Should fail if the new task status is equal to the actual one (true)", async() => {
        taskModel.findById.mockResolvedValue({
            concluida: true
        })

        const req = {
            params: {
                id: "507f1f77bcf86cd799439011"
            },
            body: {
                concluida: true
            },
            user:{
                id: '6afcab1b4cb1777e062989ae'
            }
        }

        taskModel.findByIdAndUpdate.mockResolvedValue(req)
        await expect(taskController.mudarStatusTarefa(req, {})).rejects.toMatchObject({
            statusCode: 400,
            message: "O status da tarefa é o mesmo da requisição. Nada mudou"
        })
        expect(taskModel.findByIdAndUpdate).not.toHaveBeenCalled()
    })

    it("Should fail if something goes wrong with the server", async() => {
        const req = {
            params: {
                id: "507f1f77bcf86cd799439011"
            },
            body: {
                nome: "Teste",
                dataConclusao: "2999-11-09",
                descricao: "teste"
            },
            user:{
                id: '6afcab1b4cb1777e062989ae'
            }
        }

        taskModel.findByIdAndUpdate.mockRejectedValue(new Error("Erro interno no servidor"))
        await expect(taskController.mudarStatusTarefa(req, {})).rejects.toThrow("Erro interno no servidor")
        expect(taskModel.findByIdAndUpdate).toHaveBeenCalledTimes(1)
    })
})