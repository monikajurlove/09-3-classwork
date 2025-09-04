const express = require('express');
const Router = express.Router();

const mainController = require('../controllers/mainController');
const { validateRegister, validateLogin } = require('../middleware/authValidators');
const { validateCreateItem, validateUpdateItem } = require('../middleware/itemValidators');
const { jwtDecode } = require('../middleware/authorization');

Router.post('/register', validateRegister, mainController.register);
Router.post('/login', validateLogin, mainController.login);

Router.post('/createitem', validateCreateItem, jwtDecode, mainController.createitem);
Router.get('/allitems', mainController.allitems);

Router.post('/reserve/:itemId', jwtDecode, mainController.reserveItem);
Router.post('/unreserve/:itemId', jwtDecode, mainController.removeReservation);
Router.get('/myreserved', jwtDecode, mainController.myReserved);

Router.delete('/delete/:itemId', jwtDecode, mainController.deleteItem);

module.exports = Router;