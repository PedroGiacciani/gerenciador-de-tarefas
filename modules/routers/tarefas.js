const express = require('express')
const router = express.Router()
const taskModel = require('../../src/models/taskModel')

router.get('/', async (req, res) => { //Requisição que busca todas as tarefas cadastradas
    try{
        const tarefas = await taskModel.find({})
        res.status(200).json(tarefas)
    }catch(error){
        res.status(500).send(error.message)
    }
})

router.post('/adicionar-tarefa', async (req, res) => { //Requisição que adiciona uma nova tarefa
    try{
        const tarefa = await taskModel.create(req.body)
        res.status(201).json(tarefa)
    }catch(error){
        res.status(500).send(error.message)
    }
})

router.delete('/deletar-tarefa/:id', async (req, res) => { //Requisição que deleta uma tarefa
    try{
        let id = req.params.id
        const tarefaDeletada = await taskModel.findByIdAndDelete(id)
        res.status(200).json(tarefaDeletada)
    }catch(error){
        res.status(500).send(error.message)
    }
})

router.patch('/editar-tarefa/:id', async (req, res) => { //Requisição que edita uma tarefa
    try{
        let id = req.params.id
        const tarefaEditada = await taskModel.findByIdAndUpdate(id, req.body, {returnDocument: 'after'})
        res.status(200).json(tarefaEditada)
    }catch(error){
        res.status(500).send(error.message)
    }
})

router.patch('/mudar-status-tarefa/:id', async (req, res) => { //Requisição para concluir uma tarefa
    try{
        let id = req.params.id
        let mudarStatus = await taskModel.findByIdAndUpdate(id, req.body, {returnDocument: 'after'})
        res.status(200).json(mudarStatus)
    }catch(error){
        res.status(500).send(error.message)
    }
})

module.exports = router