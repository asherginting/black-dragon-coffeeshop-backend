// const queryString = require('qs');
const productModel = require('../models/product');
const showApi = require('../helpers/showResponse');
const upload = require('../helpers/upload').single('image');
// const auth = require('../helpers/auth');
const validation = require('../helpers/validation');
const validator = require('validator');

const {
  APP_URL
} = process.env;

const getFilterData = async (request, response) => {
  let {
    name,
    page,
    limit,
    sort,
    order
  } = request.query;
  name = name || '';
  sort = sort || 'p.created_at';
  const filledFilter = ['size_id', 'delivery_method_id'];
  const filter = {};
  page = ((page !== null && page !== '') ? parseInt(page) : 1);
  limit = ((limit !== null && limit !== '') ? parseInt(limit) : 5);
  order = order || 'desc';
  let pagination = {
    page,
    limit
  };
  let route = 'products?';
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
  if (errValidation === null) {
    const offset = (page - 1) * limit;
    console.log(offset);
    const data = {
      name,
      filter,
      limit,
      offset,
      sort,
      order
    };
    const dataFilter = await productModel.getFilter(data);

    if (dataFilter.length > 0) {
      const result = await productModel.countFilter(data);
      try {
        const {
          total
        } = result[0];
        pagination = {
          ...pagination,
          total: total,
          route: route
        };
        return showApi.showResponseWithPagination(response, 'List Data Product', dataFilter, pagination);
      } catch (err) {
        return showApi.showResponse(response, err.message, null, 500);
      }
    } else {
      return showApi.showResponse(response, 'Data not found', null, 404);
    }
  } else {
    showApi.showResponse(response, 'Pagination was not valid.', null, validation.validationPagination(pagination), 400);
  }
};

const getProducts = async (request, response) => {
  let {
    name,
    page,
    limit,
    sort,
    order
  } = request.query;
  name = name || '';
  sort = sort || 'p.created_at';
  const filledFilter = ['category_id'];
  const filter = {};
  page = ((page !== null && page !== '') ? parseInt(page) : 1);
  limit = ((limit !== null && limit !== '') ? parseInt(limit) : 5);
  order = order || 'desc';
  let pagination = {
    page,
    limit
  };
  let route = 'products?';
  let searchParam = '';
  if (name) {
    searchParam = `name=${name}`;
  }

  console.log(filter);

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
  if (errValidation === null) {
    const offset = (page - 1) * limit;
    console.log(offset);
    const data = {
      name,
      filter,
      limit,
      offset,
      sort,
      order
    };
    // console.log(data);
    const dataProduct = await productModel.getDataProducts(data);

    if (dataProduct.length > 0) {
      const result = await productModel.countDataProducts(data);
      try {
        const {
          total
        } = result[0];
        pagination = {
          ...pagination,
          total: total,
          route: route
        };
        return showApi.showResponseWithPagination(response, 'List Data Product', showApi.dataMapping(dataProduct), pagination);
      } catch (err) {
        return showApi.showResponse(response, err.message, null, 500);
      }
    } else {
      return showApi.showResponse(response, 'Data not found', null, 404);
    }
  } else {
    showApi.showResponse(response, 'Pagination was not valid.', null, validation.validationPagination(pagination), 400);
  }
};

const getProduct = async (request, response) => {
  const {
    id
  } = request.params;

  if (!id || !validator.isInt(id)) {
    return showApi.showResponse(response, 'Id not valid', null, null, 400);
  }

  const result = await productModel.getDataProduct(id);
  if (result.length > 0) {
    return showApi.showResponse(response, 'Detail Product', showApi.dataMapping(result)[0]);
  } else {
    return showApi.showResponse(response, 'Detail Product not found!', null, null, 404);
  }
};

