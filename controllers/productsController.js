import Joi from "joi";
import { catchAsyncError, AppError, formatString } from "../utilites.js";
import { addProductDb } from "../databases/productDb.js";

const productValidator = Joi.object({
  category: Joi.string()
    .valid(
      "Cpu",
      "Gpu",
      "Ram",
      "Storage",
      "Motherboard",
      "Psu",
      "Case",
      "Cooling",
      "Others"
    )
    .required()
    .messages({
      "any.required": "The category field is required.",
      "string.empty": "The category field cannot be empty.",
      "any.only":
        "Category must be one of Cpu, Gpu, Ram, Storage, Motherboard, Psu, Case, Cooling, or others.",
      "string.base": "category must be string",
    }),
  productName: Joi.string().min(3).max(50).required().messages({
    "any.required": "The productName field is required.",
    "string.min": "The productName must be at least 3 characters long.",
    "string.max": "The productName must not exceed 50 characters.",
    "string.empty": "The brand field cannot be empty.",
  }),
  manufacture: Joi.string().min(3).max(100).required().messages({
    "any.required": "The manufacture field is required.",
    "string.min": "The manufacture name must be at least 3 characters long.",
    "string.max": "The manufacture name must not exceed 100 characters.",
    "string.empty": "The manufacture field cannot be empty.",
  }),
  price: Joi.number().min(0).required().messages({
    "any.required": "The price field is required.",
    "number.base": "The price must be a valid number.",
    "number.min": "The price must be greater than or equal to 0.",
  }),
  stockQuantity: Joi.number().integer().min(0).required().messages({
    "any.required": "The stock quantity field is required.",
    "number.base": "The stock quantity must be a valid integer.",
    "number.integer": "The stock quantity must be an integer.",
    "number.min": "The stock quantity must be greater than or equal to 0.",
  }),
  specifications: Joi.object()
    .pattern(
      Joi.string(), // Key name (e.g., cores, memory)
      Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean()) // Value can be a string, number, or boolean
    )
    .optional()
    .messages({
      "any.required": "The specifications field is required.",
      "object.base":
        "Specifications must be a valid object with key-value pairs.",
    }),
  releaseDate: Joi.date().optional().messages({
    "date.base": "The release date must be a valid date in YYYY-MM-DD format.",
  }),
  warrantyPeriod: Joi.number().integer().min(0).optional().messages({
    "number.base": "The warranty period must be a valid number.",
    "number.integer": "The warranty period must be an integer.",
    "number.min": "The warranty period must be greater than or equal to 0.",
  }),
});

const addProduct = catchAsyncError(async (req, res, next) => {
  let {
    productName,
    category,
    manufacture,
    price,
    stockQuantity,
    specifications,
    releaseDate,
    warrantyPeriod,
  } = req.body;
  //
  const { error, value } = productValidator.validate(
    {
      productName,
      category,
      manufacture,
      price,
      stockQuantity,
      specifications,
      releaseDate,
      warrantyPeriod,
    },
    { abortEarly: false }
  );
  if (error) {
    return next(new AppError(error.message, 400));
  }
  productName = formatString(productName);
  category = formatString(category);
  manufacture = formatString(manufacture);

  const product = await addProductDb([
    productName,
    category,
    manufacture,
    price,
    stockQuantity,
    specifications,
    releaseDate,
    warrantyPeriod,
  ]);
  if (!product)
    return next(new AppError("Failed to add Product , Please Try Again", 400));
  res.status(200).json({
    status: "success",
    ok: true,
    data: {
      product,
    },
  });
});

export { addProduct };
