///// authetication contoller
import Joi from "joi";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { promisify } from "util";
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
  email: Joi.string().email().max(50).optional().messages({
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
  userState: Joi.string()
    .valid("Active", "Pending", "Blocked")
    .optional()
    .messages({
      "any.only":
        'User state must be either "Active", "Pending", or "Blocked".',
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

const validateLoggedIn = catchAsyncError(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("Protected Path, Please login to get access", 401)
    );
  }

  const { id, iat } = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  if (!id) {
    return next(
      new AppError("Protected Path, Please login to get access", 401)
    );
  }

  const user = await getUserByEmailDb(undefined, id);
  if (!user) {
    return next(
      new AppError("Protected Path, Please login to get access", 401)
    );
  }

  // Compare password updated time with JWT issued at time
  const passwordUpdatedAt = new Date(user.passwordupdatedat);
  const tokenIssuedAt = new Date(iat * 1000 - 2 * 60 * 60 * 1000 + 1000); // Convert iat from seconds to milliseconds
  if (passwordUpdatedAt > tokenIssuedAt) {
    return next(
      new AppError("Password has been changed. Please login again.", 401)
    );
  }

  // If blocked or pending
  if (user.userstate !== "Active") {
    return next(
      new AppError("Please activate your account first to do any action", 401)
    );
  }

  req.user = user;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userrole)) {
      throw new AppError(
        "You don't have the permission to perform this action",
        403
      );
    }
    next();
  };
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
    return next(new AppError(error.message, 400));
  }
  if (!validator.isEmail(email)) {
    return next(new AppError("Invalid Email", 400));
  }
  firstName = formatString(firstName);
  lastName = formatString(lastName);
  const encryptedPassword = await bcrypt.hash(password, 10);
  let role = "User";
  let state = "Pending";
  let { userRole, userState } = req.body;
  if (
    (userRole || userState) &&
    req?.user?.userrole !== "Admin" &&
    req?.user?.userstate !== "Active"
  )
    return next(new AppError("You don't have permissions to add Admin ", 400));
  role = userRole ? userRole : role;
  state = userState ? userState : state;
  console.log(role, state);
  const user = await addUserDb([
    firstName,
    lastName,
    email,
    phoneNumber,
    gender,
    birthDate,
    encryptedPassword,
    role,
    state,
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
const adminRegister = catchAsyncError(async (req, res, next) => {
  delete req.body.userRole;
  delete req.body.userState;
  req.body.userRole = "Admin";
  req.body.userState = "Active";
});

export {
  register,
  logIn,
  adminRegister,
  userValidator,
  restrictTo,
  validateLoggedIn,
  sendAndSignToken,
};
