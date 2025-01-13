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
import { addImgDb, editImgDb, retrieveImgById } from "../databases/imgDb.js";

const imgValidator = Joi.object({
  productId: Joi.number().integer().optional().messages({
    "number.base": '"productId" should be a number',
    "number.integer": '"productId" should be an integer',
  }),
  imageUrl: Joi.string().optional().messages({
    "string.base": '"productImg" should be a string',
  }),
  imageId: Joi.number().integer().optional().messages({
    "number.base": '"imageId" should be a number',
    "number.integer": '"imageId" should be an integer',
  }),
});

const addImg = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;
  const { imageUrl } = req;
  if (!productId || !imageUrl) {
    return next(
      new AppError("productId and imageUrl are required fields", 400)
    );
  }
  const { error, value } = imgValidator.validate({
    productId,
    imageUrl,
  });
  if (error) {
    console.log(error);
    return next(new AppError(error.message, 400));
  }
  const newImg = await addImgDb([productId, imageUrl]);
  if (!newImg) {
    return next(new AppError("Failed to add image", 500));
  }
  res.status(201).json({
    status: "success",
    data: {
      newImg,
    },
  });
});
const editImg = catchAsyncError(async (req, res, next) => {
  const { imageId } = req.params;
  const { imageUrl } = req;
  if (!imageId || !imageUrl) {
    return next(new AppError("imageId and imageUrl are required fields", 400));
  }
  const { error, value } = imgValidator.validate({
    imageId,
    imageUrl,
  });
  if (error) {
    console.log(error);
    return next(new AppError(error.message, 400));
  }
  /// delete current from cloud
  const currentImg = await retrieveImgById(imageId);
  if (!currentImg) return next(new AppError("Image not found", 400));
  if (currentImg.imageurl) {
    await deleteFromCloud(currentImg.imageurl);
  }
  // add new image to cloud
  const editedImg = await editImgDb([imageId, imageUrl]);
  if (!editedImg) {
    return next(new AppError("Failed to edit image ", 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      editedImg,
    },
  });
});
export { addImg, editImg };
