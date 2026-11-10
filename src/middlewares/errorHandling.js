const errorMiddleware = (error, req, res, next) => {
    var statusCode = error.statusCode || 500
    
    res.status(statusCode).json({
        erro: error.message || "Erro interno no servidor"
    })
}

module.exports = errorMiddleware