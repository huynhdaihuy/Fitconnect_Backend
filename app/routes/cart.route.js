const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.post('/', cartController.createCart);

router.get('/getCartByIdCustomer/:customerId', cartController.getCartByIdCustomer);

router.get('/getCartById/:cartId', cartController.getCartById);

router.put('/updateCartById/:cartId', cartController.updateCartById);

router.delete('/deleteCart/:cartId', cartController.deleteCart);

module.exports = router;
