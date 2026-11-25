# Gerenciador de Tarefas

Aplicação web para gerenciamento de tarefas, desenvolvida com JavaScript, Node.js, Express e MongoDB. O projeto permite que usuários criem suas contas, realizem login e organizem suas tarefas de maneira simples e intuitiva.

**Acesse a aplicação:** [Gerenciador de Tarefas](https://gerenciador-de-tarefas-9kfx.onrender.com)

## Sobre o projeto

O Gerenciador de Tarefas foi desenvolvido como projeto de aprendizado e aplicação prática de conceitos de desenvolvimento web, construção de APIs REST, autenticação de usuários, persistência de dados e testes automatizados.

A aplicação possui uma estrutura de backend e frontend integrados, com armazenamento de dados no MongoDB Atlas e autenticação baseada em JWT.

## Funcionalidades

- Cadastro de usuários.
- Login e autenticação com JWT.
- Criptografia de senhas utilizando bcrypt.
- Criação de tarefas.
- Listagem de tarefas.
- Edição de tarefas.
- Exclusão de tarefas.
- Marcação de tarefas como concluídas.
- Organização de tarefas por usuário.
- Validação de dados e tratamento centralizado de erros.

## Tecnologias utilizadas

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt

### Frontend
- HTML5
- CSS3
- JavaScript

### Testes
- Jest

### Hospedagem
- Render
- MongoDB Atlas

## Estrutura do projeto

```text
gerenciador-de-tarefas/
│
├── pages/
│   ├── cadastro.html
│   ├── index.html
│   ├── login.html
│   │
│   ├── scripts/
│   │   ├── app.js
│   │   ├── cadastro.js
│   │   ├── eventos.js
│   │   ├── login.js
│   │   └── tarefa.js
│   │
│   └── styles/
│       ├── form.css
│       ├── media.css
│       └── style.css
│
├── src/
│   ├── config/
│   │   └── express.js
│   │
│   ├── controllers/
│   │   ├── taskControllers.js
│   │   └── userControllers.js
│   │
│   ├── database/
│   │   └── connect.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── errorHandling.js
│   │
│   ├── models/
│   │   ├── taskModel.js
│   │   └── userModel.js
│   │
│   └── routers/
│       ├── tarefas.js
│       └── users.js
│
├── tests/
│   ├── authMid.test.js
│   ├── tarefas.test.js
│   └── usuarios.test.js
│
├── index.js
├── package.json
├── package-lock.json
├── jest.config.js
├── .gitignore
└── LICENSE
```

## Como executar o projeto localmente

### 1. Pré-requisitos

- Node.js instalado.
- npm instalado.
- Conta e cluster configurados no MongoDB Atlas.
- Git instalado.

### 2. Clone o repositório

```bash
git clone https://github.com/PedroGiacciani/gerenciador-de-tarefas.git
```

### 3. Acesse a pasta

```bash
cd gerenciador-de-tarefas
```

### 4. Instale as dependências

```bash
npm install
```

### 5. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
MONGODB_LINK=sua_uri_do_mongodb
JWT_SECRET=sua_chave_secreta
PORT=8080
```

Substitua os valores de exemplo pelas suas próprias configurações. Nunca compartilhe ou envie o arquivo `.env` ao GitHub.

### 6. Execute a aplicação

```bash
npm start
```

Após iniciar o servidor, acesse:

```text
http://localhost:8080
```

> Confira os scripts definidos no `package.json` para garantir que o comando de inicialização corresponda à versão atual do projeto.

## Principais rotas da API

### Usuários

| Método | Rota | Descrição |
|---|---|---|
| POST | `/users/adicionar-usuario` | Cadastra um usuário |
| POST | `/users/validar-usuario` | Realiza o login |
| GET | `/users/consultar-usuarios` | Consulta usuários |

### Tarefas

As rotas de tarefas exigem autenticação por token JWT.

| Método | Rota | Descrição |
|---|---|---|
| GET | `/tarefas` | Lista as tarefas do usuário |
| POST | `/tarefas/adicionar-tarefa` | Cria uma tarefa |
| DELETE | `/tarefas/deletar-tarefa/:id` | Exclui uma tarefa |
| PATCH | `/tarefas/editar-tarefa/:id` | Edita uma tarefa |
| PATCH | `/tarefas/mudar-status-tarefa/:id` | Altera o status da tarefa |

Nas requisições protegidas, envie o token no cabeçalho:

```text
Authorization: Bearer SEU_TOKEN
```

## Testes automatizados

O projeto utiliza Jest para execução dos testes automatizados.

Para executar os testes:

```bash
npm test
```

Os testes abrangem funcionalidades dos controllers de usuários e tarefas, além da validação do middleware de autenticação.

## Deploy

A aplicação está hospedada no Render, com o banco de dados disponibilizado pelo MongoDB Atlas.

**Aplicação publicada:** [Acessar Gerenciador de Tarefas](https://gerenciador-de-tarefas-9kfx.onrender.com)

## Aprendizados

Durante o desenvolvimento deste projeto, foram trabalhados conceitos como:

- Desenvolvimento de APIs REST.
- Arquitetura MVC e organização de responsabilidades.
- Operações CRUD.
- Modelagem de dados com Mongoose.
- Autenticação e autorização com JWT.
- Criptografia de senhas com bcrypt.
- Middlewares personalizados.
- Tratamento centralizado de erros.
- Testes automatizados com Jest.
- Variáveis de ambiente.
- Deploy e configuração de aplicação em produção.

---

Desenvolvido por **Pedro Giacciani**.

[GitHub](https://github.com/PedroGiacciani)
