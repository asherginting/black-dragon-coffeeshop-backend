/* eslint-disable no-unused-vars */
const sizeForProductModel = require('../models/sizeForProduct')
const showApi = require('../helpers/showResponse')
const auth = require('../helpers/auth')
const validation = require('../helpers/validation')
const validator = require('validator')
const { request } = require('express')

const { APP_URL } = process.env

const getSizeForProductsByIdProduct = async(request, response) => {
    const { idProduct } = request.params

    if (idProduct) {
        if (validator.isNumeric(idProduct)) {
            const result = await sizeForProductModel.getDataSizeOfProductByIdProduct(idProduct)
            if (result.length > 0) {
                return showApi.showResponse(response, 'List Data Size For Product', result)
            } else {
                return showApi.showResponse(response, 'Data not found', null, null, 404)
            }
        } else {
            return showApi.showResponse(response, 'Id product must be a number', null, null, 404)
        }
    } else {
        return showApi.showResponse(response, 'Id Product must be filled', null, null, 400);
    }
};

const getSizeForProduct = async(request, response) => {
    const { id } = request.params
    if (id) {
        if (validator.isNumeric(id)) {
            const result = await sizeForProductModel.getDataSizeOfProduct(id)
            if (result.length > 0) {
                return showApi.showResponse(response, 'List Data Size For Product', result)
            } else {
                return showApi.showResponse(response, 'Data not found', null, null, 404)
            }
        } else {
            return showApi.showResponse(response, 'Id must be a number', null, null, 404)
        }
    } else {
        return showApi.showResponse(response, 'Id must be filled', null, null, 400);
    }
};

const insertSizeForProduct = async(request, response) => {
    const data = {
        product_id: request.body.productId,
        size_id: request.body.sizeId
    };
    console.log(data);
    const errValidation = await validation.validationSizeForProduct(data);
    if (errValidation == null) {
        const insert = await sizeForProductModel.insertDataProductSize(data);
        if (insert.affectedRows > 0) {
            const result = await sizeForProductModel.getDataSizeOfProduct(insert.insertId);
            console.log(result);
            showApi.showResponse(response, 'Data product created successfully!', result[0]);
        } else {
            showApi.showResponse(response, 'Data product failed to create!', null, null, 500);
        }
    } else {
        showApi.showResponse(response, 'Data product not valid', null, errValidation, 400);
    }
};

const updateDataProductSize = async(request, response) => {
    console.log('masuk updata');
    const { id } = request.params;

    if (id) {
        if (!isNaN(id)) {
            const dataProductSize = await sizeForProductModel.getDataSizeOfProduct(id);
            if (dataProductSize.length > 0) {
                const { product_id, size_id } = request.body;
                const data = {
                    product_id,
                    size_id
                };

                const errValidation = await validation.validationSizeForProduct(data);

                if (errValidation == null) {
                    const update = await sizeForProductModel.updateDataProductSize(data, id);
                    if (update.affectedRows > 0) {
                        const result = await sizeForProductModel.getDataSizeOfProduct(id);
                        showApi.showResponse(response, 'Data size for product updated successfully!', result[0]);
                    } else {
                        showApi.showResponse(response, 'Data size for product failed to update!', null, null, 500);
                    }
                } else {
                    showApi.showResponse(response, 'Data size for product not valid', null, errValidation, 400);
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

const updatePatchSizeForUpdate = async(request, response) => {
    const { id } = request.params;
    if (id) {
        if (!isNaN(id)) {
            const getDataProductSize = await sizeForProductModel.getDataSizeOfProduct(id);
            if (getDataProductSize.length > 0) {
                const data = {};

                const filled = ['product_id', 'size_id'];

                filled.forEach((value) => {
                    if (request.body[value]) {
                        data[value] = request.body[value];
                    }
                });

                try {
                    const update = await sizeForProductModel.updateDataProductSize(data, id);
                    if (update.affectedRows > 0) {
                        const result = await sizeForProductModel.getDataSizeOfProduct(id);
                        return showApi.showResponse(response, 'Data size for product updated successfully!', result[0]);
                    } else {
                        return showApi.showResponse(response, 'Data size for product failed to update', null, null, 500);
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
};

const deleteSizeForProduct = async(request, response) => {
    const { id } = request.params;

    if (id) {
        if (validator.isNumeric(id)) {
            const getDataSizeOfProduct = await sizeForProductModel.getDataSizeOfProduct(id);
            if (getDataSizeOfProduct.length > 0) {
                const result = await sizeForProductModel.deleteDataProductSize(id);
                console.log(result.affectedRows);
                if (result.affectedRows > 0) {
                    const result = await sizeForProductModel.getDataSizeOfProduct(id);
                    showApi.showResponse(response, 'Data size for product deleted successfully!', result[0]);
                } else {
                    showApi.showResponse(response, 'Data size product failed to delete!', null, null, 500);
                }
            } else {
                showApi.showResponse(response, 'Data size for product not found!', null, null, 404);
            }
        } else {
            return showApi.showResponse(response, 'Id must be a number', null, null, 400);
        }
    } else {
        return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
    }
};

module.exports = { getSizeForProductsByIdProduct, getSizeForProduct, insertSizeForProduct, updateDataProductSize, updatePatchSizeForUpdate, deleteSizeForProduct };