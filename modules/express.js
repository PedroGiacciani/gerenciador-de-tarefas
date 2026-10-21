const fs = require('fs')
const express = require('express')
const taskModel = require('../src/models/taskModel')
const { error } = require('console')

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

app.post('/api/adicionar-tarefa', async (req, res) => {
    try{
        const tarefa = await taskModel.create(req.body)
        res.status(201).json(tarefa)
    }catch(error){
        res.status(500).send(error.message)
    }
})


const port = 8080
app.listen(port, () => console.log(`Running in port ${port}`))
