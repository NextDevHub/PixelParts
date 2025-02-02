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
  retrieveTableSize,
  retrieveOrdersMonthlyStats,
  retrieveOrdersTotalMoney,
  retrieveUsersStats,
  retrieveOrdersStats,
} from "../databases/statsDb.js";

const getStats = catchAsyncError(async (req, res, next) => {
  const { users } = await retrieveTableSize("users");
  const { products } = await retrieveTableSize("products");
  const { orders } = await retrieveTableSize("orders");
  const { messages } = await retrieveTableSize("messages");
  const monthlyStats = await retrieveOrdersMonthlyStats();
  const { orderstotalmoney: ordersTotalMoney } =
    await retrieveOrdersTotalMoney();
  const stats = {
    users,
    products,
    orders,
    messages,
    ordersTotalMoney,
    monthlyStats,
  };
  //   if (!stats) {
  //     return next(new AppError("Failed to get stats", 400));
  //   }
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
const getUserStats = catchAsyncError(async (req, res, next) => {
  const stats = await retrieveUsersStats("User");
  if (!stats) {
    return next(new AppError("Failed to get stats", 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
const getOrderStats = catchAsyncError(async (req, res, next) => {
  const stats = await retrieveOrdersStats();
  if (!stats) {
    return next(new AppError("Failed to get stats", 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
export { getStats, getUserStats, getOrderStats };
