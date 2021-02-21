const {Router} = require('express')
const empresaController = require('../controllers/empresaController')
const auth = require('../middleware/auth')
const { validatorCadastrarEmpresa } = require('../util/arrays/validators/empresaValidators')

const router = Router()

router.post('/',validatorCadastrarEmpresa, auth, empresaController.create)
router.get('/', auth, empresaController.index)
router.get('/withEstabelecimentos', auth, empresaController.EmpresasWithEstabelecimentos)
router.get('/byLoggedUser', auth, empresaController.byLoggedUser)
router.patch('/:empresaId', auth, empresaController.update)
router.delete('/:empresaId', auth, empresaController.delete)

module.exports = router