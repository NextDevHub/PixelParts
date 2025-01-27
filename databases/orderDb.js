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

export { createOrder, createOrderProduct, deleteOrder, updateOrderStatus };
