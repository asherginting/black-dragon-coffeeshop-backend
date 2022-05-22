const db = require('../helpers/database');

exports.getDataUserByEmail = (email) => new Promise((resolve, reject) => {
  const query = db.query('select * from auth_users where email=?', [email], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });

  console.log(query.sql);
});

exports.getDataUserByEmail = (email) => new Promise((resolve, reject) => {
  // const query = db.query('select * from auth_users where email=?', [email], (err, res) => {
  db.query('select * from auth_users where email=?', [email], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

// <<<<<<< module-profile
// exports.getDataUerByEmailUpdate = (email, id) => new Promise((resolve, reject) => {
//     db.query('select * from auth_users where email=? and id!=?', [email, id], (err, res) => {
//         if (err) reject(err);
//         resolve(res);
//     });
// =======
exports.getDataUserByEmailUpdate = (email, id) => new Promise((resolve, reject) => {
  db.query('select * from auth_users where email=? and id!=?', [email, id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

// exports.insertDataUser = (data) => new Promise((resolve, reject) => {
//     db.query('insert into auth_users set email = ?, password=?, role=\'user\'', [data.email, data.password], (err, res) => {
//         if (err) reject(err)
//         resolve(res)
//     })
// })

exports.insertDataUserProfile = (data) => new Promise((resolve, reject) => {
  db.query('insert into user_profiles set phone=?', [data.phone], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.insertDataUser = (data) => new Promise((resolve, reject) => {
  // const query = db.query('insert into auth_users set email = ?, password=?, role=\'user\'', [data.email, data.password], (err, res) => {
  db.query('insert into auth_users set email = ?, password=?, role=\'user\'', [data.email, data.password], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.insertDataUserProfile = (data) => new Promise((resolve, reject) => {
  db.query('insert into user_profiles set phone=?', [data.phone], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.updateDataUser = (data, id) => new Promise((resolve, reject) => {
  db.query('update auth_users set email = ? where id=?', [data.email, id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.updateDataUserProfile = (data, id) => new Promise((resolve, reject) => {
  const query = db.query('UPDATE user_profiles SET ? WHERE auth_user_id=?', [data, id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
  console.log(query.sql);
});

// get user profile by id
exports.getUserProfile = (id) => new Promise((resolve, reject) => {
  const query = `
    SELECT up.id, up.display_name, up.first_name, up.last_name, up.gender, up.phone, up.address, up.image, up.birthdate,au.email, up.created_at
    FROM user_profiles up
    LEFT JOIN auth_users au
    ON au.id = up.auth_user_id
    WHERE au.id = ?
  `;

  const ss = db.query(query, [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
  console.log(ss.sql);
});
