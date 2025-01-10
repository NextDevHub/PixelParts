import { query } from "express";
import pool from "./server.js";

const createUsersTable = `create table Users
(
    userId int generated always as identity (start with 1 increment by 1), 
    firstName varchar(30) not null, 
    lastName varchar(30) not null, 
    phoneNumber varchar(110), 
    email varchar(30) unique, 
    gender varchar(8) check (gender in ('Male', 'Female')),
    createdAt timestamp default current_timestamp, 
    updatedAt timestamp default current_timestamp, 
    birthDate date , 
    verificationCode int default null,
    codeExpiresAt timestamp default null,
    password varchar(110) not null, 
    userRole varchar(15) not null default 'User',
    userState varchar(10) default 'Pending' check (userState in ('Active', 'Pending', 'Blocked')),
    primary key (userId)
);
`;

const createProdutisTable = ` create table Products 
`;
const createTable = async (query) => {
  try {
    const res = await pool.query(query);
    console.log(res);
  } catch (error) {}
};
createTable(createUsersTable);
