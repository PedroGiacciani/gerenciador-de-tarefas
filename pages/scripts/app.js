//Importações
import { adicionarTarefa, carregarDados } from "./eventos.js"

//Declaração de váriaveis
var btnAddTarefa = document.getElementById('add-tarefa')
var modalContainer = document.getElementById('modal')
var btnSaveTarefa = document.getElementById('save')

var nomeTarefa = document.getElementById('inome-tarefa')
var dataConclusao = document.getElementById('idata-conclusao')
var descricao = document.getElementById('idescricao-tarefa')

var msgNome = document.getElementById('msg-nome-tarefa')
var msgData = document.getElementById('msg-data-tarefa')
var msgDesc = document.getElementById('msg-descricao-tarefa')

btnAddTarefa.addEventListener('click', () => {
    msgNome.textContent = ``
    msgData.textContent = ``
    msgDesc.textContent = ``
    nomeTarefa.value = ''
    dataConclusao.value = ''
    descricao.value = ''
    modalContainer.classList.add('aberto') //Abre a caixa de cadastro de tarefa
    nomeTarefa.focus()
})

modalContainer.addEventListener('click', (event) => {
    if(modalContainer.className == 'modal aberto' && event.target === modalContainer){ //Fecha a caixa se ela estiver aberta e se clicar fora dela
        modalContainer.classList.remove('aberto')

        msgNome.textContent = ``
        msgData.textContent = ``
        msgDesc.textContent = ``
    }
})

btnSaveTarefa.addEventListener('click', () => {
    adicionarTarefa(nomeTarefa.value, dataConclusao.value, descricao.value, modalContainer)
})

carregarDados()