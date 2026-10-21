//Importações
import { adicionarTarefa } from "./eventos.js"

//Declaração de váriaveis
var btnAddTarefa = document.getElementById('add-tarefa')
var modalContainer = document.getElementById('modal')
var btnSaveTarefa = document.getElementById('save')

var nomeTarefa = document.getElementById('inome-tarefa')
var dataConclusao = document.getElementById('idata-conclusao')
var descricao = document.getElementById('idescricao-tarefa')

btnAddTarefa.addEventListener('click', () => {
    modalContainer.classList.add('aberto') //Abre a caixa de cadastro de tarefa
})

modalContainer.addEventListener('click', (event) => {
    if(modalContainer.className == 'modal aberto' && event.target === modalContainer){ //Fecha a caixa se ela estiver aberta e se clicar fora dela
        modalContainer.classList.remove('aberto')
    }
})

btnSaveTarefa.addEventListener('click', () => {
    adicionarTarefa(nomeTarefa.value, dataConclusao.value, descricao.value)
    modalContainer.classList.remove('aberto')
})