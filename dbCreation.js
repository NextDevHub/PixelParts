import { query } from "express";
import pool from "./server.js";

const createUsersTable = `create table Users
(
    userId int generated always as identity (start with 1 increment by 1), 
    firstName varchar(30) not null, 
    lastName varchar(30) not null, 
    phoneNumber varchar(110), 
    email varchar(50) unique, 
    gender varchar(8) check (gender in ('Male', 'Female')),
    createdAt timestamp default current_timestamp, 
    updatedAt timestamp default current_timestamp, 
    passwordUpdatedAt timestamp default current_timestamp,
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
const createReviewsTable = ` CREATE TABLE reviews (
  reviewId INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1), 
  userId INT NOT NULL, 
  productId INT NOT NULL, 
  review VARCHAR(200) NOT NULL,
  rate DECIMAL(10, 2) NOT NULL, 
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  PRIMARY KEY (reviewIds), 
  FOREIGN KEY (productId) REFERENCES products(productId) ON DELETE CASCADE, 
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

`;
const createImagesTable = `-- Step 1: Create the images table
CREATE TABLE images (
  imageId INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,   --fom simplicity not combined with productId
  productId INT NOT NULL,             -- Foreign key to the products table
  imageUrl VARCHAR(120) NOT NULL,     -- URL of the image
  FOREIGN KEY (productId) REFERENCES products(productId) ON DELETE CASCADE
);

-- Step 2: Create the trigger function to enforce the max 4 images rule
CREATE OR REPLACE FUNCTION check_max_images()
RETURNS TRIGGER AS $$
BEGIN
  -- Count the number of images already associated with the productId
  IF (SELECT COUNT(*) FROM images WHERE productId = NEW.productId) >= 4 THEN
    RAISE EXCEPTION 'A product can have a maximum of 4 images';
  END IF;

  -- Allow the insert if the number of images is less than 4
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create the trigger to call the function before insert
CREATE TRIGGER check_max_images_before_insert
BEFORE INSERT ON images
FOR EACH ROW
EXECUTE FUNCTION check_max_images();

`;
const createMessagesTable = `CREATE TABLE messages (
  messageId INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
  userId INT NOT NULL,
  message VARCHAR(320) NOT NULL,
  answer VARCHAR(320) DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  answeredAt TIMESTAMP DEFAULT NULL,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
  primary key (messageId , userId)
);

`;
const createOrdersTable = `
CREATE TABLE orders (
  orderId INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
  userId INT NOT NULL,
  totalPrice DECIMAL(10, 2) NOT NULL,
  orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paymentMethod VARCHAR(20) default NULL CHECK (paymentMethod IN ('Cash', 'Card')),
  paymentStatus VARCHAR(20) default 'Pending' NOT NULL CHECK (paymentStatus IN ('Pending', 'Paid')),
  PRIMARY KEY (orderId),
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);  
`;
const createOrderProductsTable = `CREATE TABLE orderProducts (
  orderId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (orderId, productId),
  FOREIGN KEY (orderId) REFERENCES orders(orderId) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(productId) ON DELETE CASCADE
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
