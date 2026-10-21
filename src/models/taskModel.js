const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    concluida: {
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

const taskModel = mongoose.model('Tarefa', taskSchema)
module.exports = taskModel