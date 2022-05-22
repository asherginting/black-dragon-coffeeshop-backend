const histories = require('express').Router();
const {
  verifyUser,
  verifyAdmin
} = require('../middlewares/auth');

const {
  getHistories,
  getHistoriesById,
  insertHistories,
  updateDataHistory,
  deleteDataHistory
} = require('../controllers/histories');

histories.get('/', verifyUser, getHistories);
histories.get('/:id', verifyUser, getHistoriesById);
histories.post('/', verifyUser, insertHistories);
histories.patch('/:id', verifyAdmin, updateDataHistory);
histories.delete('/:id', verifyUser, deleteDataHistory);

module.exports = histories;
