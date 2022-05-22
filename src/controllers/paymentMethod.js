/* eslint-disable no-unused-vars */
const paymentMethodModel = require('../models/paymentMethod');
const showApi = require('../helpers/showResponse');
const auth = require('../helpers/auth');
const validation = require('../helpers/validation');
const { request } = require('express');
const validator = require('validator');

const { APP_URL } = process.env;

const getPaymentMethods = async (request, response) => {
  let { name, page, limit, sort, order } = request.query;
  name = name || '';
  sort = sort || 'created_at';
  page = (page !== null && page !== '') && 1;
  limit = (limit !== null && limit !== '') && 10;
  order = order || 'desc';
  let pagination = {
    page,
    limit
  };

  const route = 'paymentMethod?';
  let searchParam = '';
  if (name) {
    searchParam = `name=${name}`;
  }

  if (isNaN(parseInt(page))) {
    return showApi.showResponse(response, 'Page must be a number.', null, null, 400);
  } else if (page === 0) {
    return showApi.showResponse(response, 'Page must be grather then 0.', null, null, 400);
  }

  if (isNaN(parseInt(limit))) {
    return showApi.showResponse(response, 'Limit must be a number.', null, null, 400);
  } else if (limit === 0) {
    return showApi.showResponse(response, 'Limit must be grather than 0.', null, null, 400);
  }

  const offset = (page - 1) * limit;
  console.log(offset);
  const data = { name, limit, offset, sort, order };

  const dataPaymentMethods = await paymentMethodModel.getDataPaymentMethods(data);
  if (dataPaymentMethods.length > 0) {
    const result = await paymentMethodModel.countDataPaymentMethods(data);
    const { total } = result[0];
    pagination = { ...pagination, total: total, route: route };
    return showApi.showResponseWithPagination(response, 'List Data Payment Method', dataPaymentMethods, pagination);
  }
};

const getListDataPaymentMethod = async (request, response) => {
  let { name, page, limit, sort, order } = request.query;

  page = page || '1';
  limit = limit || '5';
  if (!validator.isEmpty(page)) {
    if (!validator.isNumeric(page)) {
      return showApi.showResponse(response, 'Page must be z number!', null, null, 400);
    }
  }

  if (!validator.isEmpty(limit)) {
    if (!validator.isNumeric(page)) {
      return showApi.showResponse(response, 'Limit must be a number!', null, null, 400);
    }
  }

  const dataFilter = {
    name: name || null,
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sort || null,
    order: order || null
  };

  const dataPaymentMethod = await paymentMethodModel.getDataListPaymentMethods(dataFilter);
  if (dataPaymentMethod.length > 0) {
    const total = await paymentMethodModel.countDataListPaymentMethods(dataFilter);
    const pageInfo = showApi.pageInfoCreator(total[0].total, 'paymentMethod', dataFilter);
    return showApi.returningSuccess(response, 200, 'Data payment method retrieved successfully!', dataPaymentMethod, pageInfo);
  } else {
    return showApi.showResponse(response, 'Data not found!', null, null, 400);
  }
};

const getPaymentMethod = async (request, response) => {
  const { id } = request.params;

  if (!validator.isEmpty(id)) {
    if (validator.isNumeric(id)) {
      const result = await paymentMethodModel.getDataPaymentMethod(id);
      if (result.length > 0) {
        return showApi.showResponse(response, 'Detail Payment Method', result[0]);
      } else {
        return showApi.showResponse(response, 'Data not found', null, null, 404);
      }
    } else {
      return showApi.showResponse(response, 'Id must be a number.', null, null, 404);
    }
  } else {
    return showApi.showResponse(response, 'id must be filled.', null, null, 404);
  }
};

const insertPaymentNethod = async (request, response) => {
  const data = {
    name: request.body.name
  };

  if (validator.isEmpty(data.name)) {
    return showApi.showResponse(response, 'Name must be filled.', null, null, 400);
  }

  const insert = await paymentMethodModel.insertDataPaymentMethod(data);
  if (insert.affectedRows > 0) {
    const result = await paymentMethodModel.getDataPaymentMethod(insert.insertId);
    showApi.showResponse(response, 'Data payment created successfully!', result[0]);
  } else {
    showApi.showResponse(response, 'Data payment method failed to create!', null, null, 500);
  }
};

const updatePaymentMethod = async (request, response) => {
  const { id } = request.params;

  if (!validator.isEmpty(id)) {
    if (validator.isNumeric(id)) {
      const dataPaymentMethod = await paymentMethodModel.getDataPaymentMethod(id);
      if (dataPaymentMethod.length > 0) {
        const data = {
          name: request.body.name
        };

        if (validator.isEmpty(data.name)) {
          return showApi.showResponse(response, 'Name must be filled.', null, null, 400);
        }
        const update = await paymentMethodModel.updateDataPaymentMethod(data, id);
        if (update.affectedRows > 0) {
          const result = await paymentMethodModel.getDataPaymentMethod(id);
          showApi.showResponse(response, 'Data payment method updated successfully!', result[0]);
        } else {
          showApi.showResponse(response, 'Data payment method failed to update!', 500);
        }
      } else {
        return showApi.showResponse(response, 'Data not found', null, null, 400);
      }
    } else {
      return showApi.showResponse(response, 'Id must be a number', null, null, 400);
    }
  } else {
    return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
  }
};

const deletePaymentMethod = async (request, response) => {
  const { id } = request.params;

  if (!validator.isEmpty(id)) {
    if (validator.isNumeric(id)) {
      const getDataPaymentMethod = await paymentMethodModel.getDataPaymentMethod(id);
      if (getDataPaymentMethod.length > 0) {
        const result = await paymentMethodModel.deleteDataPaymentMethod(id);
        if (result.affectedRows > 0) {
          const result = await paymentMethodModel.getDataPaymentMethod(id);
          showApi.showResponse(response, 'Data payment method deleted successfully!', result[0]);
        } else {
          showApi.showResponse(response, 'Data payment method failed to delete!', null, 500);
        }
      } else {
        showApi.showResponse(response, 'Data not found!', null, 404);
      }
    } else {
      return showApi.showResponse(response, 'Id must be a number', null, null, 400);
    }
  } else {
    return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
  }
};

module.exports = { getPaymentMethods, getListDataPaymentMethod, getPaymentMethod, insertPaymentNethod, updatePaymentMethod, deletePaymentMethod };
