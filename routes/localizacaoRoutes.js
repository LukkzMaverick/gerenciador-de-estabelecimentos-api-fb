const {Router} = require('express')
const localizacaoController = require('../controllers/localizacaoController')
const auth = require('../middleware/auth')

const router = Router()

router.get('/',auth, localizacaoController.index)
router.get('/:empresaId', auth, localizacaoController.getLocalizacoesByEmpresa)

module.exports = router