import Joi from "joi";
import {
  catchAsyncError,
  AppError,
  formatString,
  orderQueryHandler,
  fieldsQueryHandler,
  filterQueryHandler,
} from "../utilites.js";
import {
  addOfferDb,
  editOfferDb,
  retrieveOfferById,
} from "../databases/offerDb.js";

const offerValidator = Joi.object({
  productId: Joi.number().integer().positive().optional().messages({
    "number.base": "Product ID must be a number.",
    "number.integer": "Product ID must be an integer.",
    "number.positive": "Product ID must be a positive integer.",
  }),
  offerPercentage: Joi.number().min(0).max(100).optional().messages({
    "number.base": "Offer percentage must be a number.",
    "number.min": "Offer percentage must be at least 0.",
    "number.max": "Offer percentage must not exceed 100.",
  }),
  startDate: Joi.date().optional().messages({
    "date.base": "Start date must be a valid date.",
  }),
  endDate: Joi.date().greater(Joi.ref("startDate")).optional().messages({
    "date.base": "End date must be a valid date.",
    "date.greater": "End date must be after the start date.",
  }),
});

const addOffer = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;
  const { offerPercentage, startDate, endDate } = req.body;
  if (!productId || !offerPercentage || !startDate || !endDate)
    return next(
      new AppError(
        "productId, offerPercentage, startDate and  endDate are required Attributes",
        400
      )
    );
  const { error, value } = offerValidator.validate({
    productId,
    offerPercentage,
    startDate,
    endDate,
  });
  if (error) {
    return next(new AppError(error.message, 400));
  }
  const curOffer = await retrieveOfferById(productId);
  if (curOffer) return editOffer(req, res, next);
  const offer = await addOfferDb([
    productId,
    offerPercentage,
    startDate,
    endDate,
  ]);
  if (!offer)
    return next(
      new AppError("failed to create offer . Please try again later", 400)
    );
  res.status(200).json({
    status: "success",
    ok: true,
    data: { offer },
  });
});
const editOffer = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;
  const { offerPercentage, startDate, endDate } = req.body;
  if (!productId) return next(new AppError("Please Provide productId", 400));
  const { error, value } = offerValidator.validate({
    productId,
    offerPercentage,
    startDate,
    endDate,
  });
  if (error) {
    return next(new AppError(error.message, 400));
  }
  let updatedAttributes = [];
  if (offerPercentage)
    updatedAttributes.push(` offerPercentage = ${offerPercentage} `);
  if (startDate) updatedAttributes.push(` startDate = '${startDate}' `);
  if (endDate) updatedAttributes.push(` endDate = '${endDate}' `);
  if (!updatedAttributes.length)
    return next(new AppError("No Valid Attributes to update...", 400));
  updatedAttributes.join(" , ");
  const updatedOffer = await editOfferDb(productId, updatedAttributes);
  if (!updatedOffer)
    new AppError("failed to update offer . Please try again later", 400);
  res.status(200).json({
    status: "success",
    ok: true,
    data: {
      offer: updatedOffer,
    },
  });
});

export { addOffer, editOffer };
