const fs = require('fs')
const express = require('express')
const taskRouter = require('../routers/tarefas.js')
const userRouter = require('../routers/users.js')
const errMid = require('../middlewares/errorHandling.js')

const app = express()
app.use(express.static("./pages")) //Procura as páginas 
app.use(express.json()) //Habilita o envio de json nas páginas

app.get('/login', (req, res) => {
    fs.readFile('./pages/login.html', "utf-8", (error, data) => {
        if(error){
            res.status(500).send(error.message)
        }
        res.status(200).send(data)
    })
})

app.get('/cadastro', (req, res) => {
    fs.readFile('./pages/cadastro.html', "utf-8", (error, data) => {
        if(error){
            res.status(500).send(error.message)
        }
        res.status(200).send(data)
    })
})

app.get('/inicio', (req, res) => { //Requisição que carrega a página principal do servidor
    fs.readFile('./pages/index.html', 'utf-8', (error, data)=> { //FileSystem lê a página html e a envia 
        if(error){
            res.status(500).send(error.message)
        }
        res.status(200).send(data)
    })
})

app.get('/health', (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Servidor iniciado com sucesso"
    })
})

app.use("/tarefas", taskRouter)
app.use("/users", userRouter)
app.use(errMid)

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Running in port ${port}`))