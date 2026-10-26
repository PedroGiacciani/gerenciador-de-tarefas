//Importações
import { 
    adicionarTarefa,
    carregarDados,
    editarTarefa,
    excluirTodasTarefas,
    filtrarTarefas,
    pesquisarTarefa
} from "./eventos.js"

//Declaração de váriaveis
var btnAddTarefa = document.getElementById('add-tarefa')
var modalContainer = document.getElementById('modal')
var btnSaveTarefa = document.getElementById('save')
var btnAtualizarTarefa = document.getElementById('update')

var nomeTarefa = document.getElementById('inome-tarefa')
var dataConclusao = document.getElementById('idata-conclusao')
var descricao = document.getElementById('idescricao-tarefa')

var msgNome = document.getElementById('msg-nome-tarefa')
var msgData = document.getElementById('msg-data-tarefa')
var msgDesc = document.getElementById('msg-descricao-tarefa')

var btnExcluirTodas = document.getElementById('btn-excluir-todas')

var filtroTarefa = document.getElementById('ifiltrar-tarefa')
var pesquisaTarefa = document.getElementById('ipesquisar-tarefa')

//Função que abre o modal de cadastro de tarefa
btnAddTarefa.addEventListener('click', () => {
    //Inicia o modal com os campos vazios
    msgNome.textContent = `` 
    msgData.textContent = ``
    msgDesc.textContent = ``
    nomeTarefa.value = ''
    dataConclusao.value = ''
    descricao.value = ''
    //Abre a caixa de cadastro de tarefa
    modalContainer.classList.add('aberto') 
    //Mostra o botão de salvar e não o de atualizar (usado para editar a tarefa)
    btnSaveTarefa.style.display = 'block' 
    btnAtualizarTarefa.style.display = 'none'
    //Coloca o foco do mouse no campo de digitar o nome
    nomeTarefa.focus()
})

//Fecha o modal de cadastro quando clicar fora dele
modalContainer.addEventListener('click', (event) => {
    if(modalContainer.className == 'modal aberto' && event.target === modalContainer){ //Fecha a caixa se ela estiver aberta e se clicar fora dela
        modalContainer.classList.remove('aberto')

        msgNome.textContent = ``
        msgData.textContent = ``
        msgDesc.textContent = ``
    }
})

//Chama a função de adicionar tarefa
btnSaveTarefa.addEventListener('click', () => {
    msgNome.textContent = ``
    msgData.textContent = ``
    msgDesc.textContent = ``
    adicionarTarefa(nomeTarefa.value, dataConclusao.value, descricao.value, modalContainer)
    
})

//Chama a função de excluir todas as tarefas
btnExcluirTodas.addEventListener('click', () => excluirTodasTarefas())

//Chama a função de editar a tarefa
btnAtualizarTarefa.addEventListener('click', () => editarTarefa(nomeTarefa.value, dataConclusao.value, descricao.value, modalContainer))

//Chama a função de filtrar a tarefa
filtroTarefa.addEventListener('change', () => filtrarTarefas(filtroTarefa))

//Chama a função de pesquisar a tarefa
pesquisaTarefa.addEventListener('input', () => pesquisarTarefa(pesquisaTarefa.value))

//Carrega os dados e puxa todas as tarefas que já estiverem cadastradas
carregarDados()