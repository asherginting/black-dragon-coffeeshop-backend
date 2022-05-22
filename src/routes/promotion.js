/* eslint-disable no-unused-vars */
const promotions = require('express').Router();
const verify = require('jsonwebtoken/verify');
// const { validatePromotion } = require('../helpers/validation')
// const { verifyUser } = require('../helpers/auth');
const {
  verifyAdmin
} = require('../middlewares/auth');
const {
  uploadMiddleware
} = require('../middlewares/upload');

const {
  getListPromotions,
  // getPromotions,
  getPromotion,
  insertPromotion,
  updatePromotion,
  deletePromotion
} = require('../controllers/promotion');

promotions.get('/', getListPromotions);
// promotions.get('/', getPromotions);
promotions.get('/:id', getPromotion);
promotions.post('/', verifyAdmin, uploadMiddleware('image'), insertPromotion);
promotions.patch('/:id', verifyAdmin, uploadMiddleware('image'), updatePromotion);
promotions.delete('/:id', verifyAdmin, uploadMiddleware('image'), deletePromotion);

module.exports = promotions;
