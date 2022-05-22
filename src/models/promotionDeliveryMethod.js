const db = require('../helpers/database');

exports.insertDataPromotionDeliveryMethod = (data) => new Promise((resolve, reject) => {
  db.query('insert into promotion_delivery_methods set ?', [data], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.getDataPromotionDeliveryMethods = (data) => new Promise((resolve, reject) => {
  const filled = ['delivery_method_id'];
  let resultFillter = '';
  filled.forEach((item) => {
    if (data.filter[item]) {
      resultFillter += ` and ${item}='${data.filter[item]}'`;
    }
  });

  db.query(`SELECT pdm.id AS id, pr.name AS promotion, dm.name AS deliveryMethod
    FROM promotion_delivery_methods pdm JOIN promotions pr ON pr.id = pdm.promotion_id 
    JOIN delivery_methods dm ON dm.id = pdm.delivery_method_id 
    where pr.name like '%${data.name}%' ${resultFillter}
    order by ${data.sort} ${data.order} LIMIT ${data.limit} OFFSET ${data.offset}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

exports.countDataPromotionDeliveryMethods = (data) => new Promise((resolve, reject) => {
  const filled = ['delivery_method_id'];
  let resultFillter = '';
  filled.forEach((item) => {
    if (data.filter[item]) {
      resultFillter += ` and ${item}='${data.filter[item]}'`;
    }
  });

  db.query(`SELECT count(*) AS total FROM promotion_delivery_methods pdm JOIN promotions pr ON pr.id = pdm.promotion_id 
  JOIN delivery_methods dm ON dm.id = pdm.delivery_method_id 
  where pr.name like '%${data.name}%' ${resultFillter}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

exports.getDataPromotionDeliveryMethodsByIdPromotion = (id) => new Promise((resolve, reject) => {
  db.query(`SELECT pdm.promotion_id,pdm.delivery_method_id, dm.name AS deliveryMethod
    FROM promotion_delivery_methods pdm JOIN promotions pr ON pr.id = pdm.promotion_id 
    JOIN delivery_methods dm ON dm.id = pdm.delivery_method_id 
    where pdm.promotion_id=?`, [id], (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

exports.getDataPromotionDeliveryMethod = (id) => new Promise((resolve, reject) => {
  db.query('select * from promotion_delivery_methods where id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.getDataPromotionDeliveryMethod2 = (id) => new Promise((resolve, reject) => {
  db.query(`SELECT pdm.id, pdm.promotion_id,pdm.delivery_method_id, dm.name AS deliveryMethod
  FROM promotion_delivery_methods pdm JOIN promotions pr ON pr.id = pdm.promotion_id 
  JOIN delivery_methods dm ON dm.id = pdm.delivery_method_id 
  where pdm.id=?`, [id], (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

exports.updateDataPromotionDeliveryMethod = (data, id) => new Promise((resolve, reject) => {
  db.query('update promotion_delivery_methods set ? where id=?', [data, id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.deleteDataPromotionDeliveryMethod = (id) => new Promise((resolve, reject) => {
  db.query('delete from promotion_delivery_methods where id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});
