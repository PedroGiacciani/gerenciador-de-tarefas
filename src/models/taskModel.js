const mongoose = require('mongoose') //Importa a biblioteca Mongoose

const taskSchema = new mongoose.Schema({ //Cria um modelo de tarefa para subir ao banco
    concluida: { //Cada um desses objects são atributos da tarefa e suas especificações
        type: Boolean,
        required: true
    },
    dataConclusao: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
        required: true,
    },
    nome: {
        type: String,
        required: true,
    },
})

const taskModel = mongoose.model('Tarefa', taskSchema) //Modela a tarefa utilizando o schema criado acima
module.exports = taskModel //Exporta o modelo