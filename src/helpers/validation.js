// const {
//   body,
//   validationResult
// } = require('express-validator');
const categoryModel = require('../models/category');
const deliveryMethodModel = require('../models/deliveryMethod');
const sizeModel = require('../models/size');
const validator = require('validator');
const productModel = require('../models/product');
const userModel = require('../models/user');

exports.validationDataProducts = async (data) => {
  let result = null;
  if (data.name === null || data.name === '') {
    result = {
      name: 'Name must be filled'
    };
  }

  console.log(data);

  if (data.category_id === null || data.category_id === '') {
    result = {
      ...result,
      category_id: 'Id category must be filled.'
    };
  } else {
    const getDataCategory = await categoryModel.getDataCategory(data.category_id);
    if (getDataCategory.length === 0) {
      result = {
        category: 'Category not found.'
      };
    }
  }

  // if (data.delivery_method_id === null || data.delivery_method_id === '') {
  //   result = {
  //     ...result,
  //     category_id: 'id delivery method must be filled.'
  //   };
  // } else {
  //   const getDeliveryMethod = await deliveryMethodModel.getDataDeliveryMethod(data.delivery_method_id);
  //   if (getDeliveryMethod === 0) {
  //     result = {
  //       delivery_method_id: 'id delivery method not found.'
  //     };
  //   }
  // }

  // if (data.size_id === null || data.size_id === '') {
  //   result = {
  //     ...result,
  //     size_id: 'id size must be filled.'
  //   };
  // } else {
  //   const getDataSize = await sizeModel.getDataSize(data.size_id);
  //   if (getDataSize === 0) {
  //     result = {
  //       size: 'id size not found.'
  //     };
  //   }
  // }

  if (data.description === null || data.description === '') {
    result = {
      ...result,
      description: 'Description must be filled.'
    };
  }

  if (data.price === null || data.price === '') {
    result = {
      ...result,
      price: 'Price must be filled'
    };
  } else if (isNaN(parseInt(data.price))) {
    result = {
      ...result,
      price: 'Price must be a number.'
    };
  } else if (parseInt(data.price) === 0) {
    result = {
      ...result,
      price: 'Price must be must be greater than 0.'
    };
  }

  if (data.stocks === null || data.stocks === '') {
    result = {
      ...result,
      stocks: 'Stock must be filled'
    };
  } else if (isNaN(parseInt(data.stocks))) {
    result = {
      ...result,
      stocks: 'Stock must be a number.'
    };
  } else if (parseInt(data.stocks) === 0) {
    result = {
      ...result,
      stocks: 'Stock must be must be greater than 0.'
    };
  }

  if (data.delivery_time_start === null || data.delivery_time_start === '') {
    result = {
      ...result,
      delivery_time_start: 'Delivery time start must be filled'
    };
  }

  if (data.delivery_time_end === null || data.delivery_time_end === '') {
    result = {
      ...result,
      delivery_time_end: 'Delivery time end must be filled'
    };
  }

  return result;
};

exports.validationDataTax = async (data) => {
  let result = null;
  if (data.name === null || data.name === '') {
    result = {
      ...result,
      name: 'Name must be filled'
    };
  }
  if (!data.value) {
    result = {
      ...result,
      value: 'Invalid input'
    };
  }
  return result;
};

exports.validationDataPromotionDeliveryMethods = async (data) => {
  let result = null;
  if (validator.isEmpty(data.promotion_id)) {
    result = {
      promotion_id: 'promotion_id must be filled'
    };
  } else if (!validator.isNumeric(data.promotion_id)) {
    result = {
      promotion_id: 'Invalid input, promotion_id must be a number!'
    };
  }
  // if (!data.promotion_id) {
  //   result = {
  //     promotion_id: 'Invalid input, promotion_id must be a number!'
  //   };
  // }

  if (validator.isEmpty(data.delivery_method_id)) {
    result = {
      ...result,
      delivery_method_id: 'delivery_method_id must be filled'
    };
  } else if (!validator.isNumeric(data.delivery_method_id)) {
    result = {
      ...result,
      delivery_method_id: 'Invalid input, delivery_method_id must be a number!'
    };
  }

  return result;
};

exports.validationDataSize = async (data) => {
  let result = null;
  if (data.name === null || data.name === '') {
    result = {
      name: 'Name must be filled'
    };
  }
  if (!data.extra_price) {
    result = {
      ...result,
      price: 'Price must be filled'
    };
  } else if (!validator.isNumeric(data.extra_price)) {
    result = {
      ...result,
      price: 'Price must be a number'
    };
  }

  return result;
};

