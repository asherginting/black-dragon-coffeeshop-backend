/* eslint-disable no-unused-vars */
const productDeliveryMethodModel = require('../models/productDeliveryMethod');
const productModel = require('../models/product');
const deliveryMethodModel = require('../models/deliveryMethod');
const showApi = require('../helpers/showResponse');
const auth = require('../helpers/auth');
const validation = require('../helpers/validation');
const { request } = require('express');
const validator = require('validator');

const { APP_URL } = process.env;

const getProductDeliveryMethodByIdProduct = async(request, response) => {
    const { idProduct } = request.params;
    if (idProduct) {
        if (!validator.isNumeric(idProduct)) {
            return showApi.showResponse(response, 'Id product must be a number', null, null, 400);
        }
        const result = await productDeliveryMethodModel.getDataProductDeliveryMethodByIdProduct(idProduct);
        if (result.length > 0) {
            return showApi.showResponse(response, 'List data product delivery method', result);
        } else {
            return showApi.showResponse(response, 'Data not found', null, null, 404);
        }
    } else {
        return showApi.showResponse(response, 'Id Product must be filled', null, null, 400);
    }
};

const getProductDeliveryMethod = async(request, response) => {
    const { id } = request.params;
    if (id) {
        if (!validator.isNumeric(id)) {
            return showApi.showResponse(response, 'Id must be a number', null, null, 400);
        }
        const result = await productDeliveryMethodModel.getDataProductDeliveryMethod(id)
        if (result.length > 0) {
            return showApi.showResponse(response, 'Detail data product delivery method', result);
        } else {
            return showApi.showResponse(response, 'Data not found', null, null, 404);
        }
    } else {
        return showApi.showResponse(response, 'Id must be filled', null, null, 400);
    }
};

const insertProductDeliveryNethod = async(request, response) => {
    const data = {
        product_id: request.body.product_id,
        delivery_method_id: request.body.delivery_method_id
    };

    const errValidation = await validation.validationProductDeliveryMethod(data);
    if (errValidation == null) {
        const insert = await productDeliveryMethodModel.insertDataProductDeliveryMethod(data);
        if (insert.affectedRows > 0) {
            const result = await productDeliveryMethodModel.getDataProductDeliveryMethod(insert.insertId);
            console.log(result);
            showApi.showResponse(response, 'Data product delivery method created successfully!', result[0]);
        } else {
            showApi.showResponse(response, 'Data product delivery method failed to create!', null, null, 500);
        }
    } else {
        showApi.showResponse(response, 'Data product delivery method not valid', null, errValidation, 400);
    }
};

const updateDataProductDeliveryMethod = async(request, response) => {
    const { id } = request.params;

    if (id) {
        if (!isNaN(id)) {
            const dataProductDeliveryMethod = await productDeliveryMethodModel.getDataProductDeliveryMethod(id);
            if (dataProductDeliveryMethod.length > 0) {
                const data = {
                    product_id: request.body.product_id,
                    delivery_method_id: request.body.delivery_method_id
                };

                const errValidation = await validation.validationProductDeliveryMethod(data);

                if (errValidation == null) {
                    const update = await productDeliveryMethodModel.updateDataProductDeliveryMethod(data, id);
                    if (update.affectedRows > 0) {
                        const result = await productDeliveryMethodModel.getDataProductDeliveryMethod(id);
                        showApi.showResponse(response, 'Data product delivery method updated successfully!', result[0]);
                    } else {
                        showApi.showResponse(response, 'Data product delivery method failed to update!', null, null, 500);
                    }
                } else {
                    showApi.showResponse(response, 'Data product delivery method not valid', null, errValidation, 400);
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

const updatePatchProductDeliveryMethod = async(request, response) => {
    const { id } = request.params;
    if (id) {
        if (!isNaN(id)) {
            const getDataProductSize = await productDeliveryMethodModel.getDataProductDeliveryMethod(id);
            if (getDataProductSize.length > 0) {
                const data = {};

                const filled = ['product_id', 'delivery_method_id'];

                filled.forEach((value) => {
                    if (request.body[value]) {
                        data[value] = request.body[value];
                    }
                });

                if (data["product_id"]) {
                    if (!validator.isNumeric(data["product_id"])) {
                        return showApi.showResponse(response, "Product id must be numeric", null, null, 400)
                    } else {
                        const getProduct = await productModel.getDataProduct(data.product_id)
                        if (getProduct.length === 0) {
                            return showApi.showResponse(response, "Data product not found", null, null, 404)
                        }
                    }
                }

                if (data["delivery_method_id"]) {
                    if (!validator.isNumeric(data["delivery_method_id"])) {
                        return showApi.showResponse(response, "delivery method id must be numeric", null, null, 400)
                    } else {
                        const getDeliveryMethod = await deliveryMethodModel.getDataDeliveryMethod(data.delivery_method_id)
                        if (getDeliveryMethod.length === 0) {
                            return showApi.showResponse(response, "Data delivery method id not found", null, null, 404)
                        }
                    }
                }

                try {
                    const update = await productDeliveryMethodModel.updateDataProductDeliveryMethod(data, id);
                    if (update.affectedRows > 0) {
                        const result = await productDeliveryMethodModel.getDataProductDeliveryMethod(id);
                        return showApi.showResponse(response, 'Data product delivery method updated successfully!', result[0]);
                    } else {
                        return showApi.showResponse(response, 'Data product delivery method failed to update', null, null, 500);
                    }
                } catch (err) {
                    return showApi.showResponse(response, err.message, null, null, 500);
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

const deleteProdutDeliveryMethod = async(request, response) => {
    const { id } = request.params;

    if (!validator.isEmpty(id)) {
        if (validator.isNumeric(id)) {
            const getDataSizeOfProduct = await productDeliveryMethodModel.getDataProductDeliveryMethod(id);
            if (getDataSizeOfProduct.length > 0) {
                const result = await productDeliveryMethodModel.deleteDataProductDeliveryMethod(id);
                if (result.affectedRows > 0) {
                    const result = await productDeliveryMethodModel.getDataProductDeliveryMethod(id);
                    showApi.showResponse(response, 'Data product delivery method deleted successfully!', result[0]);
                } else {
                    showApi.showResponse(response, 'Data product delivery method failed to delete!', null, null, 500);
                }
            } else {
                showApi.showResponse(response, 'Data not found!', null, null, 404);
            }
        } else {
            return showApi.showResponse(response, 'Id must be a number', null, null, 400);
        }
    } else {
        return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
    }
};

module.exports = { getProductDeliveryMethodByIdProduct, getProductDeliveryMethod, insertProductDeliveryNethod, updateDataProductDeliveryMethod, updatePatchProductDeliveryMethod, deleteProdutDeliveryMethod };