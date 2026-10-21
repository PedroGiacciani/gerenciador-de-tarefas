//É POR AQUI QUE TODO O SERVIDOR RODA

const dotenv = require('dotenv') //Importar o .env
const connectToDatabase = require('./src/database/connect') //Importar a função que conecta com o banco

dotenv.config() //Configura as variáveis de ambiente
connectToDatabase() //Conecta com o banco

require('./modules/express')