exports.validationDataDeliveryMethod = async (data) => {
  let result = null;
  if (data.name === null || data.name === '') {
    result = {
      ...result,
      name: 'Name must be filled'
    };
  }
  if (!data.cost) {
    result = {
      ...result,
      cost: 'Invalid input'
    };
  }
  return result;
};

exports.validationDataPromotionSizes = async (data) => {
  let result = null;
  if (data.promotion_id === null || data.promotion_id === undefined) {
    result = {
      ...result,
      promotion_id: 'promotion_id must be filled'
    };
  }
  if (!data.promotion_id) {
    result = {
      ...result,
      promotion_id: 'Invalid input, promotion_id must be a number!'
    };
  }

  if (data.size_id === null || data.size_id === undefined) {
    result = {
      ...result,
      size_id: 'size_id must be filled'
    };
  }
  if (!data.size_id) {
    result = {
      ...result,
      size_id: 'Invalid input, size_id must be a number!'
    };
  }

  return result;
};

exports.validationPagination = (pagination) => {
  let result = null;
  const {
    page,
    limit
  } = pagination;

  if (isNaN(parseInt(page))) {
    result = {
      ...result,
      page: 'Page must be a number.'
    };
  } else if (page === 0) {
    result = {
      ...result,
      page: 'Page must be grather then 0.'
    };
  }

  if (isNaN(parseInt(limit))) {
    result = {
      ...result,
      limit: 'Limit must be a number.'
    };
  } else if (limit === 0) {
    result = {
      ...result,
      limit: 'Limit must be grather than 0.'
    };
  }
  return result;
};

exports.validationLogin = async (data) => {
  let result = null;

  if (validator.isEmpty(data.email)) {
    result = {
      email: 'Email must be filled.'
    };
  }

  if (data.delivery_method_id === null || data.delivery_method_id === '') {
    result = {
      ...result,
      category_id: 'id delivery method must be filled.'
    };
  } else {
    const getDeliveryMethod = await deliveryMethodModel.getDataDeliveryMethod(
      data.delivery_method_id
    );
    if (getDeliveryMethod === 0) {
      result = {
        delivery_method_id: 'id delivery method not found.'
      };
    }
  }

  if (data.size_id === null || data.size_id === '') {
    result = {
      ...result,
      size_id: 'id size must be filled.'
    };
  } else {
    const getDataSize = await sizeModel.getDataSize(data.size_id);
    if (getDataSize === 0) {
      result = {
        size: 'id size not found.'
      };
    }
  }

  if (data.description === null || data.description === '') {
    result = {
      ...result,
      description: 'Description must be filled.'
    };
  }

  if (data.price === null || data.price === '') {
    result = {
      ...result,
      price: 'Price must be filled'
    };
  } else if (isNaN(parseInt(data.price))) {
    result = {
      ...result,
      price: 'Price must be a number.'
    };
  } else if (parseInt(data.price) === 0) {
    result = {
      ...result,
      price: 'Price must be must be greater than 0.'
    };
  }

  if (data.stocks === null || data.stocks === '') {
    result = {
      ...result,
      stocks: 'Stock must be filled'
    };
  } else if (isNaN(parseInt(data.stocks))) {
    result = {
      ...result,
      stocks: 'Stock must be a number.'
    };
  } else if (parseInt(data.stocks) === 0) {
    result = {
      ...result,
      stocks: 'Stock must be must be greater than 0.'
    };
  }

  if (data.delivery_time_start === null || data.delivery_time_start === '') {
    result = {
      ...result,
      delivery_time_start: 'Delivery time start must be filled'
    };
  }

  if (data.delivery_time_end === null || data.delivery_time_end === '') {
    result = {
      ...result,
      delivery_time_end: 'Delivery time end must be filled'
    };
  }

  return result;
};

exports.validationDataCategory = (data) => {
  let result = null;
  if (data.name === null || data.name === '') {
    result = {
      name: 'Name must be filled'
    };
  }
  return result;
};

