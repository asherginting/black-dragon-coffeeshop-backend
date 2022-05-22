const productDeliveryMethod = require('express').Router();
const { verifyUser } = require('../helpers/auth');

const {
    getProductDeliveryMethodByIdProduct,
    getProductDeliveryMethod,
    insertProductDeliveryNethod,
    updateDataProductDeliveryMethod,
    updatePatchProductDeliveryMethod,
    deleteProdutDeliveryMethod
} = require('../controllers/productDeliveryMethod');

productDeliveryMethod.get('/product/:idProduct', getProductDeliveryMethodByIdProduct); // get all product delivery method by id product
productDeliveryMethod.get('/:id', getProductDeliveryMethod); // get detail product delivery method
productDeliveryMethod.post('/', verifyUser, insertProductDeliveryNethod);
productDeliveryMethod.put('/:id', verifyUser, updateDataProductDeliveryMethod);
productDeliveryMethod.patch('/:id', verifyUser, updatePatchProductDeliveryMethod);
productDeliveryMethod.delete('/:id', verifyUser, deleteProdutDeliveryMethod);

module.exports = productDeliveryMethod;