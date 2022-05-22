const db = require('../helpers/database');

// exports.getDataProducts = (data) => new Promise((resolve, reject) => {
//   const filled = ['price', 'stocks', 'time', 'category_id'];
//   let resultFillter = '';
//   filled.forEach((item) => {
//     if (data.filter[item]) {
//       resultFillter += ` and ${item}='${data.filter[item]}'`;
//     }
//   });

//   const query = db.query(`select p.id,p.name,p.price,concat('${APP_URL}/',image) as image,p.stocks,p.delivery_time_start,p.delivery_time_end,p.category_id,c.name categpry
//     from products p join categories c on c.id = p.category_id
//     where p.name like '%${data.name}%' ${resultFillter}
//    order by ${data.sort} ${data.order} LIMIT ${data.limit} OFFSET ${data.offset}`, (error, result) => {
//     if (error) reject(error);
//     resolve(result);
//   });
//   console.log(query.sql);
// });
exports.getDataProducts = (data) => new Promise((resolve, reject) => {
  const filled = ['price', 'stocks', 'time', 'category_id'];
  let resultFillter = '';
  filled.forEach((item) => {
    if (data.filter[item]) {
      resultFillter += ` and ${item}='${data.filter[item]}'`;
    }
  });

  const query = db.query(`select p.name,p.price,p.image as image,p.category_id
    from products p join categories c on c.id = p.category_id
    where p.name like '%${data.name}%' ${resultFillter}
    order by ${data.sort} ${data.order} LIMIT ${data.limit} OFFSET ${data.offset}
    
    `, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
  console.log(query.sql);
});

exports.countDataProducts = (data) => new Promise((resolve, reject) => {
  const filled = ['category_id'];
  let resultFillter = '';
  filled.forEach((item) => {
    if (data.filter[item]) {
      resultFillter += ` and ${item}='${data.filter[item]}'`;
    }
  });

  db.query(`select count(*) as total 
    from products p join categories c on c.id = p.category_id
    where p.name like '%${data.name}%' ${resultFillter}
    order by ${data.sort} ${data.order}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

exports.getDataProduct = (id) => new Promise((resolve, reject) => {
  const query = `
  SELECT *
  FROM products WHERE id=?
  `;

  db.query(query, [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.insertDataProduct = (data) => new Promise((resolve, reject) => {
  const ss = db.query('insert into products set ?', [data], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
  console.log(ss.sql);
});

exports.updateDataProduct = (data, id) => new Promise((resolve, reject) => {
  db.query('update products set ? where id=?', [data, id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

// exports.updateDataProductSize = (data, id) => new Promise((resolve, reject) => {
//   console.log(data);
//   const query = db.query('update sizes_for_product set ? where product_id=?', [data, id], (err, res) => {
//     if (err) reject(err);
//     resolve(res);
//   });

//   console.log(query.sql);
// });

// exports.updateDataProductDeliveryMethod = (data, id) => new Promise((resolve, reject) => {
//   db.query('update product_delivery_methods set ? where product_id=?', [data, id], (err, res) => {
//     if (err) reject(err);
//     resolve(res);
//   });
// });

exports.deleteDataProduct = (id) => new Promise((resolve, reject) => {
  db.query('delete from products where id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

// exports.deleteDataProductSize = (id) => new Promise((resolve, reject) => {
//   const query = db.query('delete from sizes_for_product where product_id=?', [id], (err, res) => {
//     if (err) reject(err);
//     resolve(res);
//   });
//   console.log(query.sql);
// });

// exports.deleteDataProductDeliveryMethod = (id) => new Promise((resolve, reject) => {
//   db.query('delete from product_delivery_methods where product_id=?', [id], (err, res) => {
//     if (err) reject(err);
//     resolve(res);
//   });
// });

exports.getFilter = (data) => new Promise((resolve, reject) => {
  const filled = ['price', 'stocks', 'time', 'size_id', 'delivery_method_id'];
  let resultFillter = '';
  filled.forEach((item) => {
    if (data.filter[item]) {
      resultFillter += ` and ${item}='${data.filter[item]}'`;
    }
  });

  const query = db.query(`SELECT p.name AS productName, s.extra_price AS price, s.name AS size, dm.name AS delivery FROM sizes_for_product sf 
  JOIN products p ON sf.product_id = p.id JOIN sizes s ON sf.size_id = s.id
  JOIN product_delivery_methods pd ON pd.product_id = p.id 
  JOIN delivery_methods dm ON pd.delivery_method_id = dm.id
  where p.name like '%${data.name}%' ${resultFillter} order by ${data.sort} ${data.order} 
  LIMIT ${data.limit} OFFSET ${data.offset}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
  console.log(query.sql);
});

exports.countFilter = (data) => new Promise((resolve, reject) => {
  const filled = ['size_id', 'delivery_method_id'];
  let resultFillter = '';
  filled.forEach((item) => {
    if (data.filter[item]) {
      resultFillter += ` and ${item}='${data.filter[item]}'`;
    }
  });

  db.query(`SELECT count(*) AS total FROM sizes_for_product sf 
  JOIN products p ON sf.product_id = p.id JOIN sizes s ON sf.size_id = s.id
  JOIN product_delivery_methods pd ON pd.product_id = p.id 
  JOIN delivery_methods dm ON pd.delivery_method_id = dm.id
  where p.name like '%${data.name}%' ${resultFillter} 
  order by ${data.sort} ${data.order}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

// exports.getFilterDeliveryMethodProducts = (data) => new Promise((resolve, reject) => {
//   const filled = ['price', 'stocks', 'time', 'delivery_method_id']
//   let resultFillter = ''
//   filled.forEach((item) => {
//     if (data.filter[item]) {
//       resultFillter += ` and ${item}='${data.filter[item]}'`
//     }
//   })

//   const query = db.query(`SELECT p.name AS productName, p.price, dm.name AS deliveryMethod FROM product_delivery_methods pd
//   JOIN products p ON pd.product_id = p.id JOIN delivery_methods dm ON pd.delivery_method_id = dm.id
//   where p.name like '%${data.name}%' ${resultFillter} order by ${data.sort} ${data.order}
//   LIMIT ${data.limit} OFFSET ${data.offset}`, (error, result) => {
//     if (error) reject(error)
//     resolve(result)
//   })
//   console.log(query.sql)
// })

// exports.countFilterDeliveryMethodProducts = (data) => new Promise((resolve, reject) => {
//   const filled = ['delivery_method_id']
//   let resultFillter = ''
//   filled.forEach((item) => {
//     if (data.filter[item]) {
//       resultFillter += ` and ${item}='${data.filter[item]}'`
//     }
//   })

//   db.query(`SELECT count(*) AS total FROM product_delivery_methods pd
//   JOIN products p ON pd.product_id = p.id
//   JOIN delivery_methods dm ON pd.delivery_method_id = dm.id
//   where p.name like '%${data.name}%' ${resultFillter} order by ${data.sort} ${data.order}`, (error, result) => {
//     if (error) reject(error)
//     resolve(result)
//   })
// })

exports.listProduct = (data) => {
  return new Promise((resolve, reject) => {
    const {
      limit,
      page,
      name,
      category_id: categoryId,
      category_name: categoryName,
    } = data;
    const offset = (page - 1) * limit;

    const query = `
      SELECT p.id, p.name, p.price, p.image
      FROM products p
      LEFT JOIN categories c 
      ON p.category_id = c.id
      WHERE p.name LIKE '%${name || ''}%'
      ${categoryId ? `AND c.id = ${categoryId}` : ''}
      ${categoryName ? `AND c.name = '${categoryName}'` : ''}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const ss = db.query(query, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
    console.log(ss.sql);
  });
};

exports.countListProduct = (data) => {
  return new Promise((resolve, reject) => {
    const {
      name,
      category_id: categoryId,
      category_name: categoryName,
    } = data;

    const query = `
      SELECT COUNT(*) AS total
      FROM products p
      LEFT JOIN categories c 
      ON p.category_id = c.id
      WHERE p.name LIKE '%${name || ''}%'
      ${categoryId ? `AND c.id = ${categoryId}` : ''}
      ${categoryName ? `AND c.name = '${categoryName}'` : ''}
    `;

    db.query(query, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

exports.getDataFavorites = (data) => new Promise((resolve, reject) => {
  const filled = ['histroy_id'];
  let resultFillter = '';
  filled.forEach((item) => {
    if (data.filter[item]) {
      resultFillter += ` and ${item}='${data.filter[item]}'`;
    }
  });

  const query = db.query(`SELECT p.id, p.name AS name, p.price AS price, p.image AS image, p.category_id AS categoryId, COUNT(*) AS orderCount FROM product_histories ph LEFT JOIN products p ON p.id = ph.product_id WHERE p.name like '%${data.name}%' ${resultFillter} GROUP BY ph.product_id HAVING COUNT(*) >= 2 order by ${data.order} DESC LIMIT ${data.limit} OFFSET ${data.offset}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
  console.log(query.sql);
});

exports.countDataFavorites = (data) => new Promise((resolve, reject) => {
  const filled = ['histroy_id'];
  let resultFillter = '';
  filled.forEach((item) => {
    if (data.filter[item]) {
      resultFillter += ` and ${item}='${data.filter[item]}'`;
    }
  });
  db.query(`select count(*) as total FROM(SELECT p.name AS name, p.price AS price, p.image AS image, p.category_id AS categoryId, COUNT(*) AS orderCount FROM product_histories ph LEFT JOIN products p ON p.id = ph.product_id WHERE p.name like '%${data.name}%' ${resultFillter} GROUP BY ph.product_id HAVING COUNT(*) >= 2 ORDER BY ${data.order} DESC) AS favorite`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});