exports.validationPagination = (pagination) => {
  let result = null;
  const {
    page,
    limit
  } = pagination;

  if (isNaN(parseInt(page))) {
    result = {
      ...result,
      page: 'Page must be a number.'
    };
  } else if (page === 0) {
    result = {
      ...result,
      page: 'Page must be grather then 0.'
    };
  }

  if (isNaN(parseInt(limit))) {
    result = {
      ...result,
      limit: 'Limit must be a number.'
    };
  } else if (limit === 0) {
    result = {
      ...result,
      limit: 'Limit must be grather than 0.'
    };
  }
  return result;
};
exports.validationProductDeliveryMethod = async (data) => {
  let result = null;
  console.log(data.product_id);

  if (validator.isEmpty(data.product_id)) {
    result = {
      product_id: 'id product must be filled.'
    };
  } else if (!validator.isNumeric(data.product_id)) {
    result = {
      product_id: 'id product must be a number.'
    };
  } else {
    const getDataProduct = await productModel.getDataProduct(data.product_id);
    if (getDataProduct.length === 0) {
      result = {
        product_id: 'Data product not found.'
      };
    }
  }

  if (validator.isEmpty(data.delivery_method_id)) {
    result = {
      ...result,
      delivery_method_id: 'id delivery method must be filled.'
    };
  } else if (!validator.isNumeric(data.delivery_method_id)) {
    result = {
      ...result,
      delivery_method_id: 'Id delivery method must be a number.'
    };
  } else {
    const dataProductDeliveryMethod = await deliveryMethodModel.getDataDeliveryMethod(data.delivery_method_id);
    if (dataProductDeliveryMethod.length === 0) {
      result = {
        ...result,
        delivery_method_id: 'Data delivery method not found.'
      };
    }
  }
  return result;
};

// exports.validateProduct = [
//     body('name')
//     .trim()
//     .escape()
//     .not()
//     .isEmpty()
//     .withMessage('name must be filled!'),
//     // body('price')
//     // .trim()
//     // .escape()
//     // .not()
//     // .isEmpty()
//     // .withMessage('price must be filled!')
//     // .isNumeric()
//     // .withMessage('price must be a number'),
//     // body('description')
//     // .trim()
//     // .escape()
//     // .not()
//     // .isEmpty()
//     // .withMessage('description must be filled !'),
//     // body('stocks')
//     // .trim()
//     // .escape()
//     // .not()
//     // .isEmpty()
//     // .withMessage('stock must be filled! '),
//     // body('deliveryTimeStart')
//     // .trim()
//     // .escape()
//     // .not()
//     // .isEmpty()
//     // .withMessage('delivery time start must be filled! '),
//     // body('deliveryTimeEnd')
//     // .trim()
//     // .escape()
//     // .not()
//     // .isEmpty()
//     // .withMessage('delivery time end must be filled! '),
//     // body('deliveryMethodId')
//     // .trim()
//     // .escape()
//     // .not()
//     // .isEmpty()
//     // .withMessage('delivery method id must be filled! '),
//     // body('sizeId')
//     // .trim()
//     // .escape()
//     // .not()
//     // .isEmpty()
//     // .withMessage('size id must be filled! '),
//     (req, res, next) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty())
//             return res.status(422).json({ errors: errors.array() });
//         next();
//     },

exports.validationLogin = async (data) => {
  let result = null;

  if (validator.isEmpty(data.email)) {
    result = {
      email: 'Email must be filled.'
    };
  }
  if (validator.isEmpty(data.password)) {
    result = {
      ...result,
      password: 'Password must be filled.'
    };
  }
  return result;
};

exports.validationRegister = async (data) => {
  let result = null;

  if (!data.email || data.email === '') {
    result = {
      email: 'Email must be filled.'
    };
  } else {
    const resultEmail = await userModel.getDataUerByEmail(data.email);
    console.log(resultEmail);
    if (resultEmail.length > 0) {
      result = {
        email: 'Email has already used.'
      };
    }

    if (!data.phone || data.phone === '') {
      result = {
        ...result,
        fullName: 'phone must be filled.'
      };
    }

    if (!data.password || data.password === '') {
      result = {
        ...result,
        password: 'Password must be filled.'
      };
    }
    return result;
  }
};

exports.validationLogin = async (data) => {
  let result = null;

  if (!data.email || data.email === '') {
    result = {
      email: 'Email must be filled.'
    };
  }
  if (!data.password || data.password === '') {
    result = {
      ...result,
      password: 'Password must be filled.'
    };
  }
  return result;
};

exports.validationSizeForProduct = async (data) => {
  let result = null
  console.log("masuk validasi size for product")
  if (validator.isEmpty(data.product_id)) {
    result = { product_id: 'product_id must be filled.' }
  } else if (!validator.isNumeric(data.product_id)) {
    result = { product_id: 'product_id must be a number.' }
  } else {
    const dataProduct = await productModel.getDataProduct(data.product_id)
    if (dataProduct.length === 0) {
      result = { product_id: 'Data product not found.' }
    }
  }

  if (validator.isEmpty(data.size_id)) {
    result = { ...result, size_id: 'id size must be filled.' }
  } else if (!validator.isNumeric(data.size_id)) {
    result = { ...result, size_id: 'Id size must be a number.' }
  } else {
    const dataSizeOfProduct = await sizeModel.getDataSize(data.size_id)
    if (dataSizeOfProduct.length === 0) {
      result = { ...result, size_id: 'Data size not found.' }
    }
  }
  return result
}

