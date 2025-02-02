import pool from "../server.js";

const retrieveTableSize = async (table) => {
  try {
    const sanitizedTable = table.replace(/[^a-zA-Z0-9_]/g, "");
    const query = `select count(*) as ${sanitizedTable} from ${sanitizedTable}`;
    const res = await pool.query(query);
    return res.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const retrieveOrdersMonthlyStats = async () => {
  try {
    let query = `
      WITH months AS (
      SELECT generate_series(1, 12) AS month
    )
    SELECT 
      m.month,
      COALESCE(COUNT(o.orderDate), 0) AS orderCount
    FROM 
      months m
    LEFT JOIN 
      orders o
    ON 
      EXTRACT(MONTH FROM o.orderDate) = m.month
    GROUP BY 
      m.month
    ORDER BY 
      m.month;
  
      `;
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const retrieveOrdersTotalMoney = async () => {
  try {
    const query = `
                    select 
                      sum(totalPrice) as ordersTotalMoney
                    from Orders 
      `;
    const res = await pool.query(query);
    return res.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export {
  retrieveTableSize,
  retrieveOrdersMonthlyStats,
  retrieveOrdersTotalMoney,
};
