const categoryModel = require('../models/category');
const showApi = require('../helpers/showResponse');
const validation = require('../helpers/validation');
const validator = require('validator')

const insertCategory = async (req, res) => {
  const data = {
    name: req.body.name
  };
  const errValidation = await validation.validationDataCategory(data);

  if (errValidation === null) {
    const data = {
      name: req.body.name
    };

    const dataCategory = await categoryModel.getDataCategoryByName(data.name);

    if (dataCategory.length > 0) {
      return showApi.showResponse(res, 'Category already registered', null, null, 400);
    }

    const resultDataCategory = await categoryModel.insertDataCategory(data);
    let success = false;
    if (resultDataCategory.affectedRows > 0) {
      success = true;
    }
    if (success) {
      const result = await categoryModel.getDataCategory(resultDataCategory.insertId);
      showApi.showResponse(res, 'Data category created successfully!', result[0]);
    } else {
      showApi.showResponse(res, 'Data category failed to create!', null, null, 500);
    }
  } else {
    showApi.showResponse(res, 'Data category not valid', null, errValidation, 400);
  }
};

const getCategories = async (req, res) => {
  let {
    name,
    page,
    limit,
    specific
  } = req.query;
  name = name || '';
  page = ((page !== null && page !== '') ? parseInt(page) : 1);
  limit = ((limit !== null && limit !== '') ? parseInt(limit) : 5);
  specific = ((specific !== null && specific !== '') ? specific : '');
  let pagination = {
    page,
    limit
  };
  let route = 'categories?';
  let searchParam = '';
  if (name) {
    searchParam = `name=${name}`;
  }
  route += searchParam;

  const errValidation = await validation.validationPagination(pagination);
  if (errValidation === null) {
    const offset = (page - 1) * limit;
    console.log(offset);
    const data = {
      name,
      limit,
      offset,
      specific
    };

    const dataCategory = await categoryModel.getDataCategories(data);

    if (dataCategory.length > 0) {
      const result = await categoryModel.countDataCategories(data);
      try {
        const {
          total
        } = result[0];
        pagination = {
          ...pagination,
          total: total,
          route: route
        };
        return showApi.showResponseWithPagination(res, 'List Data Category', dataCategory, pagination);
      } catch (err) {
        return showApi.showResponse(res, err.message, null, 500);
      }
    } else {
      return showApi.showResponse(res, 'Data not found', null, 404);
    }
  } else {
    showApi.showResponse(res, 'Pagination was not valid.', null, validation.validationPagination(pagination), 400);
  }
};

const getCategory = async (req, res) => {
  const {
    id
  } = req.params;
  const result = await categoryModel.getDataCategory(id);
  if (result.length > 0) {
    return showApi.showResponse(res, 'Detail category', result[0]);
  } else {
    return showApi.showResponse(res, 'Detail category not found!', null, 404);
  }
};

const getCategory2 = async (req, res) => {
  const {
    id
  } = req.params;

  if (!validator.isNumeric(id)) {
    return showApi.showResponse(res, "Id must be a number", null, null, 400)
  }
  const result = await categoryModel.getDataCategory(id);
  if (result.length > 0) {
    return showApi.showResponse(res, 'Detail category', result[0]);
  } else {
    return showApi.showResponse(res, 'Detail category not found!', null, null, 404);
  }
};

const updateCategory = async (request, response) => {
  const {
    id
  } = request.params;

  if (id) {
    if (!isNaN(id)) {
      const dataSize = await categoryModel.getDataCategory(id);
      if (dataSize.length > 0) {
        const data = {
          name: request.body.name
        };
        console.log(data);
        const errValidation = await validation.validationDataCategory(data);

        if (errValidation === null) {
          const resultDataSize = await categoryModel.updateDataCategory(data, id);

          let success = false;
          if (resultDataSize.affectedRows > 0) {
            success = true;
          }
          if (success) {
            const result = await categoryModel.getDataCategory(id);
            showApi.showResponse(response, 'Data category update success!', result);
          } else {
            showApi.showResponse(response, 'Data category to update!', 500);
          }
        } else {
          showApi.showResponse(response, 'Data category not valid', null, errValidation, 400);
        }
      } else {
        return showApi.showResponse(response, 'Data category not found', null, null, 400);
      }
    } else {
      return showApi.showResponse(response, 'Id must be a number', null, null, 400);
    }
  } else {
    return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
  }
};

const deleteCategory = async (request, response) => {
  const {
    id
  } = request.params;

  const getDataCategory = await categoryModel.getDataCategory(id);
  let success = false;
  if (getDataCategory.length > 0) {
    success = true;
    if (success) {
      const resultDataCategory = await categoryModel.deleteDataCategory(id);
      if (resultDataCategory.affectedRows > 0) {
        // const result = await categoryModel.getDataCategory(id);
        showApi.showResponse(response, 'Data category deleted successfully!', getDataCategory[0]);
      } else {
        showApi.showResponse(response, 'Data category failed to delete!', null, null, 500);
      }
    }
  } else {
    showApi.showResponse(response, 'Data category not found!', null, null, 404);
  }
};

module.exports = {
  insertCategory,
  getCategories,
  getCategory,
  getCategory2,
  updateCategory,
  deleteCategory
};
