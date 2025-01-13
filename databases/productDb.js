import pool from "../server.js";
import { catchAsyncError } from "../utilites.js";

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
                p.productId, 
                p.productName, 
                p.category, 
                p.manufacture, 
                p.price, 
                p.stockQuantity, 
                p.specifications, 
                p.releaseDate, 
                p.warrantyPeriod, 
                p.productImg, 
                p.createdAt, 
                p.updatedAt, 
                p.description ,
                o.offerPercentage,
                o.startDate,
                o.endDate ,
                COALESCE(avg(r.rate), 5) as overallRating
    `;
    query += `
        FROM 
          PRODUCTS  p
        LEFT JOIN
            OFFERS o  ON o.productId = p.productId
        LEFT JOIN 
            REVIEWS r ON r.productId = p.productId
    `;
    if (filters)
      query += `
    where ${filters.join(" and ")}       
    `;
    query += `
            GROUP BY 
                p.productId, 
                p.productName, 
                p.category, 
                p.manufacture, 
                p.price, 
                p.stockQuantity, 
                p.releaseDate, 
                p.warrantyPeriod, 
                p.productImg, 
                p.createdAt, 
                p.updatedAt, 
                p.description ,
                o.offerPercentage,
                o.startDate,
                o.endDate 
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
const retrieveProductByIdDb = async (id) => {
  try {
    const query = `
    SELECT 
      p.productId, 
      p.productName, 
      p.category, 
      p.manufacture, 
      p.price, 
      p.stockQuantity, 
      p.specifications, 
      p.releaseDate, 
      p.warrantyPeriod, 
      p.productImg, 
      p.createdAt, 
      p.updatedAt, 
      p.description ,
      o.offerPercentage,
      o.startDate,
      o.endDate ,
      COALESCE(avg(r.rate), 5) as overallRating , 
      JSON_AGG(
      json_build_object(
      'reviewId', r.reviewId, 
      'userId', r.userId,
      'userName', (select concat (firstName,' ' , lastName) as userName from users where userId = r.userId),
      'rate', r.rate, 
      'review', r.review, 
      'createdAt', r.createdAt
      )) as reviews
    FROM 
      products p 
      left join offers o on p.productId = o.productId
      left join reviews r on p.productId = r.productId
    WHERE p.productId = $1
    group by
    p.productId,
    p.productName,
    p.category, 
    p.manufacture, 
    p.price, 
    p.stockQuantity, 
    p.releaseDate, 
    p.warrantyPeriod, 
    p.productImg, 
    p.createdAt, 
    p.updatedAt, 
    p.description ,
    o.offerPercentage,
    o.startDate,
    o.endDate 
  `;
    const res = await pool.query(query, [id]);
    if (res.rowCount) return res.rows[0];
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {
  addProductDb,
  retrieveAllProductsDb,
  editProductDb,
  retrieveProductByIdDb,
};
