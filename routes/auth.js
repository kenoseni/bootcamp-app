const express = require('express')
const { register, login, getCurrentLoggedInUser  } = require('../controller/auth')
const { protect } = require('../middleware/auth')

const router = express.Router();

router
 .post('/register', register)
 .post('/login', login)
 .get('/me', protect, getCurrentLoggedInUser)

module.exports = router
