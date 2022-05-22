const db = require('../helpers/database');

exports.getDataPaymentMethods = (data) => new Promise((resolve, reject) => {
  const query = db.query(`select id,name FROM payment_methods where name like '%${data.name}%'
    order by ${data.sort} ${data.order} LIMIT ${data.limit} OFFSET ${data.offset}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
  console.log(query.sql);
});

exports.getDataListPaymentMethods = (data) => new Promise((resolve, reject) => {
  const offset = (data.page - 1) * data.limit;
  const query = db.query(`select id,name FROM payment_methods where name like '%${data.name !== null ? data.name : ''}%'
    order by ${data.sort !== null ? data.sort : 'id'} ${data.order !== null ? data.order : 'asc'} LIMIT ${data.limit} OFFSET ${offset}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
  console.log(query.sql);
});

exports.countDataPaymentMethods = (data) => new Promise((resolve, reject) => {
  db.query(`SELECT count(*) AS total 
    FROM payment_methods where name like '%${data.name}%'`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

exports.countDataListPaymentMethods = (data) => new Promise((resolve, reject) => {
  db.query(`SELECT count(*) AS total 
    FROM payment_methods where name like '%${data.name !== null ? data.name : ''}%'`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

exports.getDataPaymentMethod = (id) => new Promise((resolve, reject) => {
  db.query('select id,name from payment_methods where id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.insertDataPaymentMethod = (data) => new Promise((resolve, reject) => {
  db.query('insert into payment_methods set ?', [data], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.updateDataPaymentMethod = (data, id) => new Promise((resolve, reject) => {
  db.query('update payment_methods set ? where id=?', [data, id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.deleteDataPaymentMethod = (id) => new Promise((resolve, reject) => {
  db.query('delete from payment_methods where id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});
