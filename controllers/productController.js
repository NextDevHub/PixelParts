import Joi from "joi";
import {
  catchAsyncError,
  AppError,
  formatString,
  orderQueryHandler,
  fieldsQueryHandler,
  filterQueryHandler,
  deleteFromCloud,
} from "../utilites.js";
import {
  addProductDb,
  retrieveAllProductsDb,
  editProductDb,
  retrieveProductByIdOrNameDb,
} from "../databases/productDb.js";
import app from "../app.js";
import { json } from "express";
const validAttributes = ["productName", "category", "price", ""];

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
    .optional()
    .messages({
      "string.empty": "The category field cannot be empty.",
      "any.only":
        "Category must be one of Cpu, Gpu, Ram, Storage, Motherboard, Psu, Case, Cooling, or others.",
      "string.base": "category must be string",
    }),
  productName: Joi.string().min(3).max(50).optional().messages({
    "string.min": "The productName must be at least 3 characters long.",
    "string.max": "The productName must not exceed 50 characters.",
    "string.empty": "The brand field cannot be empty.",
  }),
  manufacture: Joi.string().min(3).max(100).optional().messages({
    "string.min": "The manufacture name must be at least 3 characters long.",
    "string.max": "The manufacture name must not exceed 100 characters.",
    "string.empty": "The manufacture field cannot be empty.",
  }),
  price: Joi.number().min(0).optional().messages({
    "number.base": "The price must be a valid number.",
    "number.min": "The price must be greater than or equal to 0.",
  }),
  stockQuantity: Joi.number().integer().min(0).optional().messages({
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
  description: Joi.string().optional().min(1).max(399).messages({
    "string.min": "The manufacture name must be at least 3 characters long.",
    "string.max": "The manufacture name must not exceed 100 characters.",
    "string.empty": "The manufacture field cannot be empty.",
  }),
  productImg: Joi.string().optional().messages({
    "string.base": "The productImg must be a string.",
  }),
});
const validateAndFormatAttributes = (req, next, edit) => {
  let {
    productName,
    category,
    manufacture,
    price,
    stockQuantity,
    specifications,
    releaseDate,
    warrantyPeriod,
    description,
  } = req.body;
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
      description,
    },
    { abortEarly: false }
  );
  if (error) {
    return next(new AppError(error.message, 400));
  }
  productName = formatString(productName);
  category = formatString(category);
  manufacture = formatString(manufacture);
  if (edit)
    return [
      ["productName", productName],
      ["category", category],
      ["manufacture", manufacture],
      ["price", price],
      ["stockQuantity", stockQuantity],
      ["releaseDate", releaseDate],
      ["warrantyPeriod", warrantyPeriod],
      ["description", description],
    ];
  return [
    productName,
    category,
    manufacture,
    price,
    stockQuantity,
    specifications,
    releaseDate,
    warrantyPeriod,
    description,
  ];
};

const addProduct = catchAsyncError(async (req, res, next) => {
  let { productName, category, manufacture, price, stockQuantity } = req.body;
  if (!productName || !category || !manufacture || !price || !stockQuantity)
    return next(
      new AppError(
        "productName ,category ,manufacture ,price and stockQuantity are required Fields",
        400
      )
    );
  const attributes = validateAndFormatAttributes(req, next);
  const product = await addProductDb(attributes);
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
const getAllProducts = catchAsyncError(async (req, res, next) => {
  let fields;
  if (req.query.fields) {
    fields = fieldsQueryHandler(req.query, validAttributes);
    if (!fields) return next(new AppError("Invalid query atrributes", 400));
    if (fields.length == 0) fields = undefined;
  }
  delete req.query.fields;

  let orders;

  if (req.query.order) {
    orders = orderQueryHandler(req.query, validAttributes);
    console.log(orders);
    if (!orders) return next(new AppError("Invalid query atrributes", 400));
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
    if (!filters) return next(new AppError("Invalid query atrributes", 400));
    if (filters.length == 0) filters = undefined;
  }
  let products = await retrieveAllProductsDb(
    fields,
    filters,
    orders,
    limit,
    page
  );
  if (!products) products = [];
  res.status(200).json({
    status: "success",
    ok: true,
    data: {
      products,
    },
  });
});
const editProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { specifications } = req.body;
  if (!id) return next(new app("Please Provide Product Id ", 400));
  const { imageUrl } = req;
  if (imageUrl) {
    const { error, value } = productValidator.validate({
      productImg: imageUrl,
    });
    if (error) {
      console.log(error);
      return next(new AppError(error.message, 400));
    }
    const product = await retrieveProductByIdOrNameDb(id);
    if (!product)
      return next(new AppError("No Product Found With This Id", 404));
    if (product[0].productimg) await deleteFromCloud(product[0].productimg);
    const updatedProduct = await editProductDb(id, [
      `  productImg = '${imageUrl}' `,
    ]);
    if (!updatedProduct)
      return next(new AppError("Failed To Update Product Image", 400));
    return res.status(200).json({
      status: "success",
      ok: true,
      data: {
        updatedProduct,
      },
    });
  }
  let attributes = validateAndFormatAttributes(req, next, true);
  const updatedAttributes = attributes
    .map((el) => {
      if (
        el[0] === "price" ||
        el[0] === "warrantyPeriod" ||
        el[0] === "stockQuantity"
      ) {
        if (el[1]) return ` ${el[0]} = ${el[1]}`;
      } else if (el[1]) return ` ${el[0]} = '${el[1]}'`;
    })
    .filter((el) => el !== undefined);
  console.log("hi");

  if (!updatedAttributes.length)
    return next(new AppError("No Valid Attributes to update", 400));
  if (specifications)
    updatedAttributes.push(
      `specifications = '${JSON.stringify(specifications)}' `
    );
  updatedAttributes.push("updatedAt = CURRENT_TIMESTAMP");

  const updatedProduct = await editProductDb(id, updatedAttributes);
  if (!updatedAttributes)
    return next(new AppError("Failed To Update Attributes", 400));
  res.status(200).json({
    status: "success",
    ok: true,
    data: {
      updatedProduct,
    },
  });
});
const getProduct = catchAsyncError(async (req, res, next) => {
  const { param } = req.params;
  let productId, productName;
  if (!param) return next(new AppError("Please Provide Product Id", 400));
  if (Number.isFinite(Number(param))) {
    productId = param;
  } else {
    productName = param;
  }
  const product = await retrieveProductByIdOrNameDb(productId, productName);
  if (!product)
    return next(new AppError("No Product Found With This Id or Name", 404));
  res.status(200).json({
    status: "success",
    ok: true,
    data: {
      product,
    },
  });
});
export { addProduct, getAllProducts, editProduct, getProduct };
