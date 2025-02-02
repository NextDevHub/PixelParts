import Stripe from "stripe";
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
  createOrder,
  createOrderProduct,
  updateOrderStatus,
  retrieveOrders,
} from "../databases/orderDb.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const validAttributes = [
  "o.orderId",
  "o.userId",
  "o.totalPrice",
  "o.paymentMethod",
];

const getCheckoutSession = catchAsyncError(async (req, res, next) => {
  //create the session
  console.log("hello from checkout session");
  const { totalPrice, orderId } = req.params;
  if (
    !totalPrice ||
    !orderId ||
    !Number.isFinite(totalPrice * 1) ||
    !Number.isFinite(orderId * 1)
  ) {
    return next(new AppError("You must provide totalPrice and orderId", 400));
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/`,
    customer_email: req.user.email,
    client_reference_id: req.params.orderId,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "PixelParts Products",
          },
          unit_amount: req.params.totalPrice * 100,
        },
        quantity: 1,
      },
    ],
  });
  res.status(200).json({
    status: "success",
    ok: true,
    session,
  });
});
const addOrder = catchAsyncError(async (req, res, next) => {
  const { userid } = req.user;
  const { totalPrice, products, paymentMethod } = req.body;
  if (!totalPrice || !products || !paymentMethod) {
    return next(
      new AppError(
        "you must be logged in and provide totalPrice ,  paymentMethod  and products ",
        400
      )
    );
  }
  for (const product of products) {
    const { productId, quantity } = product;
    if (!productId || !quantity) {
      throw new AppError(
        "You must provide productId and quantity for each product",
        400
      );
    }
  }
  const order = await createOrder([userid, totalPrice, paymentMethod]);
  if (!order) {
    return next(new AppError("Sorry Order not created , Try again later", 400));
  }
  const orderId = order.orderid;

  for (const product of products) {
    const { productId, quantity } = product;
    const orderProduct = await createOrderProduct([
      orderId,
      productId,
      quantity,
    ]);
    if (!orderProduct) {
      return next(
        new AppError("Sorry Order not created , Try again later", 400)
      );
    }
  }
  res.status(200).json({
    status: "success",
    ok: true,
    data: {
      order,
    },
  });
});

const webhookCheckout = catchAsyncError(async (req, res, next) => {
  console.log("hello from webhook");
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log("error from webhook");
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  console.log(event.type);
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.client_reference_id;
    const paymentStatus = "Paid";
    const t = await updateOrderStatus([orderId, paymentStatus]);
    console.log(t);
  }
  res.status(200).json({ received: true });
});

const getAllOrders = catchAsyncError(async (req, res, next) => {
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
  let usersOrders = await retrieveOrders(fields, filters, orders, limit, page);
  if (!usersOrders) usersOrders = [];
  res.status(200).json({
    status: "success",
    ok: true,
    data: {
      orders: usersOrders,
    },
  });
});
const getMyOrders = catchAsyncError(async (req, res, next) => {
  let limit = req.query.limit || 50;
  let page = req.query.page || 1;

  delete req.query.limit;
  delete req.query.page;

  let filters = [`o.userId = ${req.user.userid}`];
  let myOrders = await retrieveOrders(
    undefined,
    filters,
    undefined,
    limit,
    page
  );
  if (!myOrders) myOrders = [];
  res.status(200).json({
    status: "success",
    ok: true,
    data: {
      myOrders,
    },
  });
});
export {
  getCheckoutSession,
  addOrder,
  webhookCheckout,
  getAllOrders,
  getMyOrders,
};
