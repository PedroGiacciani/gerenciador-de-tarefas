var emailUsuario = document.getElementById('inew-user')
var senhaUsuario = document.getElementById('inew-password')
var btnCadastro = document.getElementById('btn-cadastro')

var userMsg = document.getElementById('user-msg')
var passMsg = document.getElementById('pass-msg')

var verSenha = document.getElementById('ver-senha-cad')

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

emailUsuario.focus()

btnCadastro.addEventListener('click', async() => {
    userMsg.textContent = ``
    passMsg.textContent = ``
    const user = {
        email: emailUsuario.value,
        password: senhaUsuario.value
    }

    if(!user.email || user.email.trim() === ''){
        userMsg.textContent = 'Campo obrigatório *'
    }else if(!regexEmail.test(user.email)){
        userMsg.textContent = 'E-mail inválido *'
    }else if(!user.password){
        passMsg.textContent = 'Campo obrigatório *'
    }else if(user.password.trim() === ''){
        passMsg.textContent = 'A senha não pode conter apenas espaços*'
    }else if(user.password.length < 6){
        passMsg.textContent = 'A senha precisa ter no mínimo 6 caracteres *'
    }else{
        try{
            const resposta = await fetch('/users/adicionar-usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            if(!resposta.ok){
                if(resposta.status == 400 || resposta.status == 409){
                    throw new Error(`Esse e-mail já está sendo utilizado`)
                }else{
                    throw new Error(`Algo deu errado, tente novamente mais tarde`)
                }
            }
            alert('Usuário cadastrado!')
        }catch(error){
            alert(`Não foi possível cadastrar. ${error.message}`)
        }
    }
})

verSenha.addEventListener('click', () => {
    if(senhaUsuario.type == 'password'){
        senhaUsuario.type = 'text'
        verSenha.classList.remove('fa-eye')
        verSenha.classList.add('fa-eye-slash')
    }else if (senhaUsuario.type == 'text'){
        senhaUsuario.type = 'password'
        verSenha.classList.remove('fa-eye-slash')
        verSenha.classList.add('fa-eye')
    }
})