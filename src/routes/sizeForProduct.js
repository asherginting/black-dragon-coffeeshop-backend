/* eslint-disable no-unused-vars */
const sizeForProduct = require('express').Router();
const { verifyUser } = require('../helpers/auth');

const {
    getSizeForProductsByIdProduct,
    getSizeForProduct,
    insertSizeForProduct,
    updateDataProductSize,
    updatePatchSizeForUpdate,
    deleteSizeForProduct
} = require('../controllers/sizeForProduct');
const { verify } = require('jsonwebtoken');

sizeForProduct.get('/product/:idProduct', getSizeForProductsByIdProduct); // get all size by id product
sizeForProduct.get('/:id', getSizeForProduct); // get detail size for product
sizeForProduct.post('/', verifyUser, insertSizeForProduct);
sizeForProduct.put('/:id', verifyUser, updateDataProductSize);
sizeForProduct.patch('/:id', verifyUser, updatePatchSizeForUpdate);
sizeForProduct.delete('/:id', verifyUser, deleteSizeForProduct);

module.exports = sizeForProduct;