import { Tarefa } from './tarefa.js'

var data = new Date()
var agora = `${data.toLocaleDateString('pt-br')}`

var msgNome = document.getElementById('msg-nome-tarefa')
var msgData = document.getElementById('msg-data-tarefa')
var msgDesc = document.getElementById('msg-descricao-tarefa')

var regexDataConclusao = /^(\d{4})-(0?[1-9]||1[0-2])-(0?[1-9]||[12][0-9]||3[01])$/
var regexDataAgora = /^(0?[1-9]||[12][0-9]||3[01])\/(0?[1-9]||1[0-2])\/(\d{4})$/

var idEditado = null

export async function adicionarTarefa(nomeTarefa, dataConclusao, descricao, modal,){
    var validarDataConclusao = dataConclusao.replace(regexDataConclusao, `$1$2$3`)
    var validarDataAgora = agora.replace(regexDataAgora, `$3$2$1`)
    if(nomeTarefa.length == 0){
        msgNome.textContent = 'Campo obrigatório *'
    }else if(nomeTarefa.length > 40){
        msgNome.textContent = 'O nome não pode ultrapassar 40 caracteres *'
    }else if(dataConclusao.length == 0){
        msgData.textContent = 'Campo obrigatório *'
    }else if(Number(validarDataAgora) > Number(validarDataConclusao)){
        msgData.textContent = 'Digite uma data válida *'
    }else if(descricao.length == 0){
        msgDesc.textContent = 'Campo obrigatório *'
    }else{
        modal.classList.remove('aberto')
        const tarefa = new Tarefa(nomeTarefa, dataConclusao, descricao, false)
        try{
            const resposta = await fetch('http://localhost:8080/api/adicionar-tarefa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tarefa)
            })
            carregarDados()
        }catch(error){
            console.log(error)
        }

    }
}

export async function carregarDados(){
    var areaListaTarefas = document.getElementById('lista-tarefas')
    areaListaTarefas.innerHTML = ``
    try{
        const response = await fetch('http://localhost:8080/api/tarefas')
        var tarefas = await response.json()
        if(tarefas.length == 0){
            var msg = document.createElement('p')
            msg.textContent = 'Nenhuma tarefa cadastrada! Clique no botão +Nova tarefa'
            msg.style.color = '#8B5CF6'
            areaListaTarefas.appendChild(msg)
        }else{  
            tarefas.forEach(element => criarCardTarefa(element, areaListaTarefas))
        }
    }catch(error){
        console.log(error)
    }
}

function criarCardTarefa(element, areaListaTarefas){
    var cardTarefa = document.createElement('div')
    cardTarefa.classList.add('card-tarefa')

    var cardTarefaSup = document.createElement('div')
    cardTarefaSup.classList.add('card-tarefa-sup')
    var cardTarefaInf = document.createElement('div')
    cardTarefaInf.classList.add('card-tarefa-inf')
    cardTarefaInf.style.display = 'none'

    var statusTarefa = document.createElement('p')
    var markStatusTarefa = document.createElement('mark')
    statusTarefa.appendChild(markStatusTarefa)

    var validarDataConclusao = element.dataConclusao.replace(regexDataConclusao, `$1$2$3`)
    var validarDataAgora = agora.replace(regexDataAgora, `$3$2$1`)
    console.log(validarDataAgora)
    console.log(validarDataConclusao)
    
    var checkBox = document.createElement('input')
    checkBox.type = 'checkbox'
    checkBox.addEventListener('change', () => mudarStatusTarefa(checkBox,element))
    console.log(checkBox.checked)
    
    if(element.concluida == true){
        markStatusTarefa.textContent = "Concluído"
        markStatusTarefa.style.background = '#22C55E'
        checkBox.checked = true
    }else if(element.concluida == false && Number(validarDataAgora) > Number(validarDataConclusao)){
        markStatusTarefa.textContent = "Atrasada"
        markStatusTarefa.style.background = '#F59E0B'
        checkBox.checked = false
    }else if(element.concluida == false){
        markStatusTarefa.textContent = "Em andamento"
        markStatusTarefa.style.background = '#EF4444'
        checkBox.checked = false
    }

    var nomeTarefa = document.createElement('p')
    nomeTarefa.textContent = `${element.nome}`

    cardTarefaSup.appendChild(statusTarefa)
    cardTarefaSup.appendChild(nomeTarefa)
    cardTarefaSup.appendChild(checkBox)

    var descricaoTarefa = document.createElement('p')
    descricaoTarefa.classList.add('descricao')
    descricaoTarefa.textContent = `${element.descricao}`
    
    var dataCorreta = element.dataConclusao.replace(regexDataConclusao, `$3/$2/$1`)
    var dataConclusaoTarefa = document.createElement('p')
    dataConclusaoTarefa.textContent = `Data limite: ${dataCorreta}`

    var btnsTarefa = document.createElement('div')

    var editar = document.createElement('button')
    editar.textContent = 'Editar'
    editar.addEventListener('click', () => abrirEditorTarefa(element))
    var excluir = document.createElement('button')
    excluir.textContent = 'Excluir'
    excluir.addEventListener('click', () => excluirTarefa(element))

    btnsTarefa.appendChild(editar)
    btnsTarefa.appendChild(excluir)

    cardTarefaInf.appendChild(descricaoTarefa)
    cardTarefaInf.appendChild(dataConclusaoTarefa)
    cardTarefaInf.appendChild(btnsTarefa)

    cardTarefa.appendChild(cardTarefaSup)
    cardTarefa.appendChild(cardTarefaInf)
    areaListaTarefas.appendChild(cardTarefa)

    cardTarefa.addEventListener('click', (event) => {
        if(event.target != checkBox){
            if(cardTarefaInf.style.display == 'none'){
                cardTarefaInf.style.display = 'flex'
            }else if(cardTarefaInf.style.display == 'flex' && event.target != editar && event.target != excluir){
                cardTarefaInf.style.display = 'none'
            }
        }
    })
}

