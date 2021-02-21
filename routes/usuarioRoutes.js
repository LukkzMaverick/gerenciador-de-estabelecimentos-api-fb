const {Router} = require('express')
const usuarioController = require('../controllers/usuarioController')
const auth = require('../middleware/auth')
const { validatorLogin,validatorRegister,validatorRegisterAdmin } = require('../util/arrays/validators/authValidators')

const router = Router()

router.post('/login',validatorLogin, usuarioController.login)
router.post('/register',validatorRegister, usuarioController.register)
router.post('/registerAdmin',validatorRegisterAdmin,auth, usuarioController.registerForAdmin)
router.get('/validateToken/:token',validatorLogin, usuarioController.validateToken)
module.exports = router