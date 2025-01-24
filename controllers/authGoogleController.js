import {
  catchAsyncError,
  AppError,
  formatString,
  orderQueryHandler,
  fieldsQueryHandler,
  filterQueryHandler,
} from "../utilites.js";
import { addUserDb, getUserByEmailDb } from "../databases/authDb.js";
const googleController = catchAsyncError(async (req, res, next) => {
  const {
    given_name: firstName,
    family_name: lastName,
    email,
  } = req.user._json;

  /// clear user data and logout of request
  req.logout((err) => {
    if (err) {
      console.log("Error logging out:", err);
      throw new AppError("Error logging out", 500);
    }

    req.session.destroy((err) => {
      if (err) {
        console.log("Error destroying session:", err);
        throw new AppError("Error destroying session", 500);
      }

      // Clear the cookie
      res.clearCookie("connect.sid", { path: "/" });
    });
  });
  delete req.user;
  req.user = { firstName, lastName, email };
  res.redirect("https://pixelparts.vercel.app/");
  const user = await getUserByEmailDb(email);
  const message = user
    ? "User has been Already registered"
    : "User has not been registered";
  const isRegistered = user ? true : false;

  res.status(200).json({
    status: "success",
    isRegistered,
    message,
    data: {
      user: { firstName, lastName, email },
    },
  });
});
const registerWithGoogle = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email } = req.user;
  const user = await getUserByEmailDb(email);
  if (user)
    return res
      .status(400)
      .json({ message: "User has been Already registered" });

  res.status(200).json({
    status: "success",
    data: {
      user: { firstName, lastName, email },
    },
  });
});
const loginWithGoogle = catchAsyncError(async (req, res, next) => {
  const { email } = req.user;
  const user = await getUserByEmailDb(email);
  if (!user)
    return res.status(400).json({ message: "User has not been registered" });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
const failGoogle = catchAsyncError(async (req, res, next) => {
  res.status(400).json({
    status: "fail",
    ok: false,
    message: "An error occured While logIn to your gmail account",
  });
});
export { googleController, registerWithGoogle, loginWithGoogle, failGoogle };
