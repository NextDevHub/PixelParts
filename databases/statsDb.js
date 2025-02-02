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

const retrieveUsersStats = async (role) => {
  try {
    let query = `
        SELECT 
        SUM(CASE WHEN userState = 'Active' THEN 1 ELSE 0 END) AS active${role}s,
        ROUND(SUM(CASE WHEN userState = 'Active' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(*), 0), 2) AS activePercentage,
    
        SUM(CASE WHEN userState = 'Pending' THEN 1 ELSE 0 END) AS pending${role}s,
        ROUND(SUM(CASE WHEN userState = 'Pending' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(*), 0), 2) AS pendingPercentage,
    
        SUM(CASE WHEN userState = 'Blocked' THEN 1 ELSE 0 END) AS blocked${role}s,
        ROUND(SUM(CASE WHEN userState = 'Blocked' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(*), 0), 2) AS blockedPercentage
    
       
        FROM Users
        where userRole=$1
        `;

    const res = await pool.query(query, [role]);
    return res.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const retrieveOrdersStats = async () => {
  try {
    const query = `
        SELECT 
        COUNT(*) as totalOrders,
        SUM(CASE WHEN paymentStatus = 'Paid' THEN 1 ELSE 0 END) AS paidOrders,
        ROUND(SUM(CASE WHEN paymentStatus = 'Paid' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(*), 0), 2) AS paidPercentage,
    
        SUM(CASE WHEN paymentStatus = 'Pending' THEN 1 ELSE 0 END) AS pendingOrders,
        ROUND(SUM(CASE WHEN paymentStatus = 'Pending' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(*), 0), 2) AS pendingPercentage,
    
        SUM(CASE WHEN paymentStatus = 'Cancelled' THEN 1 ELSE 0 END) AS cancelledOrders,
        ROUND(SUM(CASE WHEN paymentStatus = 'Cancelled' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(*), 0), 2) AS cancelledPercentage,

        SUM(CASE WHEN PaymentMethod = 'Cash' THEN 1 ELSE 0 END) AS cashOrders,
        ROUND(SUM(CASE WHEN PaymentMethod = 'Cash' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(*), 0), 2) AS cashPercentage,

        SUM(CASE WHEN PaymentMethod = 'Card' THEN 1 ELSE 0 END) AS cardOrders,
        ROUND(SUM(CASE WHEN PaymentMethod = 'Card' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(*), 0), 2) AS cardPercentage

        FROM Orders
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
  retrieveUsersStats,
  retrieveOrdersStats,
};
