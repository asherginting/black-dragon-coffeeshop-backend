const promotionDeliveryMethods = require('express').Router();

const {
  // insertPromotionDeliveryMethod,
  insertPromotionDeliveryMethod2,
  getPromotionDeliveryMethods,
  getListPromotionDeliveryMethodByIdPromotion,
  // getPromotionDeliveryMethod,
  getPromotionDeliveryMethod2,
  updatePatchPromotionDeliveryMethod2,
  // updatePatchPromotionDeliveryMethod,
  // deletePromotionDeliveryMethod
  deletePromotionDeliveryMethod2
} = require('../controllers/promotionDeliveryMethod');

// promotionDeliveryMethods.post('/', insertPromotionDeliveryMethod);
promotionDeliveryMethods.post('/', insertPromotionDeliveryMethod2);
promotionDeliveryMethods.get('/', getPromotionDeliveryMethods);
// promotionDeliveryMethods.get('/:id', getPromotionDeliveryMethod);
promotionDeliveryMethods.get('/:id', getPromotionDeliveryMethod2);
promotionDeliveryMethods.get('/promo/:idPromotion', getListPromotionDeliveryMethodByIdPromotion);
// promotionDeliveryMethods.patch('/:id', updatePatchPromotionDeliveryMethod);
promotionDeliveryMethods.patch('/:id', updatePatchPromotionDeliveryMethod2);
// promotionDeliveryMethods.delete('/:id', deletePromotionDeliveryMethod);
promotionDeliveryMethods.delete('/:id', deletePromotionDeliveryMethod2);

module.exports = promotionDeliveryMethods;
