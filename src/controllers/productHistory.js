const productHistoryModel = require('../models/productHistory');
const showApi = require('../helpers/showResponse');
const validator = require('validator');
const historyModel = require('../models/histories');
const sizeModel = require('../models/size');
const productHModel = require('../models/product');

const getProductHistoriesByIdHistory = async(request, response) => {
    const {
        idHistory
    } = request.params;

    if (idHistory) {
        const result = await productHistoryModel.getDataHistoryProductByIdHistory(idHistory);
        if (result.length > 0) {
            return showApi.showResponse(response, 'List Data Product History', result);
        } else {
            return showApi.showResponse(response, 'Data not found', null, null, 404);
        }
    } else {
        return showApi.showResponse(response, 'Id History must be filled', null, null, 400);
    }
};

const insertProductHistory = async(request, response) => {
    const data = {
        history_id: request.body.history_id,
        qty: request.body.qty,
        product_id: request.body.product_id,
        size_id: request.body.size_id
    };

    console.log(data);

    for (const key in data) {
        if (!data[key]) {
            return showApi.showResponse(response, `${key} must be filled`, null, null, 400);
        }
    }

    if (validator.isEmpty(data.product_id)) {
        return showApi.showResponse(response, 'id product must be filled.', null, null, 400);
    } else if (!validator.isNumeric(data.product_id)) {
        return showApi.showResponse(response, 'id product must be a number.', null, null, 400);
    } else {
        const getDataProduct = await productHModel.getDataProduct(data.product_id);
        if (getDataProduct.length === 0) {
            return showApi.showResponse(response, 'Data product not found.', null, null, 400);
        }
    }

    if (validator.isEmpty(data.history_id)) {
        return showApi.showResponse(response, 'id history must be filled.', null, null, 400);
    } else if (!validator.isNumeric(data.history_id)) {
        return showApi.showResponse(response, 'Id history must be a number.', null, null, 400);
    } else {
        const getDataHistory = await historyModel.getDataHistoryById(data.history_id);
        if (getDataHistory.length === 0) {
            return showApi.showResponse(response, 'Data History not found.', null, null, 400);
        }
    }

    if (validator.isEmpty(data.size_id)) {
        return showApi.showResponse(response, 'id size must be filled.', null, null, 400);
    } else if (!validator.isNumeric(data.size_id)) {
        return showApi.showResponse(response, 'Id size must be a number.', null, null, 400);
    } else {
        const dataSizeOfProduct = await sizeModel.getDataSize(data.size_id);
        if (dataSizeOfProduct.length === 0) {
            return showApi.showResponse(response, 'Data size not found.', null, null, 400);
        }
    }

    if (validator.isEmpty(data.qty)) {
        return showApi.showResponse(response, 'Qty must be filled.', null, null, 400);
    } else if (!validator.isNumeric(data.qty)) {
        return showApi.showResponse(response, 'Qty must be a number.', null, null, 400);
    }
    const insert = await productHistoryModel.insertDataProductHistory(data);
    if (insert.affectedRows > 0) {
        const result = await productHistoryModel.getDataProductHistory(insert.insertId);
        console.log(result);
        showApi.showResponse(response, 'Data product history created successfully!', result[0]);
    } else {
        showApi.showResponse(response, 'Data product history failed to create!', null, null, 500);
    }
};

const updateDataProductHistory = async(request, response) => {
    const {
        id
    } = request.params;

    if (id) {
        if (!isNaN(id)) {
            const dataProductSize = await productHistoryModel.getDataProductHistory(id);
            if (dataProductSize.length > 0) {
                const data = {
                    history_id: request.body.history_id,
                    qty: request.body.qty,
                    product_id: request.body.product_id,
                    size_id: request.body.size_id
                };

                if (validator.isEmpty(data.product_id)) {
                    return showApi.showResponse(response, 'id product must be filled.', null, null, 400);
                } else if (!validator.isNumeric(data.product_id)) {
                    return showApi.showResponse(response, 'id product must be a number.', null, null, 400);
                } else {
                    const getDataProduct = await productHModel.getDataProduct(data.product_id);
                    if (getDataProduct.length === 0) {
                        return showApi.showResponse(response, 'Data product not found.', null, null, 400);
                    }
                }

                if (validator.isEmpty(data.history_id)) {
                    return showApi.showResponse(response, 'id history must be filled.', null, null, 400);
                } else if (!validator.isNumeric(data.history_id)) {
                    return showApi.showResponse(response, 'Id history must be a number.', null, null, 400);
                } else {
                    const getDataHistory = await historyModel.getDataHistory(data.history_id);
                    if (getDataHistory.length === 0) {
                        return showApi.showResponse(response, 'Data History not found.', null, null, 400);
                    }
                }

                if (validator.isEmpty(data.size_id)) {
                    return showApi.showResponse(response, 'id size must be filled.', null, null, 400);
                } else if (!validator.isNumeric(data.size_id)) {
                    return showApi.showResponse(response, 'Id size must be a number.', null, null, 400);
                } else {
                    const dataSizeOfProduct = await sizeModel.getDataSize(data.size_id);
                    if (dataSizeOfProduct.length === 0) {
                        return showApi.showResponse(response, 'Data size not found.', null, null, 400);
                    }
                }

                if (validator.isEmpty(data.qty)) {
                    return showApi.showResponse(response, 'Qty must be filled.', null, null, 400);
                } else if (!validator.isNumeric(data.qty)) {
                    return showApi.showResponse(response, 'Qty must be a number.', null, null, 400);
                }

                const update = await productHistoryModel.updateDataProductHistory(data, id);
                if (update.affectedRows > 0) {
                    const result = await productHistoryModel.getDataProductHistory(id);
                    showApi.showResponse(response, 'Data product history updated successfully!', result[0]);
                } else {
                    showApi.showResponse(response, 'Data product history failed to update!', 500);
                }
            } else {
                showApi.showResponse(response, 'Data product history not valid', null, null, 400);
            }
        } else {
            return showApi.showResponse(response, 'Data not found', null, null, 400);
        }
    } else {
        return showApi.showResponse(response, 'Id must be a number', null, null, 400);
    }
};

