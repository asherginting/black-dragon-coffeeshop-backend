const deliveryMethodModel = require('../models/deliveryMethod');
const showApi = require('../helpers/showResponse');
const validation = require('../helpers/validation');
const validator = require('validator');

const insertDataDeliveryMethod = async (req, res) => {
  const data = {
    name: req.body.name,
    cost: parseInt(req.body.cost)
  };
  const errValidation = await validation.validationDataDeliveryMethod(data);

  if (errValidation === null) {
    const dataDeliveryMethod = {
      name: req.body.name,
      cost: parseInt(req.body.cost)
    };
    const resultDataDeliveryMethod = await deliveryMethodModel.insertDataDeliveryMethod(dataDeliveryMethod);
    let success = false;
    if (resultDataDeliveryMethod.affectedRows > 0) {
      success = true;
    }
    if (success) {
      const result = await deliveryMethodModel.getDataDeliveryMethod(resultDataDeliveryMethod.insertId);
      showApi.showResponse(res, 'Data delivery method created successfully!', result);
    } else {
      showApi.showResponse(res, 'Data delivery method failed to create!', null, null, 500);
    }
  } else {
    showApi.showResponse(res, 'Data delivery method not valid', null, errValidation, 400);
  }
};

const getDataDeliveryMethods = async (req, res) => {
  let { name, page, limit } = req.query;
  name = name || '';
  page = ((page !== null && page !== '') ? parseInt(page) : 1);
  limit = ((limit !== null && limit !== '') ? parseInt(limit) : 5);
  let pagination = { page, limit };
  let route = 'DeliveryMethods?';
  let searchParam = '';
  if (name) {
    searchParam = `name=${name}`;
  }
  route += searchParam;

  const errValidation = await validation.validationPagination(pagination);
  if (errValidation === null) {
    const offset = (page - 1) * limit;
    console.log(offset);
    const data = { name, limit, offset };
    const dataDeliveryMethod = await deliveryMethodModel.getDataDeliveryMethods(data);

    if (dataDeliveryMethod.length > 0) {
      const result = await deliveryMethodModel.countDataDeliveryMethods(data);
      try {
        const { total } = result[0];
        pagination = { ...pagination, total: total, route: route };
        return showApi.showResponseWithPagination(res, 'List Data Delivery Method', dataDeliveryMethod, pagination);
      } catch (err) {
        return showApi.showResponse(res, err.message, null, null, 500);
      }
    } else {
      return showApi.showResponse(res, 'Data not found', null, null, 404);
    }
  } else {
    showApi.showResponse(res, 'Pagination was not valid.', null, validation.validationPagination(pagination), 400);
  }
};

const getDataDeliveryMethod = async (req, res) => {
  const { id } = req.params;
  if (validator.isEmpty(id)) {
    return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
  }
  if (validator.isNumeric(id)) {
    const result = await deliveryMethodModel.getDataDeliveryMethod(id);
    if (result.length > 0) {
      return showApi.showResponse(res, 'Detail delivery method', result[0]);
    } else {
      return showApi.showResponse(res, 'Detail delivery method not found!', null, null, 404);
    }
  } else {
    return showApi.showResponse(response, 'Id must be a number', null, null, 400);
  }
};

const updateDataDeliveryMethod = async (request, response) => {
  const { id } = request.params;

  if (id) {
    if (!isNaN(id)) {
      const dataDeliveryMethod = await deliveryMethodModel.getDataDeliveryMethod(id);
      if (dataDeliveryMethod.length > 0) {
        const data = {
          name: request.body.name,
          cost: parseInt(request.body.cost)
        };
        console.log(data);
        const errValidation = await validation.validationDataDeliveryMethod(data);

        if (errValidation === null) {
          const resultDataDeliveryMethod = await deliveryMethodModel.updateDataDeliveryMethod(data, id);

          let success = false;
          if (resultDataDeliveryMethod.affectedRows > 0) {
            success = true;
          }
          if (success) {
            const result = await deliveryMethodModel.getDataDeliveryMethod(id);
            showApi.showResponse(response, 'Data delivery method update success!', result);
          } else {
            showApi.showResponse(response, 'Data delivery method to update!', null, null, 500);
          }
        } else {
          showApi.showResponse(response, 'Data delivery method not valid', null, errValidation, 400);
        }
      } else {
        return showApi.showResponse(response, 'Data delivery method not found', null, null, 400);
      }
    } else {
      return showApi.showResponse(response, 'Id must be a number', null, null, 400);
    }
  } else {
    return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
  }
};

const deleteDataDeliveryMethod = async (request, response) => {
  const { id } = request.params;
  if (validator.isEmpty(id)) {
    return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
  }
  if (validator.isNumeric(id)) {
    const getDataDeliveryMethod = await deliveryMethodModel.getDataDeliveryMethod(id);
    let success = false;
    if (getDataDeliveryMethod.length > 0) {
      success = true;
      if (success) {
        const resultDataDeliveryMethod = await deliveryMethodModel.deleteDataDeliveryMethod(id);
        if (resultDataDeliveryMethod.affectedRows > 0) {
          showApi.showResponse(response, 'Data delivery method deleted successfully!', getDataDeliveryMethod[0]);
        } else {
          showApi.showResponse(response, 'Data delivery method failed to delete!', null, null, 500);
        }
      }
    } else {
      showApi.showResponse(response, 'Data delivery method not found!', null, null, 404);
    }
  } else {
    return showApi.showResponse(response, 'Id must be a number', null, null, 400);
  }
};

module.exports = { insertDataDeliveryMethod, getDataDeliveryMethods, getDataDeliveryMethod, updateDataDeliveryMethod, deleteDataDeliveryMethod };
