const express = require('express')
const router = express.Router()
const roles = require('../controllers/roles')
router.post('/createRoles',roles.createRole)
router.get('/getdata:roleId',roles.RoleDetails)
router.delete('/deleteData:Id',roles.deleteRole)
module.exports = router