import Joi from "joi";
import {
  catchAsyncError,
  AppError,
  formatString,
  orderQueryHandler,
  fieldsQueryHandler,
  filterQueryHandler,
} from "../utilites.js";

import { addReviewDb } from "../databases/reviewDb.js";

// Define the Joi schema for the review with custom error messages
const reviewValidator = Joi.object({
  userId: Joi.number().integer().optional().messages({
    "number.base": '"userId" should be a number',
    "number.integer": '"userId" should be an integer',
  }),

  productId: Joi.number().integer().optional().messages({
    "number.base": '"productId" should be a number',
    "number.integer": '"productId" should be an integer',
  }),

  review: Joi.string().max(200).optional().messages({
    "string.base": '"review" should be a string',
    "string.max": '"review" should not exceed 200 characters',
  }),

  rate: Joi.number().precision(2).min(0).max(10).optional().messages({
    "number.base": '"rate" should be a number',
    "number.min": '"rate" should be at least 0',
    "number.max": '"rate" should be at most 10',
    "number.precision": '"rate" should have a maximum of two decimal places',
  }),
});

const addReview = catchAsyncError(async (req, res, next) => {
  const { userId, productId } = req.params;
  const { review, rate } = req.body;
  if (!userId || !productId || !review || !rate) {
    return next(
      new AppError(
        "userId, productId, review and rate are required fields",
        400
      )
    );
  }
  const { error, value } = reviewValidator.validate({
    userId,
    productId,
    review,
    rate,
  });
  if (error) {
    console.log(error);
    return next(new AppError(error.message, 400));
  }
  const newReview = await addReviewDb([userId, productId, review, rate]);
  if (!newReview)
    return next(
      new AppError("Failed to add review , Please try again later", 400)
    );
  res.status(200).json({
    status: "success",
    ok: true,
    data: {
      newReview,
    },
  });
});

export { addReview };
