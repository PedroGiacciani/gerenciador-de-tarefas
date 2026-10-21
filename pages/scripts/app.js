//Importações

//Declaração de váriaveis
var btnAddTarefa = document.getElementById('add-tarefa')
var modalContainer = document.getElementById('modal')
var btnSaveTarefa = document.getElementById('save')

btnAddTarefa.addEventListener('click', () => {
    modalContainer.classList.add('aberto') //Abre a caixa de cadastro de tarefa
})

modalContainer.addEventListener('click', (event) => {
    if(modalContainer.className == 'modal aberto' && event.target === modalContainer){ //Fecha a caixa se ela estiver aberta e se clicar fora dela
        modalContainer.classList.remove('aberto')
    }
})

btnSaveTarefa.addEventListener('click', () => modalContainer.classList.remove('aberto'))