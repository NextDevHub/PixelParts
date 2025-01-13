import e from "express";
import pool from "../server.js";

const addImgDb = async (attributes) => {
  try {
    const query = `
        INSERT INTO images 
        (
            productId ,
            imageUrl
        ) 
        VALUES
        ($1 , $2)
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
const editImgDb = async (attributes) => {
  try {
    const query = `
        UPDATE images
        SET imageUrl = $2
        WHERE imageId = $1
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
export { addImgDb, editImgDb };
