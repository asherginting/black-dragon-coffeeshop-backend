const categories = require('express').Router();

const {
    insertCategory,
    getCategories,
    getCategory2,
    // getCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/category');

categories.get('/', getCategories);
categories.get('/:id', getCategory2);
// categories.get('/:id', getCategory);
categories.post('/', insertCategory);
categories.patch('/:id', updateCategory);
categories.delete('/:id', deleteCategory);

module.exports = categories;