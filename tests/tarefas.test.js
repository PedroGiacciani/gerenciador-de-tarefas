//DESCRIBE --> Bloco de testes - test suites
//IT or TEST --> Único teste unitário - test cases
//EXPECT --> asserções do resultado - validar resultados

const taskController = require("../src/controllers/taskControllers")
const taskModel = require('../src/models/taskModel')

jest.mock('../src/models/taskModel')

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
        expect(taskModel.create).toHaveBeenCalledWith(req.body)
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
            }
        }

        taskModel.create.mockRejectedValue(new Error("Erro interno no servidor"))

        await expect(taskController.adicionarTarefa(req, {})).rejects.toThrow("Erro interno no servidor")
        expect(taskModel.create).toHaveBeenCalledTimes(1)
    })
})