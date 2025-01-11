import pool from "../server.js";

const addProductDb = async (attributes) => {
  try {
    console.log(attributes);
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
            warrantyPeriod,
            description
        ) 
        VALUES
        ($1 , $2 , $3 , $4 , $5 , $6, $7 , $8 , $9)
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

const retrieveAllProductsDb = async (fields, filters, orders, limit, page) => {
  try {
    let query = "select ";
    if (fields) query += fields;
    else
      query += ` 
            *
    `;
    query += `
        FROM PRODUCTS 
    `;
    if (filters)
      query += `
    where ${filters.join(" and ")}       
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
    throw error;
  }
};
const editProductDb = async (id, updatedAttributes) => {
  try {
    const query = `
                UPDATE 
                  PRODUCTS
                SET ${updatedAttributes.join(" , ")}
                WHERE productId = $1
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
export { addProductDb, retrieveAllProductsDb, editProductDb };
