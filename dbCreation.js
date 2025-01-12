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

const createProductsTable = ` CREATE TABLE Products (
    productId INT generated always as identity (start with 1 increment by 1), 
    productName VARCHAR(50) NOT NULL UNIQUE ,               
    category VARCHAR(50) NOT NULL,              
    manufacture VARCHAR(100) NOT NULL  ,               
    price DECIMAL(10, 2) NOT NULL,             
    stockQuantity INT NOT NULL,                
    specifications JSON,                       
    releaseDate DATE,             
    warrantyPeriod INT,                        
    productImg  varchar (120) default 'https://res.cloudinary.com/dgljetjdr/image/upload/v1734890794/ytonxmaog0lcjnkx3nfm.jpg',                  
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description varchar(400) default 'Pc components'
    PRIMARY KEY (productId)
);

`;
const createOffersTable = `CREATE TABLE Offers (
  productId INT NOT NULL,
  offerPercentage DECIMAL(5, 2) NOT NULL CHECK (offerPercentage >= 0 AND offerPercentage <= 100),
  startDate TIMESTAMP NOT NULL,
  endDate TIMESTAMP NOT NULL CHECK (endDate > startDate),
  PRIMARY KEY (productId),
  FOREIGN KEY (productId) REFERENCES Products (productId) on delete cascade
);

`;
const createTable = async (query) => {
  try {
    const res = await pool.query(query);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
createTable(createOffersTable);
