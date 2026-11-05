const fs = require('fs')
const express = require('express')
const taskRouter = require('./routers/tarefas')

const app = express()
app.use(express.static("./pages")) //Procura as páginas 
app.use(express.json()) //Habilita o envio de json nas páginas

app.get('/', (req, res) => { //Requisição que carrega a página principal do servidor
    fs.readFile('./pages/index.html', 'utf-8', (error, data)=> { //FileSystem lê a página html e a envia 
        if(error){
            res.status(500).send(error.message)
        }
        res.status(200).send(data)
    })
})

app.use("/tarefas", taskRouter)

const port = 8080
app.listen(port, () => console.log(`Running in port ${port}`))