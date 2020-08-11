const express = require('express')
const {
    register,
    login,
    getCurrentLoggedInUser,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
} = require('../controller/auth')
const { protect } = require('../middleware/auth')

const router = express.Router();

router
 .post('/register', register)
 .post('/login', login)
 .get('/me', protect, getCurrentLoggedInUser)
 .post('/forgotpassword', forgotPassword)
 .put('/resetpassword/:resettoken', resetPassword)
 .put('/updatedetails', protect, updateDetails)
 .put('/updatepassword', protect, updatePassword)

module.exports = router