export async function excluirTodasTarefas(){
    try{
        const response = await fetch('http://localhost:8080/api/tarefas')
        var tarefas = await response.json()
        if(tarefas.length == 0){
            alert('Nenhuma tarefa cadastrada para excluir!')
        }else{
            if(confirm("Atenção! Todas as tarefas serão excluidas! Deseja mesmo continuar?")){
                const promises = tarefas.map(element => {
                    return fetch(`http://localhost:8080/api/deletar-tarefa/${element._id}`, {
                        method: 'DELETE',
                    })
                })
                await Promise.all(promises)
                carregarDados()
            }
        }
    }catch(error){
        console.log(error)
    }
    
}

function excluirTarefa(element){
    if(confirm("A tarefa será excluída! Deseja mesmo continuar?")){
        fetch(`http://localhost:8080/api/deletar-tarefa/${element._id}`, {
            method: 'DELETE'
        })
    }
    carregarDados()
}

function abrirEditorTarefa(element){
    var modal = document.getElementById('modal')
    var btnAtualizar = document.getElementById('update')
    var btnSaveTarefa = document.getElementById('save')
    var nomeTarefa = document.getElementById('inome-tarefa')
    var dataConclusao = document.getElementById('idata-conclusao')
    var descricao = document.getElementById('idescricao-tarefa')
    modal.classList.add('aberto')
    btnSaveTarefa.style.display = 'none'
    btnAtualizar.style.display = 'block'
    nomeTarefa.value = element.nome
    dataConclusao.value = element.dataConclusao
    descricao.value = element.descricao

    idEditado = element._id
}

export async function editarTarefa(nomeTarefa, dataConclusao, descricao, modal){
    var tarefaEditada = new Tarefa(nomeTarefa, dataConclusao, descricao)
    try{
        const promise = await fetch(`http://localhost:8080/api/editar-tarefa/${idEditado}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify(tarefaEditada)
        })
        if(!promise.ok){
            throw new Error('Não foi possível editar a tarefa')
        }
        modal.classList.remove('aberto')
        carregarDados()
    }catch(error){
        console.log(error)
    }
}

async function mudarStatusTarefa(check, element){
    try{
        console.log(element._id)
        const tarefaConcluida = new Tarefa(element.nome, element.dataConclusao, element.descricao, check.checked)
        const concluirTarefa = await fetch(`http://localhost:8080/api/mudar-status-tarefa/${element._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(tarefaConcluida)
        })
    }catch(error){
        console.log(error)
    }
    carregarDados()
}