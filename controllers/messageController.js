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
  createMessage,
  updateMessage,
  deleteMessage,
  retrieveMessages,
} from "../databases/messageDb.js";

const messageValidator = Joi.object({
  userId: Joi.number().integer().min(1).optional().messages({
    "number.base": "The userId must be a valid number.",
    "number.integer": "The userId must be an integer.",
    "number.min": "The userId must be greater than or equal to 1.",
  }),
  message: Joi.string().min(1).max(320).optional().messages({
    "string.min": "The message must be at least 10 characters long.",
    "string.max": "The message must not exceed 200 characters.",
    "string.empty": "The message field cannot be empty.",
    "any.required": "The message field is required.",
  }),
  answer: Joi.string().min(10).max(200).optional().messages({
    "string.min": "The answer must be at least 10 characters long.",
    "string.max": "The answer must not exceed 200 characters.",
    "string.empty": "The answer field cannot be empty.",
  }),
  messageId: Joi.number().integer().min(1).optional().messages({
    "number.base": "The messageId must be a valid number.",
    "number.integer": "The messageId must be an integer.",
    "number.min": "The messageId must be greater than or equal to 1.",
  }),
});

const addMessage = catchAsyncError(async (req, res, next) => {
  const { userid } = req.user;
  const { message } = req.body;
  if (!userid || !message)
    return next(
      new AppError("Please provide a valid user id and message", 400)
    );
  const { value, error } = messageValidator.validate({
    userId: userid,
    message,
  });
  if (error) return next(new AppError(error.message, 400));
  const newMessage = await createMessage([userid, message]);
  if (!newMessage) {
    return next(new AppError("Failed to add message.", 500));
  }
  res.status(201).json({
    status: "success",
    ok: true,
    data: {
      message: newMessage,
    },
  });
});
const answerMessage = catchAsyncError(async (req, res, next) => {
  const { userid } = req.user;
  const { messageId } = req.params;
  const { answer } = req.body;
  if (!userid || !messageId || !answer)
    return next(
      new AppError("Please provide a valid user id, message id and answer", 400)
    );
  const { value, error } = messageValidator.validate({
    answer,
    messageId,
  });
  if (error) return next(new AppError(error.message, 400));
  const updatedMessage = await updateMessage([messageId, answer]);
  if (!updatedMessage) {
    return next(new AppError("Failed to update message.", 500));
  }
  res.status(201).json({
    status: "success",
    ok: true,
    data: {
      message: updatedMessage,
    },
  });
});
const deleteMyMessage = catchAsyncError(async (req, res, next) => {
  const { userid } = req.user;
  const { messageId } = req.params;
  if (!messageId)
    return next(new AppError("Please provide a valid message id", 400));

  const { value, error } = messageValidator.validate({ messageId });
  if (error) return next(new AppError(error.message, 400));

  const message = await retrieveMessages(messageId);
  if (message[0].userid !== userid)
    return next(
      new AppError("You are not authorized to delete this message", 403)
    );
  const deletedMessage = await deleteMessage([messageId]);
  if (!deletedMessage) {
    return next(new AppError("Failed to delete message.", 500));
  }
  res.status(204).json({
    status: "success",
    ok: true,
    data: {
      message: deletedMessage,
    },
  });
});
const getMessages = catchAsyncError(async (req, res, next) => {
  const messages = await retrieveMessages();
  if (!messages) messages = [];
  res.status(200).json({
    status: "success",
    ok: true,
    data: {
      messages,
    },
  });
});
export { addMessage, answerMessage, deleteMyMessage, getMessages };
