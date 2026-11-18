var emailUsuario = document.getElementById('iuser')
var senhaUsuario = document.getElementById('ipassword')
var btnLogin = document.getElementById('btn-login')

var userMsg = document.getElementById('user-msg')
var passMsg = document.getElementById('pass-msg')

var verSenha = document.getElementById('ver-senha-login')

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

btnLogin.addEventListener('click', async() => {
    userMsg.textContent = ``
    passMsg.textContent = ``
    const user = {
        email: emailUsuario.value,
        password: senhaUsuario.value
    }
    if(!user.email || user.email.trim() === ''){
        userMsg.textContent = 'Campo obrigatório *'
    }else if(!user.password || user.password.trim() === ''){
        passMsg.textContent = 'Campo obrigatório *'
    }else{
        try{
            const resposta = await fetch('http://localhost:8080/users/validar-usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            const dados = await resposta.json()
            localStorage.setItem('token', dados.token)
            if(dados.status == 200){
                window.location.href = 'inicio'
            }
            if(!resposta){
                throw new Error("Não foi possível validar o usuário")
            }
        }catch(error){
            console.log(`[ERRO]: ${error.message}`)
        }
    }
})