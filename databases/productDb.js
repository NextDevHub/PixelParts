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
const retrieveProductByIdOrNameDb = async (id, name) => {
  try {
    const params = id ? [id] : [`${name}%`]; // Add the '%' wildcard to the name parameter
    const whereClause = id ? "p.productId = $1" : "p.productName ILIKE $1"; // Use ILIKE for case-insensitive matching

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
      p.description,
      o.offerPercentage,
      o.startDate,
      o.endDate,
      COALESCE(avg(r.rate), 5) as overallRating, 
      COALESCE(
        (
          SELECT JSON_AGG(
            json_build_object(
              'reviewId', sub_r.reviewId, 
              'userId', sub_r.userId,
              'userName', (SELECT CONCAT(firstName, ' ', lastName) FROM users WHERE userId = sub_r.userId),
              'rate', sub_r.rate, 
              'review', sub_r.review, 
              'createdAt', sub_r.createdAt
            )
          )
          FROM (
            SELECT DISTINCT r.reviewId, r.userId, r.rate, r.review, r.createdAt
            FROM reviews r
            WHERE r.productId = p.productId
          ) sub_r
        ), '[]'::json
      ) as reviews , 
      COALESCE(
        (
          SELECT JSON_AGG(
            json_build_object(
              'imageId', sub_i.imageId,
              'imageUrl', sub_i.imageUrl
            )
          )
          FROM (
            SELECT DISTINCT i.imageId, i.imageUrl
            FROM images i
            WHERE i.productId = p.productId
          ) sub_i
        ), '[]'::json
      ) as images
    FROM 
      products p 
      LEFT JOIN offers o ON p.productId = o.productId
      LEFT JOIN reviews r ON p.productId = r.productId
      LEFT JOIN images i ON p.productId = i.productId
    WHERE
      ${whereClause}
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
      p.description,
      o.offerPercentage,
      o.startDate,
      o.endDate;
  `;
    // Use the query safely with parameters
    const result = await pool.query(query, params);

    const res = await pool.query(query, params);
    if (res.rowCount) return res.rows;
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
  retrieveProductByIdOrNameDb,
};
