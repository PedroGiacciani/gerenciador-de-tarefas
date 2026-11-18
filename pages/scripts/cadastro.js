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

    const req = await fetch('http://localhost:8080/users/consultar-usuarios')
    const dados = await req.json()
    const procurarUser = dados.find(e => e.email == user.email)

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
    }else if(procurarUser){
        alert("O usuário que está tentando cadastrar já está na plataforma! Faça login para continuar")
    }else{
        try{
            const resposta = await fetch('http://localhost:8080/users/adicionar-usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            if(!resposta.ok){
                throw new Error("Não foi possível cadastrar usuário")
            }
            alert('Usuário cadastrado!')
        }catch(error){
            console.log(`Não foi possível cadastrar usuário. ${error.message}`)
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