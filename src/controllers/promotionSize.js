const promotionSizeModel = require('../models/promotionSize');
const showApi = require('../helpers/showResponse');
const validation = require('../helpers/validation');
const validator = require('validator');

const insertPromotionSize = async(request, response) => {
    const data = {
        promotion_id: parseInt(request.body.promotion_id),
        size_id: parseInt(request.body.size_id)
    };

    const errValidation = await validation.validationDataPromotionSizes(data);

    if (errValidation === null) {
        const dataPromotionSize = {
            promotion_id: parseInt(request.body.promotion_id),
            size_id: parseInt(request.body.size_id)
        };

        const resultDataPromotionSize = await promotionSizeModel.insertDataPromotionSize(dataPromotionSize);
        let success = false;
        if (resultDataPromotionSize.affectedRows > 0) {
            success = true;
        }
        if (success) {
            const result = await promotionSizeModel.getDataPromotionSize(resultDataPromotionSize.insertId);
            showApi.showResponse(response, 'Data promotion size created successfully!', result[0]);
        } else {
            showApi.showResponse(response, 'Data promotion size failed to create!', null, null, 500);
        }
    } else {
        showApi.showResponse(response, 'Data promotion size not valid', null, errValidation, 400);
    }
};

const getPromotionSizes = async(request, response) => {
    let { name, page, limit, sort, order } = request.query;
    name = name || '';
    sort = sort || 'ps.created_at';
    const filledFilter = ['size_id'];
    const filter = {};
    page = ((page !== null && page !== '') ? parseInt(page) : 1);
    limit = ((limit !== null && limit !== '') ? parseInt(limit) : 5);
    order = order || 'desc';
    let pagination = { page, limit };
    let route = 'PromotionSizes?';
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
        const data = { name, filter, limit, offset, sort, order };
        const dataPromotionSizes = await promotionSizeModel.getDataPromotionSizes(data);

        if (dataPromotionSizes.length > 0) {
            const result = await promotionSizeModel.countDataPromotionSizes(data);
            try {
                const { total } = result[0];
                pagination = {...pagination, total: total, route: route };
                return showApi.showResponseWithPagination(response, 'List Data promotion size', dataPromotionSizes, pagination);
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

const getPromotionSize = async(request, response) => {
    const { id } = request.params;
    if (!validator.isInt(id)) {
        return showApi.showResponse(response, 'Id must be a number', null, null, 400);
    }
    const result = await promotionSizeModel.getDataPromotionSize(id);
    if (result.length > 0) {
        return showApi.showResponse(response, 'Detail promotion size', result[0]);
    } else {
        return showApi.showResponse(response, 'Detail promotion size not found!', null, null, 404);
    }
};

const updatePatchPromotionSize = async(request, response) => {
    const { id } = request.params;

    if (id) {
        if (!isNaN(id)) {
            const dataPromotionSize = await promotionSizeModel.getDataPromotionSize(id);
            if (dataPromotionSize.length > 0) {
                const data = {
                    promotion_id: parseInt(request.body.promotion_id),
                    size_id: parseInt(request.body.size_id)
                };

                const errValidation = await validation.validationDataPromotionSizes(data);

                if (errValidation === null) {
                    const resultDataPromotionSize = await promotionSizeModel.updateDataPromotionSize(data, id);
                    let success = false;
                    if (resultDataPromotionSize.affectedRows > 0) {
                        success = true;
                    }
                    if (success) {
                        const result = await promotionSizeModel.getDataPromotionSize(id);
                        showApi.showResponse(response, 'Data promotion size updated successfully!', result);
                    } else {
                        showApi.showResponse(response, 'Data promotion size failed to update!', null, null, 500);
                    }
                } else {
                    showApi.showResponse(response, 'Data promotion size not valid', null, errValidation, 400);
                }
            } else {
                return showApi.showResponse(response, 'Data promotion size not found', null, null, 400);
            }
        } else {
            return showApi.showResponse(response, 'Id must be a number', null, null, 400);
        }
    } else {
        return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
    }
};

const deletePromotionSize = async(request, response) => {
    const {
        id
    } = request.params;
    if (!validator.isInt(id)) {
        return showApi.showResponse(response, 'Id must be a number', null, null, 400);
    }
    const getDataPromotionSize = await promotionSizeModel.getDataPromotionSize(id);
    let success = false;
    if (getDataPromotionSize.length > 0) {
        success = true;
        if (success) {
            const resultDataPromotionSize = await promotionSizeModel.deleteDataPromotionSize(id);
            if (resultDataPromotionSize.affectedRows > 0) {
                showApi.showResponse(response, 'Data promotion size deleted successfully!', getDataPromotionSize[0]);
            } else {
                showApi.showResponse(response, 'Data promotion size failed to delete!', null, null, 500);
            }
        }
    } else {
        showApi.showResponse(response, 'Data promotion size not found!', null, null, 404);
    }
};

module.exports = { insertPromotionSize, getPromotionSizes, getPromotionSize, updatePatchPromotionSize, deletePromotionSize };