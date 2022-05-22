const db = require('../helpers/database');
// const {
//   APP_URL
// } = process.env;

exports.getDataHistoriesByFilter = (data) =>
  new Promise((resolve, reject) => {
    const filled = [
      'category_id',
      'size_id',
      'delivery_method_id',
      'payment_method_id',
      'delivery_time'
    ];
    let resultFillter = '';

    const {
      userId
    } = data;

    filled.forEach((item) => {
      if (data.filter[item]) {
        if (item === 'delivery_time') {
          resultFillter += ` and DATE_FORMAT(${item}, "%Y-%m-%d")='${data.filter[item]}'`;
        } else {
          resultFillter += ` and ${item}='${data.filter[item]}'`;
        }
      }
    });

    const query = db.query(
      `
      SELECT h.id, p.name,p.price, p.image, h.delivery_status as deliveryStatus
      FROM histories h 
      LEFT JOIN product_histories ph ON ph.history_id = h.id 
      JOIN products p ON p.id = ph.product_id
      WHERE p.name like '%${data.name}%' ${resultFillter} ${userId ? `AND h.user_profile_id = ${userId}` : ''} ${userId ? `AND h.deleted_at IS NULL` : ''} ${userId ? `AND ph.deleted_at IS NULL` : ''}
      ORDER by ${data.sort} ${data.order} LIMIT ${data.limit} OFFSET ${data.offset}
      `,
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    );
  });

exports.countDataHistoriesByFilter = (data) =>
  new Promise((resolve, reject) => {
    const filled = ['date', 'category_id', 'size_id', 'delivery_method_id'];
    let resultFillter = '';
    filled.forEach((item) => {
      if (data.filter[item]) {
        resultFillter += ` and ${item}='${data.filter[item]}'`;
      }
    });

    const {
      userId
    } = data;

    db.query(
      `select count(*) as total
    from histories h join product_histories ph on ph.history_id = h.id join products p on p.id = ph.product_id
    where p.name like '%${data.name}%' ${resultFillter} ${userId ? `and h.user_profile_id = ${userId}` : ''}
    order by ${data.sort} ${data.order}`,
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    );
  });

exports.listHistories = (data) => {

  const {
    limit,
    offset,
    userId
  } = data;

  return new Promise((resolve, reject) => {
    const query = `
    SELECT h.id, (
      SELECT p.name 
        FROM product_histories ph 
        JOIN products p 
        ON p.id = ph.product_id 
        JOIN histories
        ON h.id = ph.history_id
        LIMIT 1
    ) as name, (
      SELECT p.image 
        FROM product_histories ph 
        JOIN products p 
        ON p.id = ph.product_id 
        JOIN histories
        ON h.id = ph.history_id
        LIMIT 1
    ) as image, h.total, h.subtotal, h.shipping_cost as shippingCost, h.delivery_status as deliveryStatus, h.payment_method_id as paymentMethodId
    FROM histories h
    ${userId ? `WHERE h.user_profile_id = ${userId}` : ''}
    ${userId ? `AND h.deleted_at IS NULL` : ''}
    ORDER BY h.id  DESC
    LIMIT ${limit} OFFSET ${offset}
    `
    const ss = db.query(query, (error, result) => {
      if (error) reject(error);
      resolve(result);
    })
  })
}

exports.countListHistories = (data) => {

  const {
    userId
  } = data;

  return new Promise((resolve, reject) => {
    const query = `
      SELECT count(*) as total FROM histories h ${userId ? `WHERE h.user_profile_id = ${userId}` : ''}
    `;
    db.query(query, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
}

exports.getDataHistoryById = (id, userId = false) => {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT * FROM histories h WHERE h.id = ${id} ${userId ? `and h.user_profile_id = ${userId}` : ''}
      `;
    db.query(query, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

exports.insertDataHistory = (data) => {
  return new Promise((resolve, reject) => {
    const query = `
        INSERT INTO histories SET ?
      `;
    db.query(query, data, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

exports.updateDataHistory = (data) => {
  return new Promise((resolve, reject) => {
    const query = `
        UPDATE histories SET ? WHERE id = ${data.id}
      `;
    db.query(query, data, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

exports.deleteDataHistory = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
        DELETE FROM histories WHERE id = ${id}
      `;
    db.query(query, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

exports.softDeleteDataHistory = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
        UPDATE histories SET deleted_at = NOW() WHERE id = ${id}
      `;
    db.query(query, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
}
