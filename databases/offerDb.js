import pool from "../server.js";

const addOfferDb = async (attributes) => {
  try {
    const query = `
                INSERT INTO 
                OFFERS
                (productId , offerPercentage , startDate , endDate)
                VALUES 
                ($1 , $2 ,$3 ,$4)
                RETURNING *
    `;
    const res = await pool.query(query, [...attributes]);
    if (res.rowCount) return res.rows[0];
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const editOfferDb = async (id, attributes) => {
  try {
    const query = `
                    UPDATE OFFERS 
                    SET ${attributes}
                    WHERE productId=$1
                    RETURNING *
    `;
    const res = await pool.query(query, [id]);
    if (res.rowCount) return res.rows[0];
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const retrieveOfferById = async (id) => {
  try {
    const query = `
                    SELECT *
                    FROM OFFERS 
                    WHERE productId=$1
    `;
    const res = await pool.query(query, [id]);
    if (res.rowCount) return res.rows[0];
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const deleteOfferDb = async (id) => {
  try {
    const query = `
                    DELETE FROM OFFERS 
                    WHERE productId=$1
    `;
    const res = await pool.query(query, [id]);
    if (res.rowCount) return true;
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export { addOfferDb, editOfferDb, retrieveOfferById, deleteOfferDb };
