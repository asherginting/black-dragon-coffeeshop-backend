const promotionDeliveryMethodModel = require('../models/promotionDeliveryMethod');
const promotionModel = require('../models/promotion')
const deliveryMethodModel = require('../models/deliveryMethod')
const showApi = require('../helpers/showResponse');
const validation = require('../helpers/validation');
const validator = require('validator');

const insertPromotionDeliveryMethod = async(request, response) => {
    const data = {
        promotion_id: parseInt(request.body.promotion_id),
        delivery_method_id: parseInt(request.body.delivery_method_id)
    };

    const errValidation = await validation.validationDataPromotionDeliveryMethods(data);

    if (errValidation === null) {
        const dataPromotionDeliveryMethod = {
            promotion_id: parseInt(request.body.promotion_id),
            delivery_method_id: parseInt(request.body.delivery_method_id)
        };

        const resultDataPromotionDeliveryMethod = await promotionDeliveryMethodModel.insertDataPromotionDeliveryMethod(dataPromotionDeliveryMethod);
        let success = false;
        if (resultDataPromotionDeliveryMethod.affectedRows > 0) {
            success = true;
        }
        if (success) {
            const result = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethod(resultDataPromotionDeliveryMethod.insertId);
            showApi.showResponse(response, 'Data promotion delivery method created successfully!', result[0]);
        } else {
            showApi.showResponse(response, 'Data promotion delivery method failed to create!', null, null, 500);
        }
    } else {
        showApi.showResponse(response, 'Data promotion delivery method not valid', null, errValidation, 400);
    }
};

const insertPromotionDeliveryMethod2 = async(request, response) => {
    const data = {
        promotion_id: request.body.promotion_id,
        delivery_method_id: request.body.delivery_method_id
    };

    const errValidation = await validation.validationDataPromotionDeliveryMethods(data);

    if (errValidation === null) {
        const dataPromotionDeliveryMethod = {
            promotion_id: parseInt(request.body.promotion_id),
            delivery_method_id: parseInt(request.body.delivery_method_id)
        };

        const resultDataPromotionDeliveryMethod = await promotionDeliveryMethodModel.insertDataPromotionDeliveryMethod(dataPromotionDeliveryMethod);
        let success = false;
        if (resultDataPromotionDeliveryMethod.affectedRows > 0) {
            success = true;
        }
        if (success) {
            const result = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethod2(resultDataPromotionDeliveryMethod.insertId);
            showApi.showResponse(response, 'Data promotion delivery method created successfully!', result[0]);
        } else {
            showApi.showResponse(response, 'Data promotion delivery method failed to create!', null, null, 500);
        }
    } else {
        showApi.showResponse(response, 'Data promotion delivery method not valid', null, errValidation, 400);
    }
};

