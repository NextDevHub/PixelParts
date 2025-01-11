import pool from "../server.js";

const addProductDb = async (attributes) => {
  try {
    const query = `
        INSERT INTO Products 
        (
            productName, 
            category, 
            manufacture, 
            price, 
            stockQuantity, 
            specifications, 
            releaseDate, 
            warrantyPeriod
        ) 
        VALUES
        ($1 , $2 , $3 , $4 , $5 , $6, $7 , $8)
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

export { addProductDb };
