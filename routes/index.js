const express = require('express');
const personController = require('../controller/person');
const userController = require('../controller/user');

const router = express.Router();
router.post('/person', personController.createPerson);
router.post('/user', userController.createUser);

module.exports = router;
