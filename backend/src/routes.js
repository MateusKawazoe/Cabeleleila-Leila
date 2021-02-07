const express = require('express')
const userController = require('./controllers/userController')
const scheduleController = require('./controllers/scheduleController')
const infrastructureController = require('./controllers/infrastructureController')
const routes = express.Router();

// User routes--

// routes.post('/user/signin', userController.signin)
routes.post('/user/store', userController.store)
routes.put('/user/update', userController.update)
routes.get('/user/showAll', userController.showAll)
routes.post('/user/showOne', userController.showOne)
routes.delete('/user/delete', userController.delete)

// --User routes

// Schedule routes

routes.post('/schedule/store', scheduleController.store)
routes.put('/schedule/update', scheduleController.update)
routes.get('/schedule/showAll', scheduleController.showAll)
routes.post('/schedule/showOne', scheduleController.showOne)
routes.delete('/schedule/delete', scheduleController.delete)
routes.post('/schedule/sameWeek', scheduleController.sameWeek)

// --Schedule routes

// Infrastructure routes--

routes.post('/infrastructure/storeService', infrastructureController.storeService)
routes.post('/infrastructure/storeClerk', infrastructureController.storeClerk)
routes.put('/infrastructure/updateService', infrastructureController.updateService)
routes.get('/infrastructure/showOne', infrastructureController.showOne)
routes.delete('/infrastructure/deleteService', infrastructureController.deleteService)
routes.delete('/infrastructure/deleteClerk', infrastructureController.deleteClerk)

// --Infrastructure routes

module.exports = routes