const insertProduct = async (request, response) => {
  upload(request, response, async (errorUpload) => {
    // auth.verifyUser(request, response, async (error) => {
    const data = {
      name: request.body.name,
      price: request.body.price,
      description: request.body.description,
      stocks: request.body.stocks,
      delivery_time_start: request.body.deliveryTimeStart,
      delivery_time_end: request.body.deliveryTimeEnd,
      category_id: request.body.categoryId,
      price_product: request.body.priceProduct
    };

    let errValidation = await validation.validationDataProducts(data);
    // let errValidation = validation.validationDataProducts(data);

    if (errorUpload) {
      errValidation = {
        ...errValidation,
        image: errorUpload.message
      };
    }

    if (errValidation === null) {
      const dataProduct = {
        name: request.body.name,
        price: request.body.price,
        description: request.body.description,
        stocks: request.body.stocks,
        delivery_time_start: request.body.deliveryTimeStart,
        delivery_time_end: request.body.deliveryTimeEnd,
        category_id: request.body.categoryId
      };

      if (request.file) {
        dataProduct.image = request.file.path.replace(/\\/g, '/');
      }

      // const resultDataProduct = await productModel.insertDataProduct(dataProduct);
      const resultDataProduct = await productModel.insertDataProduct(dataProduct);
      let success = false;
      if (resultDataProduct.affectedRows > 0) {
        success = true;
      }
      if (success) {
        const result = await productModel.getDataProduct(resultDataProduct.insertId);
        showApi.showResponse(response, 'Data product created successfully!', showApi.dataMapping(result)[0]);
      } else {
        showApi.showResponse(response, 'Data product failed to create!', null, null, 500);
      }
    } else {
      showApi.showResponse(response, 'Data product not valid', null, errValidation, 400);
    }
  });
};

const updateProduct = (request, response) => {
  upload(request, response, async (errorUpload) => {
    // auth.verifyUser(request, response, async(error) => {
    const {
      id
    } = request.params;

    if (id) {
      if (!isNaN(id)) {
        const dataProduct = await productModel.getDataProduct(id);
        if (dataProduct.length > 0) {
          const data = {
            name: request.body.name,
            price: request.body.price,
            description: request.body.description,
            stocks: request.body.stocks,
            delivery_time_start: request.body.deliveryTimeStart,
            delivery_time_end: request.body.deliveryTimeEnd,
            category_id: request.body.categoryId
          };

          let errValidation = await validation.validationDataProducts(data);

          if (request.file) {
            data.image = request.file.path;
          }
          if (errorUpload) {
            errValidation = {
              ...errValidation,
              photo: errorUpload.message
            };
          }

          if (errValidation === null) {
            const resultDataProduct = await productModel.updateDataProduct(data, id);
            console.log(resultDataProduct);
            let success = false;
            if (resultDataProduct.affectedRows > 0) {
              success = true;
            }
            if (success) {
              const result = await productModel.getDataProduct(id);
              showApi.showResponse(response, 'Data product updated successfully!', result);
            } else {
              showApi.showResponse(response, 'Data product failed to update!', 500);
            }
          } else {
            showApi.showResponse(response, 'Data product not valid', null, errValidation, 400);
          }
        } else {
          return showApi.showResponse(response, 'Data product not found', null, null, 400);
        }
      } else {
        return showApi.showResponse(response, 'Id must be a number', null, null, 400);
      }
    } else {
      return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
    }
  });
};

const updatePatchProduct = (request, response) => {
  upload(request, response, async (errorUpload) => {
    // auth.verifyUser(request, response, async(error) => {
    const {
      id
    } = request.params;
    if (id) {
      if (!isNaN(id)) {
        const getDataProduct = await productModel.getDataProduct(id);
        if (getDataProduct.length > 0) {
          const dataProduct = {};

          const filled = ['name', 'price', 'description', 'stocks', 'delivery_time_start', 'delivery_time_end', 'category_id'];
          filled.forEach((value) => {
            if (request.body[value]) {
              if (request.file) {
                const photoTemp = request.file.path;
                dataProduct.image = photoTemp.replace('\\', '/');
              }
              dataProduct[value] = request.body[value];
            }
          });

          try {
            const update = await productModel.updateDataProduct(dataProduct, id);
            let detailProduct = false;
            if (update.affectedRows > 0) {
              detailProduct = true;
            }
            if (detailProduct) {
              const result = await productModel.getDataProduct(id);
              result[0].image = `${APP_URL}/${result[0].image.replace('\\', '/')}`;
              return showApi.showResponse(response, 'Data product updated successfully!', result[0]);
            } else {
              return showApi.showResponse(response, 'Data product failed to update', null, null, 500);
            }
          } catch (err) {
            return showApi.showResponse(response, err.message, null, null, 500);
          }
        } else {
          return showApi.showResponse(response, 'Data product not found', null, null, 400);
        }
      } else {
        return showApi.showResponse(response, 'Id must be a number', null, null, 400);
      }
    } else {
      return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
    }
  });
};

