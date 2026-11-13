//Arquivo com todas as funções executadas nas APIs
const taskModel = require('../models/taskModel')
const mongoose = require('mongoose')

var data = new Date()
var agora = `${data.toLocaleDateString('pt-br')}`
var regexDataConclusao = /^(\d{4})-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/
var regexDataAgora = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/(\d{4})$/

var regexFev = /^(\d{4})-(0?2)-(3[01])$/
var regexMesCom30 = /^(\d{4})-(0?[469]|11)-(31)$/

const mostrarTarefas = async(req, res) => {
    const tarefas = await taskModel.find({})
    return res.status(200).json(tarefas)
}

const adicionarTarefa = async(req, res) => {

    const {nome, descricao, dataConclusao} = req.body
    
    var validarDataAgora = agora.replace(regexDataAgora, `$3$2$1`)
    var validarDataConclusao = dataConclusao.replace(regexDataConclusao, `$1$2$3`)

    if(!nome || nome.trim() === ''){
        const error = new Error("Nome da tarefa é obrigatório")
        error.statusCode = 400
        throw error
    }else if(!dataConclusao || dataConclusao.trim() === ''){
        const error = new Error("A data de conclusão da tarefa é obrigatória")
        error.statusCode = 400
        throw error
    }else if(!regexDataConclusao.test(dataConclusao)){
        const error = new Error("Data de conclusão no padrão inválido. Utilize o padrão AAAA-MM-DD para requisições!")
        error.statusCode = 400
        throw error
    }else if(Number(validarDataConclusao) < Number(validarDataAgora) || regexFev.test(dataConclusao) || regexMesCom30.test(dataConclusao)){
        const error = new Error("Data de conclusão inválida")
        error.statusCode = 400
        throw error
    }else if(!descricao || descricao.trim() === ''){
        const error = new Error("Descrição da tarefa obrigatória!")
        error.statusCode = 400
        throw error
    }
    
    const tarefa = await taskModel.create(req.body)

    return res.status(201).json(tarefa)
}

const deletarTarefa = async(req, res) => {
    let id = req.params.id
    if(!mongoose.isObjectIdOrHexString(id)){
        taskErrors(1)
    }
    const tarefaDeletada = await taskModel.findByIdAndDelete(id)
    if(tarefaDeletada == null){
        taskErrors(2)
    }
    return res.status(200).json(tarefaDeletada)
}

const editarTarefa = async(req, res) => {
    let id = req.params.id
    if(!mongoose.isObjectIdOrHexString(id)){
        taskErrors(1)
    }
    const tarefaEditada = await taskModel.findByIdAndUpdate(id, req.body, {returnDocument: 'after'})
    if(tarefaEditada == null){
        taskErrors(2)
    }
    return res.status(200).json(tarefaEditada)
}

const mudarStatusTarefa = async(req, res) => {
    let id = req.params.id
    if(!mongoose.isObjectIdOrHexString(id)){
        taskErrors(1)
    }
    let mudarStatus = await taskModel.findByIdAndUpdate(id, req.body, {returnDocument: 'after'})
    const statusTarefa = req.body
    if(mudarStatus == null){
        taskErrors(2)
    }
    console.log(mudarStatus)
    console.log(statusTarefa)
    if(mudarStatus.concluida == statusTarefa.concluida){
        const error = new Error('O status da tarefa é o mesmo da requisição. Nada mudou')
        error.statusCode = 400
        throw error
    }
    return res.status(200).json(mudarStatus)
}

function taskErrors(id){
    if(id == 1){
        const error = new Error('ID em formato inválido')
        error.statusCode = 400
        throw error
    }else{
        const error = new Error('Tarefa não encontrada, verifique se o ID fornecido realmente existe!') 
        error.statusCode = 404
        throw error
    }
}

module.exports = {
    mostrarTarefas,
    adicionarTarefa,
    deletarTarefa,
    editarTarefa,
    mudarStatusTarefa
}
