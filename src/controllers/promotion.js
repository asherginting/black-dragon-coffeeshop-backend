const promotionModel = require('../models/promotion');
const showApi = require('../helpers/showResponse');
// const upload = require('../helpers/upload').single('image')
// const auth = require('../helpers/auth')
const validation = require('../helpers/validation');
const validator = require('validator');
const {
  request
} = require('express');
const {
  response
} = require('express');

// const { APP_URL } = process.env

const getPromotions = async (request, response) => {
  let {
    name,
    page,
    limit,
    sort,
    order
  } = request.query;
  name = name || '';
  sort = sort || 'pr.created_at';
  const filledFilter = ['discount_value', 'delivery_method_id'];
  const filter = {};
  page = ((page != null && page !== '') ? parseInt(page) : 1);
  limit = ((limit != null && limit !== '') ? parseInt(limit) : 5);
  order = order || 'desc';
  let pagination = {
    page,
    limit
  };
  let route = 'promotions?';
  let searchParam = '';
  if (name) {
    searchParam = `name=${name}`;
  }

  filledFilter.forEach((item) => {
    if (request.query[item]) {
      filter[item] = request.query[item];
      if (searchParam === '') {
        searchParam += `${item}=${filter[item]}`;
      } else {
        searchParam += `&${item}=${filter[item]}`;
      }
    }
  });
  route += searchParam;

  const errValidation = await validation.validationPagination(pagination);
  if (errValidation == null) {
    const offset = (page - 1) * limit;
    // console.log(offset);
    const data = {
      name,
      filter,
      limit,
      offset,
      sort,
      order
    };
    const dataPromo = await promotionModel.getDataPromotions(data);
    // console.log(dataPromo);
    if (dataPromo.length > 0) {
      const result = await promotionModel.countDataPromotions(data);
      try {
        const {
          total
        } = result[0];
        pagination = {
          ...pagination,
          total: total,
          route: route
        };
        return showApi.showResponseWithPagination(response, 'List Data Promotions', dataPromo, pagination);
      } catch (err) {
        return showApi.showResponse(response, err.message, null, 500);
      }
    } else {
      return showApi.showResponse(response, 'Data not found', null, 404);
    }
    // const getPromotions = async (request, response) => {
    //   let {
    //     name,
    //     page,
    //     limit,
    //     sort,
    //     order
    //   } = request.query;
    //   name = name || '';
    //   sort = sort || 'pr.created_at';
    //   const filledFilter = ['discount_value', 'delivery_method_id'];
    //   const filter = {};
    //   page = ((page != null && page !== '') ? parseInt(page) : 1);
    //   limit = ((limit != null && limit !== '') ? parseInt(limit) : 5);
    //   order = order || 'desc';
    //   let pagination = {
    //     page,
    //     limit
    //   };
    //   let route = 'promotions?';
    //   let searchParam = '';
    //   if (name) {
    //     searchParam = `name=${name}`;
    //   }

    //   filledFilter.forEach((item) => {
    //     if (request.query[item]) {
    //       filter[item] = request.query[item];
    //       if (searchParam === '') {
    //         searchParam += `${item}=${filter[item]}`;
    //       } else {
    //         searchParam += `&${item}=${filter[item]}`;
    //       }
    //     }
    //   });
    //   route += searchParam;

    //   const errValidation = await validation.validationPagination(pagination);
    //   if (errValidation == null) {
    //     const offset = (page - 1) * limit;
    //     console.log(offset);
    //     const data = {
    //       name,
    //       filter,
    //       limit,
    //       offset,
    //       sort,
    //       order
    //     };
    //     const dataPromo = await promotionModel.getDataPromotions(data);
    //     console.log(dataPromo);
    //     if (dataPromo.length > 0) {
    //       const result = await promotionModel.countDataPromotions(data);
    //       try {
    //         const {
    //           total
    //         } = result[0];
    //         pagination = {
    //           ...pagination,
    //           total: total,
    //           route: route
    //         };
    //         return showApi.showResponseWithPagination(response, 'List Data Promotions', dataPromo, pagination);
    //       } catch (err) {
    //         return showApi.showResponse(response, err.message, null, 500);
    //       }
  } else {
    showApi.showResponse(response, 'Pagination was not valid.', null, validation.validationPagination(pagination), 400);
  }
};

