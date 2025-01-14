///// authetication contoller
import Joi from "joi";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { catchAsyncError, AppError, formatString } from "../utilites.js";
import { addUserDb, getUserByEmailDb } from "../databases/authDb.js";
import app from "../app.js";

// Define the schema for validating user data
const userValidator = Joi.object({
  firstName: Joi.string().max(30).min(3).optional().messages({
    "string.base": "First name must be a string.",
    "string.empty": "First name cannot be empty.",
    "string.max": "First name cannot exceed 20 characters.",
    "string.min": "Last name must exceed 3 characters.",
    "any.required": "First name is required.",
  }),
  lastName: Joi.string().max(30).min(3).optional().messages({
    "string.base": "Last name must be a string.",
    "string.empty": "Last name cannot be empty.",
    "string.max": "Last name cannot exceed 20 characters.",
    "string.min": "Last name must exceed 3 characters.",
    "any.required": "Last name is required.",
  }),
  phoneNumber: Joi.string().max(11).optional().messages({
    "string.base": "Phone number must be a string.",
    "string.max": "Phone number cannot exceed 11 characters.",
  }),
  email: Joi.string().email().max(30).optional().messages({
    "string.base": "Email must be a string.",
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email cannot be empty.",
    "string.max": "Email cannot exceed 30 characters.",
    "any.required": "Email is required.",
  }),
  gender: Joi.string().valid("Male", "Female").optional().messages({
    "any.only": 'Gender must be either "Male" or "Female".',
    "any.required": "Gender is required.",
  }),
  birthDate: Joi.date().optional().messages({
    "date.base": "Birth date must be a valid date.",
  }),
  password: Joi.string().max(16).optional().messages({
    "string.base": "Password must be a string.",
    "string.empty": "Password cannot be empty.",
    "string.max": "Password cannot exceed 110 characters.",
    "any.required": "Password is required.",
  }),
});

const createToken = (id) => {
  const JWT = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return JWT;
};
const sendAndSignToken = async (user, res) => {
  const token = createToken(user.userid);
  res.cookie("jwt", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: false,
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    token,
    date: { user },
  });
};

const register = catchAsyncError(async (req, res, next) => {
  let { firstName, lastName, email, phoneNumber, gender, birthDate, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !gender ||
    !birthDate ||
    !password
  ) {
    return next(
      new AppError(
        "firstName , lastName, email, phoneNumber, gender, birthDate and  password are required fields",
        400
      )
    );
  }
  const { error, value } = userValidator.validate(
    {
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      birthDate,
      password,
    },
    { abortEarly: false }
  );
  if (error) {
    return next(new AppError("Invalid Atrributes", 400));
  }
  if (!validator.isEmail(email)) {
    return next(new AppError("Invalid Email", 400));
  }
  firstName = formatString(firstName);
  lastName = formatString(lastName);
  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = await addUserDb([
    firstName,
    lastName,
    email,
    phoneNumber,
    gender,
    birthDate,
    encryptedPassword,
    "User",
    "Pending",
  ]);

  if (!user)
    return next(new AppError("An Error Occured Please Try Again", 400));
  delete user.password;
  sendAndSignToken(user, res);
});
const logIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please Provide your email and passeod", 400));
  const candidateUser = await getUserByEmailDb(email);

  if (
    !candidateUser ||
    !(await bcrypt.compare(password, candidateUser.password))
  )
    return next(new AppError("Invalid Email or Password", 400));
  delete candidateUser.password;
  sendAndSignToken(candidateUser, res);
});
export { register, logIn, userValidator };
