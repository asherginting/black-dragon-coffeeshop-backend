const route = require('express').Router();

route.use('/products', require('./product'));
route.use('/auth', require('./auth'));
route.use('/profile', require('./profile'));
route.use('/categories', require('./category'));
route.use('/histories', require('./histories'));
route.use('/promotions', require('./promotion'));
route.use('/sizeForProduct', require('./sizeForProduct'));
route.use('/promotionDeliveryMethods', require('./promotionDeliveryMethod'));
route.use('/productDeliveryMethods', require('./productDeliveryMethod'));
route.use('/promotionSizes', require('./promotionSize'));
route.use('/paymentMethod', require('./paymentMethods'));
route.use('/productHistory', require('./productHistory'));
route.use('/sizes', require('./size'));
route.use('/tax', require('./taxAndFees'));
route.use('/deliveryMethods', require('./deliveryMethod'));

module.exports = route;