const getListPromotions = async (request, response) => {
  try {
    const {
      name,
      discount_value,
      date,
      page,
      normal_price,
      limit,
      sort,
      order
    } = request.query;

    if (!page) {
      showApi.showResponse(response, 'Page must be filled!', null, null, 400);
    }

    if (!limit) {
      showApi.showResponse(response, 'Limit must be filled!', null, null, 400);
    }

    const dataFilter = {
      name: name || null,
      discount_value: discount_value || null,
      date: date || null,
      normal_price: normal_price || null,
      page,
      limit,
      sort: sort || null,
      order: order || 'asc'
    };

    const resultDataPromo = await promotionModel.getListDataPromotions(dataFilter);
    if (resultDataPromo.length > 0) {
      const total = await promotionModel.countListPromotions(dataFilter);
      const pageInfo = showApi.pageInfoCreator(total[0].total, 'promotions', dataFilter);
      return showApi.returningSuccess(response, 200, 'Data promotions retrieved successfully!', showApi.dataMapping(resultDataPromo), pageInfo);
    } else {
      return showApi.showResponse(response, 'Detail Promotion not found!', null, null, 404);
    }
  } catch (err) {
    return showApi.showResponse(response, err.message, null, null, 500);
  }
};

const getPromotion = async (request, response) => {
  const {
    id
  } = request.params;

  const result = await promotionModel.getDataPromotion(id);
  if (result.length > 0) {
    return showApi.showResponse(response, 'Detail Promotion', showApi.dataMapping(result)[0]);
  } else {
    return showApi.showResponse(response, 'Detail Promotion not found!', null, null, 404);
  }
};

const insertPromotion = async (request, response) => {
  try {
    const {
      name,
      code,
      description,
      normal_price,
      discount_value,
      available_start_at,
      available_end_at
    } = request.body;
    const data = {
      name,
      code,
      description,
      normal_price,
      discount_value,
      available_start_at,
      available_end_at
    };
    // console.log(data);
    if (request.file) {
      data.image = request.file.path;
    }

    const errValidation = validation.validationDataPromotion(data);

    if (errValidation === null) {
      const insert = await promotionModel.insertDataPromotion(data);
      if (insert.affectedRows > 0) {
        const result = await promotionModel.getDataPromotion(insert.insertId);
        return showApi.showResponse(response, 'Data Promotion created successfully!', showApi.dataMapping(result)[0]);
      } else {
        return showApi.showResponse(response, 'Data Promotion failed to create !', null, null, 400);
      }
    } else {
      return showApi.showResponse(response, 'Data Promotion not valid !', null, errValidation, 400);
    }
  } catch (error) {
    return showApi.showResponse(response, error.message, null, null, 500);
  }
};

const updatePromotion = async (request, response) => {
  try {
    const {
      id
    } = request.params;
    if (!validator.isEmpty(id)) {
      if (validator.isNumeric(id)) {
        const getDataPromotion = await promotionModel.getDataPromotion(id);
        if (getDataPromotion.length > 0) {
          const filled = ['name', 'code', 'description', 'normal_price', 'discount_value', 'available_start_at', 'available_end_at'];
          const data = {};
          filled.forEach((value) => {
            if (request.body[value]) {
              if (request.file) {
                data.image = request.file.path;
              }
              data[value] = request.body[value];
            }
          });
          const result = await promotionModel.updateDataPromotion(data, id);
          if (result.affectedRows > 0) {
            const result = await promotionModel.getDataPromotion(id);
            return showApi.showResponse(response, 'Data Promotion updated successfully!', showApi.dataMapping(result)[0]);
          } else {
            return showApi.showResponse(response, 'Data Promotion failed to update !', null, null, 400);
          }
        } else {
          return showApi.showResponse(response, 'Data not found!', null, null, 400);
        }
      } else {
        return showApi.showResponse(response, 'Id must be a number!', null, null, 400);
      }
    }
  } catch (error) {
    return showApi.showResponse(response, error.message, null, null, 500);
  }
};

const deletePromotion = async (request, response) => {
  try {
    const {
      id
    } = request.params;

    if (!validator.isEmpty(id)) {
      if (validator.isNumeric(id)) {
        const getDataPromotion = await promotionModel.getDataPromotion(id);
        if (getDataPromotion.length > 0) {
          const result = await promotionModel.deleteDataPromotion(id);
          if (result.affectedRows > 0) {
            return showApi.showResponse(response, 'Data Promotion deleted successfully!');
          } else {
            return showApi.showResponse(response, 'Data Promotion failed to delete !');
          }
        } else {
          return showApi.showResponse(response, 'Data not found!', null, null, 400);
        }
      } else {
        return showApi.showResponse(response, 'Id must be a number!', null, null, 400);
      }
    } else {
      return showApi.showResponse(response, 'Id must be filled!', null, null, 400);
    }
  } catch (error) {
    return showApi.showResponse(response, error.message, null, null, 500);
  }
};

module.exports = {
  getListPromotions,
  getPromotion,
  insertPromotion,
  updatePromotion,
  deletePromotion
};
