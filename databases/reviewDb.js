import pool from "../server.js";

const addReviewDb = async (attributes) => {
  try {
    const query = `
                    INSERT INTO 
                        REVIEWS 
                    (userId , productId , review , rate)
                    VALUES ($1,$2,$3,$4)
                    RETURNING *;
    `;
    const res = await pool.query(query, [...attributes]);
    if (res.rowCount) return res.rows[0];
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { addReviewDb };
