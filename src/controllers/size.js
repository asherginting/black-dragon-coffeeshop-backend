const sizeModel = require('../models/size');
const showApi = require('../helpers/showResponse');
const validation = require('../helpers/validation');
const validator = require('validator')

const insertSize = async(req, res) => {
    const data = {
        name: req.body.name,
        extra_price: req.body.extra_price
    };
    const errValidation = await validation.validationDataSize(data);

    if (errValidation === null) {
        const dataSize = {
            name: req.body.name,
            extra_price: parseInt(req.body.extra_price)
        };
        const resultDataSize = await sizeModel.insertDataSize(dataSize);
        let success = false;
        if (resultDataSize.affectedRows > 0) {
            success = true;
        }
        if (success) {
            const result = await sizeModel.getDataSize(resultDataSize.insertId);
            showApi.showResponse(res, 'Data size created successfully!', result[0]);
        } else {
            showApi.showResponse(res, 'Data size failed to create!', null, null, 500);
        }
    } else {
        showApi.showResponse(res, 'Data size not valid', null, errValidation, 400);
    }
};

const getSizes = async(req, res) => {
    let {
        name,
        page,
        limit
    } = req.query;
    name = name || '';
    page = ((page !== null && page !== '') ? parseInt(page) : 1);
    limit = ((limit !== null && limit !== '') ? parseInt(limit) : 5);
    let pagination = {
        page,
        limit
    };
    let route = 'sizes?';
    let searchParam = '';
    if (name) {
        searchParam = `name=${name}`;
    }
    route += searchParam;

    const errValidation = await validation.validationPagination(pagination);
    if (errValidation === null) {
        const offset = (page - 1) * limit;
        const data = {
            name,
            page,
            limit,
            offset
        };
        const dataSize = await sizeModel.getDataSizes(data);

        if (dataSize.length > 0) {
            const result = await sizeModel.countDataSizes(data);
            try {
                const {
                    total
                } = result[0];
                pagination = {
                    ...pagination,
                    total: total,
                    route: route
                };
                return showApi.showResponseWithPagination(res, 'List Data Size', dataSize, pagination);
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

const getSize = async(req, res) => {
    const { id } = req.params;

    if (!id) {
        return showApi.showResponse(res, "Id size must be filled!", null, null, 400)
    }
    if (!validator.isNumeric(id)) {
        return showApi.showResponse(res, "Id must be a number", null, null, 400)
    }

    const result = await sizeModel.getDataSize(id);
    if (result.length > 0) {
        return showApi.showResponse(res, 'Detail size', result[0]);
    } else {
        return showApi.showResponse(res, 'Detail size not found!', null, null, 404);
    }
};

const updateSize = async(request, response) => {
    const { id } = request.params;

    if (id) {
        if (validator.isNumeric(id)) {
            const dataSize = await sizeModel.getDataSize(id);
            if (dataSize.length > 0) {
                const data = {
                    name: request.body.name,
                    extra_price: request.body.extra_price
                };
                console.log(data);
                const errValidation = await validation.validationDataSize(data);

                if (errValidation === null) {
                    data.extra_price = parseInt(data.extra_price)
                    const resultDataSize = await sizeModel.updateDataSize(data, id);

                    let success = false;
                    if (resultDataSize.affectedRows > 0) {
                        success = true;
                    }
                    if (success) {
                        const result = await sizeModel.getDataSize(id);
                        showApi.showResponse(response, 'Data size update success!', result);
                    } else {
                        showApi.showResponse(response, 'Data size to update!', null, null, 500);
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

const deleteSize = async(request, response) => {
    const { id } = request.params;

    if (!id) {
        return showApi.showResponse(response, "Id size must be filled!", null, null, 400)
    }
    if (!validator.isNumeric(id)) {
        return showApi.showResponse(response, "Id must be a number", null, null, 400)
    }

    const getDataSize = await sizeModel.getDataSize(id);
    let success = false;
    if (getDataSize.length > 0) {
        success = true;
        if (success) {
            const resultDataSize = await sizeModel.deleteDataSize(id);
            if (resultDataSize.affectedRows > 0) {
                showApi.showResponse(response, 'Data size deleted successfully!', getDataSize[0]);
            } else {
                showApi.showResponse(response, 'Data size failed to delete!', null, null, 500);
            }
        }
    } else {
        showApi.showResponse(response, 'Data size not found!', null, null, 404);
    }
};

module.exports = { insertSize, getSizes, getSize, updateSize, deleteSize };