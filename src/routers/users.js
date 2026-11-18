const express = require('express')
const router = express.Router()

const {
    adicionarUsuario,
    validarUsuario
} = require('../controllers/userControllers')

router.post('/adicionar-usuario', adicionarUsuario)
router.post('/validar-usuario/', validarUsuario)

module.exports = router