const getPromotionDeliveryMethods = async(request, response) => {
    let { name, page, limit, sort, order } = request.query;
    name = name || '';
    sort = sort || 'pdm.created_at';
    const filledFilter = ['delivery_method_id'];
    const filter = {};
    page = ((page !== null && page !== '') ? parseInt(page) : 1);
    limit = ((limit !== null && limit !== '') ? parseInt(limit) : 5);
    order = order || 'desc';
    let pagination = { page, limit };
    let route = 'promotionDeliveryMethods?';
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
        const dataPromotionDeliveryMethods = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethods(data);

        if (dataPromotionDeliveryMethods.length > 0) {
            const result = await promotionDeliveryMethodModel.countDataPromotionDeliveryMethods(data);
            try {
                const { total } = result[0];
                pagination = {...pagination, total: total, route: route };
                return showApi.showResponseWithPagination(response, 'List Data Promotion Delivery Method', dataPromotionDeliveryMethods, pagination);
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

const getListPromotionDeliveryMethodByIdPromotion = async(request, response) => {
    const { idPromotion } = request.params;

    if (!validator.isEmpty(idPromotion)) {
        if (validator.isNumeric(idPromotion)) {
            const result = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethodsByIdPromotion(idPromotion);
            if (result.length > 0) {
                return showApi.showResponse(response, 'List Data Promotion delivery method', result);
            } else {
                return showApi.showResponse(response, 'Data not found', null, null, 404);
            }
        } else {
            return showApi.showResponse(response, 'Id Promo must be a number', null, null, 400);
        }
    } else {
        return showApi.showResponse(response, 'Id promo must be filled', null, null, 400);
    }
};

const getPromotionDeliveryMethod = async(request, response) => {
    const { id } = request.params;

    const result = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethod(id);
    if (result.length > 0) {
        return showApi.showResponse(response, 'Detail Promotion Delivery Method', result[0]);
    } else {
        return showApi.showResponse(response, 'Detail Promotion Delivery Method not found!', null, null, 404);
    }
};

const getPromotionDeliveryMethod2 = async(request, response) => {
    const { id } = request.params;

    if (!validator.isEmpty(id)) {
        if (validator.isNumeric(id)) {
            const result = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethod2(id);
            if (result.length > 0) {
                return showApi.showResponse(response, 'Detail Promotion Delivery Method', result[0]);
            } else {
                return showApi.showResponse(response, 'Detail Promotion Delivery Method not found!', null, null, 404);
            }
        } else {
            return showApi.showResponse(response, 'Id must be a numeric!', null, null, 404);
        }
    } else {
        return showApi.showResponse(response, 'Id must be filled!', null, null, 404);
    }
};
const updatePatchPromotionDeliveryMethod = async(request, response) => {
    const { id } = request.params;

    if (id) {
        if (!isNaN(id)) {
            const dataPromotionDeliveryMethod = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethod(id);
            if (dataPromotionDeliveryMethod.length > 0) {
                const data = {
                    promotion_id: parseInt(request.body.promotion_id),
                    delivery_method_id: parseInt(request.body.delivery_method_id)
                };
                console.log(data);


                const errValidation = await validation.validationDataPromotionDeliveryMethods(data);

                if (errValidation === null) {
                    const resultDataPromotionDeliveryMethod = await promotionDeliveryMethodModel.updateDataPromotionDeliveryMethod(data, id);
                    let success = false;
                    if (resultDataPromotionDeliveryMethod.affectedRows > 0) {
                        success = true;
                    }
                    if (success) {
                        const result = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethod(id);
                        showApi.showResponse(response, 'Data promotion delivery method updated successfully!', result);
                    } else {
                        showApi.showResponse(response, 'Data promotion delivery method failed to update!', 500);
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

const updatePatchPromotionDeliveryMethod2 = async(request, response) => {
    const { id } = request.params;

    if (!validator.isEmpty(id)) {
        if (validator.isNumeric(id)) {
            const dataPromotionDeliveryMethod = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethod2(id);
            if (dataPromotionDeliveryMethod.length > 0) {
                const filled = ['promotion_id', 'delivery_method_id'];
                const data = {}

                filled.forEach(async(value) => {
                    if (request.body[value]) {
                        data[value] = request.body[value];
                    }
                })

                if (data["promotion_id"]) {
                    if (!validator.isNumeric(data["promotion_id"])) {
                        return showApi.showResponse(response, "Promotion id must be numeric", null, null, 400)
                    } else {
                        const getPromotion = await promotionModel.getDataPromotion(data.promotion_id)
                        if (getPromotion.length === 0) {
                            return showApi.showResponse(response, "Data promotion not found", null, null, 404)
                        }
                    }
                }

                if (data["delivery_method_id"]) {
                    if (!validator.isNumeric(data["delivery_method_id"])) {
                        return showApi.showResponse(response, "delivery method id must be numeric", null, null, 400)
                    } else {
                        console.log(data.delivery_method_id)
                        const getDeliveryMethod = await deliveryMethodModel.getDataDeliveryMethod(data.delivery_method_id)
                        if (getDeliveryMethod.length === 0) {
                            return showApi.showResponse(response, "Data delivery method id not found", null, null, 404)
                        }
                    }
                }

                // const errValidation = await validation.validationDataPromotionDeliveryMethods(data);

                const resultDataPromotionDeliveryMethod = await promotionDeliveryMethodModel.updateDataPromotionDeliveryMethod(data, id);
                let success = false;
                if (resultDataPromotionDeliveryMethod.affectedRows > 0) {
                    success = true;
                }
                if (success) {
                    const result = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethod2(id);
                    showApi.showResponse(response, 'Data promotion delivery method updated successfully!', result);
                } else {
                    showApi.showResponse(response, 'Data promotion delivery method failed to update!', 500);
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

const deletePromotionDeliveryMethod = async(request, response) => {
    const {
        id
    } = request.params;

    const getDataPromotionDeliveryMethod = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethod(id);
    let success = false;
    if (getDataPromotionDeliveryMethod.length > 0) {
        success = true;
        if (success) {
            const resultDataPromotionDeliveryMethod = await promotionDeliveryMethodModel.deleteDataPromotionDeliveryMethod(id);
            if (resultDataPromotionDeliveryMethod.affectedRows > 0) {
                showApi.showResponse(response, 'Data category deleted successfully!', getDataPromotionDeliveryMethod[0]);
            } else {
                showApi.showResponse(response, 'Data category failed to delete!', null, null, 500);
            }
        }
    } else {
        showApi.showResponse(response, 'Data category not found!', null, null, 404);
    }
};

const deletePromotionDeliveryMethod2 = async(request, response) => {
    const {
        id
    } = request.params;

    if (!validator.isEmpty(id)) {
        if (validator.isNumeric(id)) {
            const getDataPromotionDeliveryMethod = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethod(id);
            let success = false;
            if (getDataPromotionDeliveryMethod.length > 0) {
                success = true;
                if (success) {
                    const resultDataPromotionDeliveryMethod = await promotionDeliveryMethodModel.deleteDataPromotionDeliveryMethod(id);
                    if (resultDataPromotionDeliveryMethod.affectedRows > 0) {
                        showApi.showResponse(response, 'Data promotion delivery deleted successfully!', getDataPromotionDeliveryMethod[0]);
                    } else {
                        showApi.showResponse(response, 'Data promotion delivery method failed to delete!', null, null, 500);
                    }
                }
            } else {
                showApi.showResponse(response, 'Data promotion delivery method not found!', null, null, 404);
            }
        } else {
            showApi.showResponse(response, 'Id must be a number!', null, null, 404);
        }
    } else {
        showApi.showResponse(response, 'Id must be filled!', null, null, 404);
    }
};

module.exports = { insertPromotionDeliveryMethod, insertPromotionDeliveryMethod2, getPromotionDeliveryMethods, getListPromotionDeliveryMethodByIdPromotion, getPromotionDeliveryMethod, getPromotionDeliveryMethod2, updatePatchPromotionDeliveryMethod, updatePatchPromotionDeliveryMethod2, deletePromotionDeliveryMethod, deletePromotionDeliveryMethod2 };