const deleteProduct = async (request, response) => {
  // auth.verifyUser(request, response, async(error) => {
  const {
    id
  } = request.params;

  const getDataProduct = await productModel.getDataProduct(id);
  let success = false;
  if (getDataProduct.length > 0) {
    success = true;
  }
  if (success) {
    const resultDataProduct = await productModel.deleteDataProduct(id);
    if (resultDataProduct.affectedRows > 0) {
      const result = await productModel.getDataProduct(id);
      showApi.showResponse(response, 'Data product deleted successfully!', result[0]);
    } else {
      showApi.showResponse(response, 'Data product failed to delete!', null, null, 500);
    }
  } else {
    showApi.showResponse(response, 'Data product not found!', null, null, 404);
  }
};

const listProduct = async (request, response) => {
  try {
    const {
      page,
      limit
    } = request.query;

    if (!page) {
      return showApi.showResponse(response, 'Page must be filled', null, null, 400);
    }

    if (!limit) {
      return showApi.showResponse(response, 'Limit must be filled', null, null, 400);
    }

    const dataForFilter = {
      page: parseInt(page),
      limit: parseInt(limit),
      name: request.query.name || null,
      category_id: request.query.category_id || null,
      category_name: request.query.category_name || null
    };

    // console.log(dataForFilter);

    const result = await productModel.listProduct(dataForFilter);
    const total = await productModel.countListProduct(dataForFilter);

    if (result.length < 1) {
      return showApi.showResponse(response, 'Data product not found', null, null, 404);
    }

    // const uri = queryString.stringify(dataForFilter);
    // console.log(uri);

    const pageInfo = showApi.pageInfoCreator(total[0].total, 'products', dataForFilter);

    return showApi.returningSuccess(response, 200, 'Data product retrieved successfully!', showApi.dataMapping(result), pageInfo);
  } catch (error) {
    console.error(error);
    return showApi.showResponse(response, error.message, null, null, 500);
  }
};

const getFavorites = async (request, response) => {
  let {
    name,
    page,
    limit,
    order
  } = request.query;
  name = name || '';
  const filledFilter = ['history_id'];
  const filter = {};
  page = ((page !== null && page !== '') ? parseInt(page) : 1);
  limit = ((limit !== null && limit !== '') ? parseInt(limit) : 5);
  order = order || 'orderCount';
  let pagination = {
    page,
    limit
  };
  let route = 'products?';
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
  if (errValidation === null) {
    const offset = (page - 1) * limit;
    console.log(offset);
    const data = {
      name,
      filter,
      limit,
      offset,
      order
    };
    const dataFavorite = await productModel.getDataFavorites(data);
    // console.log(dataFavorite);
    if (dataFavorite.length > 0) {
      const result = await productModel.countDataFavorites(data);
      try {
        const {
          total
        } = result[0];
        pagination = {
          ...pagination,
          total: total,
          route: route
        };

        const dataFilter = {
          name: request.query.name || null,
          page: parseInt(request.query.page) || 1,
          limit: parseInt(request.query.limit) || 5,
          order: request.query.order || null
        }

        const pageInfo = showApi.pageInfoCreator(total, 'products/f/favorite', dataFilter);
        return showApi.returningSuccess(response, 200, 'Data product retrieved successfully!', showApi.dataMapping(dataFavorite), pageInfo);
        // return showApi.showResponseWithPagination(response, 'List Data Product Favorites', showApi.dataMapping(dataFavorite), pagination);
      } catch (err) {
        return showApi.showResponse(response, err.message, null, null, 500);
      }
    } else {
      return showApi.showResponse(response, 'Data not found', null, null, 404);
    }
  } else {
    showApi.showResponse(response, 'Pagination was not valid.', null, validation.validationPagination(pagination), 400);
  }
};

module.exports = {
  getProducts,
  getProduct,
  insertProduct,
  updateProduct,
  updatePatchProduct,
  deleteProduct,
  getFilterData,
  listProduct,
  getFavorites
};
