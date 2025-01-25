import pool from "../server.js";

const createMessage = async (attributes) => {
  try {
    const query = `
    INSERT INTO 
    Messages 
    (userId, message) 
    VALUES ($1, $2) 
    RETURNING *;`;
    const res = await pool.query(query, [...attributes]);
    if (res.rowCount) return res.rows[0];
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const updateMessage = async (attributes) => {
  try {
    const query = `
    UPDATE Messages 
    SET answer = $2, answeredAt = CURRENT_TIMESTAMP 
    WHERE messageId = $1 
    RETURNING *;`;
    const res = await pool.query(query, [...attributes]);
    if (res.rowCount) return res.rows[0];
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const deleteMessage = async (attributes) => {
  try {
    const query = `
    DELETE FROM Messages 
    WHERE messageId = $1 
    RETURNING *;`;
    const res = await pool.query(query, [...attributes]);
    if (res.rowCount) return res.rows[0];
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const retrieveMessages = async (id) => {
  try {
    let query = `
    SELECT * 
    FROM Messages  `;
    if (id) query += ` WHERE messageId = ${id} `;
    const res = await pool.query(query);
    if (res.rowCount) return res.rows;
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { createMessage, updateMessage, deleteMessage, retrieveMessages };
