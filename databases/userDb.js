import pool from "../server.js";

const editUserDb = async (id, updatedAttributes) => {
  try {
    const query = `
        UPDATE 
                USERS
                SET ${updatedAttributes.join(" , ")}
                WHERE userId = $1
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
const retrieveAllUsersDb = async (fields, filters, orders, limit, page) => {
  try {
    let query = "select ";
    if (fields) query += fields;
    else
      query += ` 
        u.userId,
        u.firstName,
        u.lastName,
        u.phoneNumber,
        u.email,  
        u.birthDate,
        u.createdAt,
        u.updatedAt,
        u.userRole,
        u.userState
    `;
    query += `
        FROM 
          Users u
    `;
    if (filters)
      query += `
    where ${filters.join(" and ")}       
    `;
    query += `
            GROUP BY 
              u.userId,
              u.firstName,
              u.lastName,
              u.phoneNumber,
              u.email,  
              u.birthDate,
              u.createdAt,
              u.updatedAt,
              u.userRole,
              u.userState
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
export { editUserDb, retrieveAllUsersDb };
