///// authetication DB
import pool from "../server.js";

const addUserDb = async (attributes) => {
  try {
    const query = `
    INSERT INTO USERS 
      (
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      birthDate,
      password,
      userRole,
      userState
      )
      values 
      ($1 ,$2 , $3 ,$4 ,$5 , $6 , $7 ,$8 , $9)
       RETURNING *
    `;
    const res = await pool.query(query, [...attributes]);
    if (res.rows) return res.rows[0];
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getUserByEmailDb = async (email) => {
  try {
    const query = `
        SELECT * 
        FROM 
            USERS
        WHERE 
        email=$1
        `;
    const res = await pool.query(query, [email]);
    if (res.rows) return res.rows[0];
    return false;
  } catch (error) {}
};

///test
export { addUserDb, getUserByEmailDb };
