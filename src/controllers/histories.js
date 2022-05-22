const historyModel = require('../models/histories');
const showApi = require('../helpers/showResponse');
const validation = require('../helpers/validation');
const userModel = require('../models/user');
const authModel = require('../models/authModel');
const productHistoryModel = require('../models/productHistory');
const {
    requestMapping
} = require('../helpers/requestHandler');

exports.getHistories = async(request, response) => {
    let {
        name,
        page,
        limit,
        sort,
        order
    } = request.query;
    name = name || '';
    sort = sort || 'h.created_at';
    const filledFilter = ['category_id', 'size_id', 'delivery_method_id', 'payment_method_id', 'delivery_time'];
    const filter = {};
    page = ((page !== null && page !== '') ? parseInt(page) : 1);
    limit = ((limit !== null && limit !== '') ? parseInt(limit) : 10);
    order = order || 'desc';
    let pagination = {
        page,
        limit
    };
    let route = 'histories?';
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
        const data = {
            name,
            filter,
            limit,
            offset,
            sort,
            order
        };

        const authUser = request.headers.user;

        if (authUser) {
            if (authUser.role !== 'admin') {
                const userProfile = await userModel.getUserProfile(authUser.id);

                if (userProfile.length > 0) {
                    data.userId = userProfile[0].id;
                } else {
                    return showApi.showResponse(response, 'User not found', null, null, 404);
                }
            } else {
                const checkRole = await authModel.getUserById(authUser.id);
                if (checkRole.length < 1) {
                    return showApi.showResponse(response, 'User does\'nt have permission for this request', null, null, 403);
                }
            }
        }

        // const dataProduct = await historyModel.getDataHistoriesByFilter(data);
        const dataProduct = await historyModel.listHistories(data);

        if (dataProduct.length > 0) {
            const result = await historyModel.countListHistories(data);
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
                return showApi.showResponse(response, err.message, null, null, 500);
            }
        } else {
            return showApi.showResponse(response, 'Data not found', null, null, 404);
        }
    } else {
        showApi.showResponse(response, 'Pagination was not valid.', null, validation.validationPagination(pagination), 400);
    }
};

exports.getHistoriesById = async(request, response) => {
    try {
        const {
            id
        } = request.params;

        const authUser = request.headers.user;
        let userId = '';

        if (authUser) {
            if (authUser.role !== 'admin') {
                const userProfile = await userModel.getUserProfile(authUser.id);
                if (userProfile.length > 0) {
                    userId = userProfile[0].id;
                } else {
                    return showApi.showResponse(response, 'User not found', null, null, 404);
                }
            } else {
                const checkRole = await authModel.getUserById(authUser.id);
                if (checkRole.length < 1) {
                    return showApi.showResponse(response, 'User does\'nt have permission for this request', null, null, 403);
                }
            }
        }

        const data = await historyModel.getDataHistoryById(id, userId);

        if (data.length > 0) {
            return showApi.showResponse(response, 'List Data Product', data[0], 200);
        } else {
            return showApi.showResponse(response, 'Data not found', null, 404);
        }
    } catch (error) {
        console.error(error);
        return showApi.showResponse(response, error.message, null, null, 500);
    }
};

exports.insertHistories = async(request, response) => {
    try {
        const rules = {
            delivery_time: 'datetime|required',
            subtotal: 'number|required',
            total: 'number|required',
            reservation_time: 'datetime|required',
            shipping_cost: 'number|required',
            tax_id: 'number|required',
            delivery_method_id: 'number|required',
            payment_method_id: 'number|required'
        };

        // const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const data = requestMapping(request.body, rules);

        const nullData = validation.noNullData(data, rules);
        if (nullData) {
            return showApi.showResponse(response, nullData, null, null, 400);
        }

        const authId = request.headers.user.id;

        const userProfile = await userModel.getUserProfile(authId);

        if (userProfile.length > 0) {
            data.user_profile_id = userProfile[0].id;
        } else {
            return showApi.showResponse(response, 'User not found', null, null, 404);
        }

        // tambahkan validasi untuk mengecek taxe_id, delivery_method_id dan payment_method_id

        data.payment_status = '0';
        data.delivery_status = '0';
        const insertedHistories = await historyModel.insertDataHistory(data);

        if (insertedHistories.affectedRows > 0) {
            const histories = await historyModel.getDataHistoryById(insertedHistories.insertId);

            return showApi.showResponse(response, 'Data inserted', histories[0], null, 201);
        }

        return showApi.showResponse(response, 'Data not inserted', null, null, 400);
    } catch (error) {
        console.error(error);
        return showApi.showResponse(response, error.message, null, null, 500);
    }
};

exports.updateDataHistory = async(request, response) => {
    try {
        const {
            id
        } = request.params;

        if (!id) {
            return showApi.showResponse(response, 'Id not history found', null, null, 404);
        }

        const rules = {
            payment_status: 'boolean',
            delivery_status: 'boolean'
        };

        const data = requestMapping(request.body, rules);

        if (Object.keys(data).length < 1) {
            return showApi.showResponse(response, 'Input minimal 1 data', null, null, 400);
        }

        const nullData = validation.noNullData(data, rules);
        if (nullData) {
            return showApi.showResponse(response, nullData, null, null, 400);
        }

        const authId = request.headers.user.id;
        const userProfile = await userModel.getUserProfile(authId);

        if (userProfile.length > 0) {
            data.user_profile_id = userProfile[0].id;
        } else {
            return showApi.showResponse(response, 'User not found', null, null, 404);
        }

        data.id = id;
        const insertedHistories = await historyModel.updateDataHistory(data);

        if (insertedHistories.affectedRows > 0) {
            const histories = await historyModel.getDataHistoryById(id);

            return showApi.showResponse(response, 'Data inserted', histories[0], null, 201);
        }

        return showApi.showResponse(response, 'Data not inserted', null, null, 400);
    } catch (error) {
        console.error(error);
        return showApi.showResponse(response, error.message, null, null, 500);
    }
};

exports.deleteDataHistory = async(request, response) => {
    try {
        const {
            id
        } = request.params;

        if (!id) {
            return showApi.showResponse(response, 'Id not history found', null, null, 404);
        }

        const authId = request.headers.user.id;
        const role = request.headers.user.role;
        const userProfile = await userModel.getUserProfile(authId);

        if (userProfile.length < 1) {
            return showApi.showResponse(response, 'User not found', null, null, 404);
        }

        const history = await historyModel.getDataHistoryById(id);

        if (history.length < 1) {
            return showApi.showResponse(response, 'History not found', null, null, 404);
        }

        if (role === 'admin') {
            const deletedHistories = await historyModel.deleteDataHistory(id);

            if (deletedHistories.affectedRows > 0) {
                return showApi.showResponse(response, 'History deleted', history[0], null, 200);
            }
        } else {
            // const softDeleteDataHistory = await productHistoryModel.deleteDataProductHistory(id);
            const softDeleteDataHistory = await historyModel.softDeleteDataHistory(id);

            if (softDeleteDataHistory.affectedRows > 0) {
                return showApi.showResponse(response, 'History deleted', history[0], null, 200);
            }
        }




        return showApi.showResponse(response, 'History not deleted', null, null, 400);
    } catch (error) {
        console.error(error);
        return showApi.showResponse(response, error.message, null, null, 500);
    }
};