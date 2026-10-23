const fs = require('fs')
const express = require('express')
const taskModel = require('../src/models/taskModel')
const { error } = require('console')
const { castObject } = require('moongose/models/user_model')

const app = express()
app.use(express.static("./pages")) //Procura as páginas 
app.use(express.json())

app.get('/', (req, res) => {
    fs.readFile('./pages/index.html', 'utf-8', (error, data)=> {
        if(error){
            console.log(error)
        }
        res.status(200).send(data)
    })
})

app.get('/api/tarefas', async (req, res) => {
    try{
        const tarefas = await taskModel.find({})
        res.status(200).json(tarefas)
    }catch(error){
        res.status(500).send(error.message)
    }
})

app.post('/api/adicionar-tarefa', async (req, res) => {
    try{
        const tarefa = await taskModel.create(req.body)
        res.status(201).json(tarefa)
    }catch(error){
        res.status(500).send(error.message)
    }
})

app.delete('/api/deletar-tarefa/:id', async (req, res) => {
    try{
        let id = req.params.id
        const tarefaDeletada = await taskModel.findByIdAndDelete(id)
        res.status(200).json(tarefaDeletada)
    }catch(error){
        console.log(error)
        res.status(500).send(error.message)
    }
})

app.patch('/api/editar-tarefa/:id', async (req, res) => {
    try{
        let id = req.params.id
        const tarefaEditada = await taskModel.findByIdAndUpdate(id, req.body, {returnDocument: 'after'})
        res.status(200).json(tarefaEditada)
    }catch(error){
        res.status(500).send(error.message)
    }
})

app.patch('/api/mudar-status-tarefa/:id', async (req, res) => {
    try{
        let id = req.params.id
        let mudarStatus = await taskModel.findByIdAndUpdate(id, req.body, {returnDocument: 'after'})
        res.status(200).json(mudarStatus)
    }catch(error){
        res.status(500).send(error.message)
    }
})

const port = 8080
app.listen(port, () => console.log(`Running in port ${port}`))
