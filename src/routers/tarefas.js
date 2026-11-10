//Arquivo com todas as rotas das APIs
const express = require('express')
const router = express.Router()

const {
    mostrarTarefas, 
    adicionarTarefa, 
    deletarTarefa, 
    editarTarefa,
    mudarStatusTarefa
} = require('../controllers/taskControllers')

router.get('/', mostrarTarefas) //Requisição que busca todas as tarefas cadastradas

router.post('/adicionar-tarefa', adicionarTarefa) //Requisição que adiciona uma nova tarefa

router.delete('/deletar-tarefa/:id', deletarTarefa) //Requisição que deleta uma tarefa

router.patch('/editar-tarefa/:id', editarTarefa) //Requisição que edita uma tarefa

router.patch('/mudar-status-tarefa/:id', mudarStatusTarefa)//Requisição para concluir uma tarefa

module.exports = router