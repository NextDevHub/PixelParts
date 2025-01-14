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
    console.log(query);
    const res = await pool.query(query, [id]);
    if (res.rowCount) return res.rows[0];
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { editUserDb };
