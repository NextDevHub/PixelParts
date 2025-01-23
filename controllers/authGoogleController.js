import {
  catchAsyncError,
  AppError,
  formatString,
  orderQueryHandler,
  fieldsQueryHandler,
  filterQueryHandler,
} from "../utilites.js";
import { addUserDb, getUserByEmailDb } from "../databases/authDb.js";
const registerGoogleController = catchAsyncError(async (req, res, next) => {
  console.log(req.user._json);
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

  // check user is not registered before
  const user = await getUserByEmailDb(email);
  if (user)
    return res
      .status(400)
      .json({ message: "User has been Already registered" });

  res.status(200).json({
    status: "success",
    data: {
      firstName,
      lastName,
      email,
    },
  });
});
export { registerGoogleController };
