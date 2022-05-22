const db = require('../helpers/database');
const {
  dataMapping
} = require('../helpers/showResponse');
const {
  APP_URL
} = process.env;

exports.getDataPromotions = (data) => new Promise((resolve, reject) => {
  const filled = ['discount_value', 'delivery_method_id'];
  let resultFillter = '';
  filled.forEach((item) => {
    if (data.filter[item]) {
      resultFillter += ` and ${item}='${data.filter[item]}'`;
    }
  });

  const query = db.query(`SELECT pr.name,pr.code,concat('${APP_URL}/',image) AS image,pr.description,pr.normal_price ,pr.discount_value, pr.available_start_at, pr.available_end_at
    FROM promotions pr where pr.name like '%${data.name}%' ${resultFillter}
    order by ${data.sort} ${data.order} LIMIT ${data.limit} OFFSET ${data.offset}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
  // console.log(query.sql);
});

exports.getListDataPromotions = (data) => new Promise((resolve, reject) => {
  const offset = (data.page - 1) * data.limit;
  const query = db.query(`SELECT id,name,description,image,discount_value,normal_price,available_start_at,available_end_at
  FROM promotions pr where pr.name like '%${data.name !== null ? data.name : ''}%' ${data.discount_value ? `AND discount_value = ${data.discount_value}` : ''} 
  ${data.date ? `and DATE_FORMAT(pr.available_start_at,'%Y-%m-%d')='${data.date}' or DATE_FORMAT(pr.available_end_at,'%Y-%m-%d')='${data.date}'` : ''}
  ${data.normal_price ? `and pr.normal_price=${data.normal_price}` : ''}
  order by ${data.sort !== null ? data.sort : 'pr.id'} ${data.order} LIMIT ${data.limit} OFFSET ${offset}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
  // console.log(query.sql);
});

exports.countListPromotions = (data) => new Promise((resolve, reject) => {
  const query = db.query(
    `SELECT count(*) AS total 
  FROM promotions pr where pr.name like '%${data.name !== null ? data.name : ''}%'
  ${data.discount_value ? `AND discount_value = ${data.discount_value}` : ''} 
  ${data.date ? `and DATE_FORMAT(pr.available_start_at,'%Y-%m-%d')='${data.date}' or DATE_FORMAT(pr.available_end_at,'%Y-%m-%d')='${data.date}'` : ''}
  ${data.normal_price ? `and pr.normal_price=${data.normal_price}` : ''}`, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  // console.log(query.sql);
});

exports.getDataPromotion = (id) => new Promise((resolve, reject) => {
  db.query('select * from promotions where id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.insertDataPromotion = (data) => new Promise((resolve, reject) => {
  db.query('insert into promotions set ?', [data], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.updateDataPromotion = (data, id) => new Promise((resolve, reject) => {
  db.query('update promotions set ? where id=?', [data, id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.deleteDataPromotion = (id) => new Promise((resolve, reject) => {
  db.query('delete from promotions where id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});
