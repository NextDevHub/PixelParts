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
} from "../databases/orderDb.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getCheckoutSession = catchAsyncError(async (req, res, next) => {
  //create the session
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
            name: "PixelParts Product",
          },
          unit_amount: 100,
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
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.client_reference_id;
    const paymentStatus = "Paid";
    await updateOrderStatus([orderId, paymentStatus]);
  }
  res.status(200).json({ received: true });
});
export { getCheckoutSession, addOrder, webhookCheckout };
