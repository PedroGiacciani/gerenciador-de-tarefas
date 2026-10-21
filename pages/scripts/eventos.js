import { Tarefa } from './tarefa.js'

export async function adicionarTarefa(nomeTarefa, dataConclusao, descricao){
    const tarefa = new Tarefa(nomeTarefa, dataConclusao, descricao)
    try{
        const resposta = await fetch('http://localhost:8080/api/adicionar-tarefa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarefa)
        })
        console.log(tarefa)
    }catch(error){
        console.log(error)
    }
}

export async function carregarDados(){
    try{
        const response = await fetch('http://localhost:8080/api/tarefas')
        var tarefas = response.json()
        console.log(tarefas)
        tarefas.forEach(element => {
            console.log(element)
        })
    }catch(error){
        console.log(error)
    }
}