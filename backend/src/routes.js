const express = require('express')
const userController = require('./controllers/userController')
const routes = express.Router();

// User routes--

// routes.post('/user/signin', userController.signin)
routes.post('/user/store', userController.store)
routes.put('/user/update', userController.update)
routes.get('/user/showAll', userController.showAll)
routes.delete('/user/delete', userController.delete)

// --User routes

module.exports = routes