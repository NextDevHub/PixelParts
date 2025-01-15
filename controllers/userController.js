import Joi from "joi";
import {
  catchAsyncError,
  AppError,
  formatString,
  orderQueryHandler,
  fieldsQueryHandler,
  filterQueryHandler,
} from "../utilites.js";
import { editUserDb } from "../databases/userDb.js";
import { userValidator } from "./authController.js";
import { retrieveAllUsersDb } from "../databases/userDb.js";
import e from "express";
const validAttributes = ["userId", "userRole", "userState"];

const updateMyInfo = catchAsyncError(async (req, res, next) => {
  const { userid } = req.user;
  let { firstName, lastName, phoneNumber, gender, birthDate, email } = req.body;
  if (!userid) return next(new AppError("id is required", 400));
  const { error, value } = userValidator.validate(
    {
      firstName,
      lastName,
      phoneNumber,
      gender,
      birthDate,
      email,
    },
    { abortEarly: false }
  );
  if (error) {
    return next(new AppError(error.message, 400));
  }
  firstName = formatString(firstName);
  lastName = formatString(lastName);
  const updatedAttributes = [
    ["firstName", firstName],
    ["lastName", lastName],
    ["phoneNumber", phoneNumber],
    ["gender", gender],
    ["birthDate", birthDate],
    ["email", email],
  ]
    .map((el) => {
      if (el[1]) return ` ${el[0]} = '${el[1]}'`;
    })
    .filter((el) => el !== undefined);
  if (!updatedAttributes.length)
    return next(new AppError("No Valid attributes to update", 400));
  updatedAttributes.push("updatedAt = current_timestamp");
  const updatedUser = await editUserDb(userid, updatedAttributes);
  if (!updatedUser) {
    return next(new AppError("Failed to update user", 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      updatedUser,
    },
  });
});
const getAllUsers = catchAsyncError(async (req, res, next) => {
  let fields;
  if (req.query.fields) {
    fields = fieldsQueryHandler(req.query, validAttributes);
    if (!fields) return next(new AppError("Invalid query attributes", 400));
    if (fields.length == 0) fields = undefined;
  }
  delete req.query.fields;

  let orders;

  if (req.query.order) {
    orders = orderQueryHandler(req.query, validAttributes);
    console.log(orders);
    if (!orders) return next(new AppError("Invalid query attributes", 400));
    if (orders.length == 0) orders = undefined;
  }
  delete req.query.order;

  let limit = req.query.limit || 50;
  let page = req.query.page || 1;

  delete req.query.limit;
  delete req.query.page;

  let filters;
  if (req.query) {
    filters = filterQueryHandler(req.query, validAttributes);
    console.log(filters);
    if (!filters) return next(new AppError("Invalid query attributes", 400));
    if (filters.length == 0) filters = undefined;
  }
  let users = await retrieveAllUsersDb(fields, filters, orders, limit, page);
  if (!users) users = [];
  res.status(200).json({
    status: "success",
    ok: true,
    data: {
      users,
    },
  });
});
const updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { userState } = req.body;
  if (!id || !userState)
    return next(new AppError("iD  and userState are required", 400));
  const { error, value } = userValidator.validate(
    { userState },
    {
      abortEarly: false,
    }
  );
  if (error) {
    console.log(error);
    return next(new AppError(error.message, 400));
  }
  const updatedUser = await editUserDb(id, [`userState = '${userState}'`]);
  if (!updatedUser) return next(new AppError("Failed to update user", 400));
  res.status(200).json({
    status: "success",
    data: {
      updatedUser,
    },
  });
});
export { updateMyInfo, getAllUsers, updateUser };
