const taxModel = require('../models/taxAndFees');
const showApi = require('../helpers/showResponse');
const validation = require('../helpers/validation');
const validator = require('validator');

const insertTax = async (req, res) => {
  const data = {
    name: req.body.name,
    value: parseFloat(req.body.value)
  };
  const errValidation = await validation.validationDataTax(data);

  if (errValidation === null) {
    const dataTax = {
      name: req.body.name,
      value: parseFloat(req.body.value)
    };
    const resultDataTax = await taxModel.insertDataTax(dataTax);
    let success = false;
    if (resultDataTax.affectedRows > 0) {
      success = true;
    }
    if (success) {
      const result = await taxModel.getDataTax(resultDataTax.insertId);
      showApi.showResponse(res, 'Data tax created successfully!', result[0]);
    } else {
      showApi.showResponse(res, 'Data tax failed to create!', null, null, 500);
    }
  } else {
    showApi.showResponse(res, 'Data tax not valid', null, errValidation, 400);
  }
};

const getTaxes = async (req, res) => {
  let { name, page, limit } = req.query;
  name = name || '';
  page = ((page !== null && page !== '') ? parseInt(page) : 1);
  limit = ((limit !== null && limit !== '') ? parseInt(limit) : 5);
  let pagination = { page, limit };
  let route = 'taxes?';
  let searchParam = '';
  if (name) {
    searchParam = `name=${name}`;
  }
  route += searchParam;

  const errValidation = await validation.validationPagination(pagination);
  if (errValidation === null) {
    const offset = (page - 1) * limit;

    const data = { name, page, limit, offset };
    const dataTax = await taxModel.getDataTaxes(data);
    console.log(dataTax);
    if (dataTax.length > 0) {
      const result = await taxModel.countDataTaxes(data);
      try {
        const { total } = result[0];
        pagination = { ...pagination, total: total, route: route };
        return showApi.showResponseWithPagination(res, 'List Data tax', dataTax, pagination);
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

const getTax = async (req, res) => {
  const { id } = req.params;
  if (validator.isEmpty(id)) {
    return showApi.showResponse(res, 'Id must be filled.', null, null, 400);
  }
  if (validator.isNumeric(id)) {
    const result = await taxModel.getDataTax(id);
    if (result.length > 0) {
      return showApi.showResponse(res, 'Detail tax', result[0]);
    } else {
      return showApi.showResponse(res, 'Detail tax not found!', null, null, 404);
    }
  } else {
    return showApi.showResponse(res, 'Id must be a number', null, null, 400);
  }
};

const updateTax = async (request, response) => {
  const { id } = request.params;

  if (id) {
    if (!isNaN(id)) {
      const dataTax = await taxModel.getDataTax(id);
      if (dataTax.length > 0) {
        const data = {
          name: request.body.name,
          value: parseFloat(request.body.value)
        };
        console.log(data);
        const errValidation = await validation.validationDataTax(data);

        if (errValidation === null) {
          const resultDataTax = await taxModel.updateDataTax(data, id);

          let success = false;
          if (resultDataTax.affectedRows > 0) {
            success = true;
          }
          if (success) {
            const result = await taxModel.getDataTax(id);
            showApi.showResponse(response, 'Data tax update success!', result[0]);
          } else {
            showApi.showResponse(response, 'Data tax to update!', 500);
          }
        } else {
          showApi.showResponse(response, 'Data promotion delivery method not valid', null, errValidation, 400);
        }
      } else {
        return showApi.showResponse(response, 'Data promotion delivery method not found', null, null, 400);
      }
    } else {
      return showApi.showResponse(response, 'Id must be a number', null, null, 400);
    }
  } else {
    return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
  }
};

const deleteTax = async (request, response) => {
  const { id } = request.params;

  if (validator.isEmpty(id)) {
    return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
  }
  if (validator.isNumeric(id)) {
    const getDataTax = await taxModel.getDataTax(id);
    let success = false;
    if (getDataTax.length > 0) {
      success = true;
      if (success) {
        const resultDataTax = await taxModel.deleteDataTax(id);
        if (resultDataTax.affectedRows > 0) {
          showApi.showResponse(response, 'Data tax deleted success!', getDataTax[0]);
        } else {
          showApi.showResponse(response, 'Data tax failed to delete!', null, 500);
        }
      }
    } else {
      showApi.showResponse(response, 'Data tax not found!', null, 404);
    }
  } else {
    return showApi.showResponse(response, 'Id must be a number', null, null, 400);
  }
};

module.exports = { insertTax, getTaxes, getTax, updateTax, deleteTax };
