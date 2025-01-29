import pool from "../server.js";

const createOrder = async (attributes) => {
  try {
    const query = `INSERT INTO orders (userId, totalPrice ,  paymentMethod ) VALUES ($1, $2 , $3) RETURNING *`;
    const res = await pool.query(query, [...attributes]);
    if (res.rowCount) return res.rows[0];
    return false;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const createOrderProduct = async (attributes) => {
  try {
    const query = `INSERT INTO orderProducts (orderId, productId, quantity) VALUES ($1, $2, $3)`;
    console.log(query);
    const res = await pool.query(query, [...attributes]);
    console.log(res.rowCount);
    if (res.rowCount) return true;
    return false;
  } catch (error) {
    await deleteOrder(attributes[0]);
    console.log(error);
    throw new Error(error.message);
  }
};
const deleteOrder = async (orderId) => {
  try {
    const query = `DELETE FROM orders WHERE orderId = $1`;
    const res = await pool.query(query, [orderId]);
    if (res.rowCount) return true;
    return false;
  } catch (error) {
    await deleteOrder(orderId);
    console.log(error);
    throw new Error(error.message);
  }
};

const updateOrderStatus = async (attributes) => {
  try {
    const query = `UPDATE orders SET paymentStatus = $2 WHERE orderId = $1 RETURNING *`;
    const res = await pool.query(query, [...attributes]);
    if (res.rowCount) return res.rows[0];
    return false;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
const retrieveOrders = async (fields, filters, orders, limit, page) => {
  try {
    let query = "select ";
    if (fields) query += fields;
    else
      query += ` 
                o.orderId,
                o.userId,
                concat(u.firstName , ' ' , u.lastName) as userName,
                u.email,
                o.totalPrice,
                o.orderDate,
                o.paymentMethod,
                o.paymentStatus,
                JSON_AGG(
                    json_build_object(
                        'productId', op.productId,
                        'quantity', op.quantity
                    )
                ) as products
    `;
    query += `
        FROM 
          ORDERS o
        LEFT JOIN
            USERS u  ON u.userId = o.userId
        LEFT JOIN
            orderProducts op  ON op.orderId = o.orderId
    `;
    if (filters)
      query += `
    where ${filters.join(" and ")}       
    `;
    query += `
            GROUP BY 
                    o.orderId,
                    o.userId,
                    o.totalPrice,
                    o.orderDate,
                    o.paymentMethod,
                    o.paymentStatus,
                    u.email,
                    u.lastName,
                    u.firstName
    `;
    if (orders)
      query += `
    order by ${orders.join(" , ")}       
    `;
    query += ` 
    LIMIT ${limit} OFFSET ${page - 1} * ${limit} ; 
    `;
    const res = await pool.query(query);
    if (res.rowCount) return res.rows;
    return false;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
export {
  createOrder,
  createOrderProduct,
  deleteOrder,
  updateOrderStatus,
  retrieveOrders,
};
