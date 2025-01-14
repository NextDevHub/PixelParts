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

const updateMyInfo = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let { firstName, lastName, phoneNumber, gender, birthDate, email } = req.body;
  if (!id) return next(new AppError("id is required", 400));
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
  console.log(updatedAttributes);
  if (!updatedAttributes.length)
    return next(new AppError("No Valid attributes to update", 400));
  updatedAttributes.push("updatedAt = current_timestamp");
  const updatedUser = await editUserDb(id, updatedAttributes);
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

export { updateMyInfo };
