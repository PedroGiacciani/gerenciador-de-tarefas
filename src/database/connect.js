const mongoose = require('mongoose')

const connectToDatabase = async () => {
    await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@aprendizadonodejs.izzvbqc.mongodb.net/`)
    .then(() => console.log("Banco de dados conectado com sucesso!"))
    .catch((error) => console.log(error))
}

module.exports = connectToDatabase