exports.validationRegister = async (data) => {
  let result = null;

  if (!data.phone || data.phone === '') {
    result = {
      ...result,
      phone: 'phone must be filled.'
    };
  }

  if (!data.password || data.password === '') {
    result = {
      ...result,
      password: 'Password must be filled.'
    };
  }

  if (!data.display_name || data.display_name === '') {
    result = {
      ...result,
      display_name: 'Display name must be filled.'
    };
  }

  if (!data.first_name || data.first_name === '') {
    result = {
      ...result,
      first_name: 'Firstname must be filled.'
    };
  }

  if (!data.last_name || data.last_name === '') {
    result = {
      ...result,
      last_name: 'Lastname must be filled.'
    };
  }
  if (!data.gender || data.gender === '') {
    result = {
      ...result,
      gender: 'Gender must be filled.'
    };
  }
  if (!data.birthdate || data.birthdate === '') {
    result = {
      ...result,
      birthdate: 'Birthdate must be filled.'
    };
  }
  return result;
};

exports.validationDataPromotion = (data) => {
  let result = null;
  const {
    name,
    code,
    description,
    normal_price,
    discount_value,
    available_start_at,
    available_end_at
  } = data;
  if (validator.isEmpty(name)) {
    result = {
      name: 'Name must be filled.'
    };
  }
  if (validator.isEmpty(code)) {
    result = {
      ...result,
      code: 'Code must be filled!'
    };
  }
  if (validator.isEmpty(description)) {
    result = {
      ...result,
      description: 'Description must be filled!'
    };
  }
  if (validator.isEmpty(normal_price)) {
    result = {
      ...result,
      normal_price: 'Normal price must be filled!'
    };
  } else if (!validator.isNumeric(normal_price)) {
    result = {
      ...result,
      normal_price: 'Normal price must be a number!'
    };
  }
  if (validator.isEmpty(discount_value)) {
    result = {
      ...result,
      discount: 'Discount value must be filled!'
    };
  } else if (!validator.isNumeric(data.discount_value)) {
    result = {
      ...result,
      discount_value: 'Discount value must be a number!'
    };
  }

  if (validator.isEmpty(available_start_at)) {
    result = {
      ...result,
      available_start_at: 'Available start at must be filled!'
    };
  } else if (!validator.isDate(available_start_at)) {
    result = {
      ...result,
      available_start_at: 'Available start at must be a date!'
    };
  }

  if (validator.isEmpty(available_end_at)) {
    result = {
      ...result,
      available_end_at: 'Available end at must be filled!'
    };
  } else if (!validator.isDate(available_end_at)) {
    result = {
      ...result,
      available_end_at: 'Available end at must be a date!'
    };
  }
  return result;
};

// exports.validateProduct = [
//     body('name')
//     .trim()
//     .escape()
//     .not()
//     .isEmpty()
//     .withMessage('name must be filled!'),
//     // body('price')
//     // .trim()
//     // .escape()
//     // .not()
//     // .isEmpty()
//     // .withMessage('price must be filled!')
//     // .isNumeric()
//     // .withMessage('price must be a number'),
//     // body('description')
//     // .trim()
//     // .escape()
//     // .not()
//     // .isEmpty()
//     // .withMessage('description must be filled !'),
//     // body('stocks')
//     // .trim()
//     // .escape()
//     // .not()
//     // .isEmpty()
//     // .withMessage('stock must be filled! '),
//     // body('deliveryTimeStart')
//     // .trim()
//     // .escape()
//     // .not()
//     // .isEmpty()
//     // .withMessage('delivery time start must be filled! '),
//     // body('deliveryTimeEnd')
//     // .trim()
//     // .escape()
//     // .not()
//     // .isEmpty()
//     // .withMessage('delivery time end must be filled! '),
//     // body('deliveryMethodId')
//     // .trim()
//     // .escape()
//     // .not()
//     // .isEmpty()
//     // .withMessage('delivery method id must be filled! '),
//     // body('sizeId')
//     // .trim()
//     // .escape()
//     // .not()
//     // .isEmpty()
//     // .withMessage('size id must be filled! '),
//     (req, res, next) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty())
//             return res.status(422).json({ errors: errors.array() });
//         next();
//     },

//     (req, res, next) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty())
//             return res.status(422).json({ errors: errors.array() });
//         next();
//     }

// ];

exports.noNullData = (data, rules) => {
  for (const key in data) {
    if (data[key] === null) {
      const ruleName = rules[key].split('|').shift();
      return `Your ${key} must be ${ruleName === key ? 'have a valid type' : ruleName}`;
    }
  }

  return '';
};