const updatePatchProductHistory = async(request, response) => {
    const {
        id
    } = request.params;
    if (id) {
        if (!isNaN(id)) {
            const getDataHistory = await productHistoryModel.getDataProductHistory(id);
            if (getDataHistory.length > 0) {
                const data = {};

                const filled = ['product_id', 'size_id', 'history_id', 'qty', 'size_id'];

                filled.forEach(async(value) => {
                    if (request.body[value]) {
                        data[value] = request.body[value];

                        if (value === 'history_id') {
                            if (!validator.isNumeric(data.history_id)) {
                                return showApi.showResponse(response, 'Id history must be a number.', null, null, 400);
                            } else {
                                const getDataHistory = await historyModel.getDataHistory(data.history_id);
                                if (getDataHistory.length === 0) {
                                    return showApi.showResponse(response, 'Data History not found.', null, null, 400);
                                }
                            }
                        }

                        if (value === 'size_id') {
                            if (!validator.isNumeric(data.size_id)) {
                                return showApi.showResponse(response, 'Id size must be a number.', null, null, 400);
                            } else {
                                const dataSizeOfProduct = await sizeModel.getDataSize(data.size_id);
                                if (dataSizeOfProduct.length === 0) {
                                    return showApi.showResponse(response, 'Data size not found.', null, null, 400);
                                }
                            }
                        }

                        if (value === 'product_id') {
                            if (!validator.isNumeric(data.product_id)) {
                                return showApi.showResponse(response, 'id product must be a number.', null, null, 400);
                            } else {
                                const getDataProduct = await productHModel.getDataProduct(data.product_id);
                                if (getDataProduct.length === 0) {
                                    return showApi.showResponse(response, 'Data product not found.', null, null, 400);
                                }
                            }
                        }
                    }
                });

                try {
                    const update = await productHistoryModel.updateDataProductHistory(data, id);
                    if (update.affectedRows > 0) {
                        const result = await productHistoryModel.getDataProductHistory(id);
                        return showApi.showResponse(response, 'Data product history updated successfully!', result[0]);
                    } else {
                        return showApi.showResponse(response, 'Data product history failed to update', null, null, 500);
                    }
                } catch (err) {
                    return showApi.showResponse(response, err.message, null, null, 500);
                }
            } else {
                return showApi.showResponse(response, 'Data product history not found', null, null, 400);
            }
        } else {
            return showApi.showResponse(response, 'Id must be a number', null, null, 400);
        }
    } else {
        return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
    }
};

const deleteProductHistory = async(request, response) => {
    const {
        id
    } = request.params;

    if (id) {
        if (!isNaN(id)) {
            const getDataProductHistory = await productHistoryModel.getDataProductHistory(id);
            if (getDataProductHistory.length > 0) {
                const result = await productHistoryModel.deleteDataProductHistory(id);
                if (result.affectedRows > 0) {
                    const result = await productHistoryModel.getDataProductHistory(id);
                    return showApi.showResponse(response, 'Data product history deleted successfully!', result[0]);
                } else {
                    showApi.showResponse(response, 'Data product history failed to delete!', null, null, 500);
                }
            } else {
                showApi.showResponse(response, 'Data product history not found!', null, null, 404);
            }
        } else {
            return showApi.showResponse(response, 'Id must be a number', null, null, 400);
        }
    } else {
        return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
    }
};

module.exports = {
    getProductHistoriesByIdHistory,
    insertProductHistory,
    updateDataProductHistory,
    updatePatchProductHistory,
    deleteProductHistory
};