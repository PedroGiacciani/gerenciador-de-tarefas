const mongoose = require('mongoose') //Importa a biblioteca do mongoose

const connectToDatabase = async () => { //Função assíncrona que conecta o sistema com o mongoDB
    await mongoose.connect(process.env.MONGODB_LINK)
    .then(() => console.log("Banco de dados conectado com sucesso!"))
    .catch((error) => console.log(error))
}

module.exports = connectToDatabase //Exporta a conexão (utilizado no index para inicializar o banco)