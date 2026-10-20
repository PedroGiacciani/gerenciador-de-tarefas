const fs = require('fs')
const express = require('express')
const { error } = require('console')

const app = express()
app.use(express.static("./pages")) //Procura as páginas 

app.get('/', (req, res) => {
    fs.readFile('./pages/index.html', 'utf-8', (error, data)=> {
        if(error){
            console.log(error)
        }
        res.status(200).send(data)
    })
})

const port = 8080
app.listen(port, () => console.log(`Running in port ${port}`))