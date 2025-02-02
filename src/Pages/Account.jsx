import ActiveLastBreadcrumb from "../components/common/components/Link";
import { Link } from "react-router-dom";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import { AuthContext } from "../Auth/authContext";
import { useState, useEffect, useContext } from "react";
import i18n from "../components/common/components/LangConfig";
import Cookies from "js-cookie";

const Account = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const { currentUser, updateUserData, setCurrentUser } =
    useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser) {
          setFirstName(currentUser.firstname);
          setLastName(currentUser.lastname);
          setEmail(currentUser.email);
          setAddress(currentUser?.address ? currentUser.address : "");
          setPhoneNumber(currentUser.phonenumber);
        } else {
          console.log("User document not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      await updateUserData({
        firstName,
        lastName,
        email,
        address,
        phoneNumber,
      });
      setMessage("Changes saved successfully.");
      setOpen(true);
    } catch (error) {
      setError(error.message);
      setOpen(true);
    }
  };

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required.");
      setOpen(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation password do not match.");
      setOpen(true);
      return;
    }

    try {
      const authToken = Cookies.get("authToken");
      if (!authToken) {
        throw new Error("User is not authenticated.");
      }

      const response = await fetch(
        "https://pixelparts-dev-api.up.railway.app/api/v1/user/updateMyPassword",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword: currentPassword,
            newPassword: newPassword,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password.");
      }

      // Extract response data
      const data = await response.json();
      const { token, date } = data;
      const user = date?.user;

      // Store updated token and user data in cookies
      Cookies.set("authToken", token, { expires: 7, path: "/" });
      Cookies.set("userData", JSON.stringify(user), { expires: 7, path: "/" });
      console.log("Updated Token:", Cookies.get("authToken")); // Verify updated token

      setCurrentUser(user);
      setMessage("Password updated successfully.");
      setOpen(true);
    } catch (error) {
      setError(error.message);
      setOpen(true);
    }
  };

  return (
    <div className="flex flex-col mx-4 md:ml-36 mt-48 gap-20 justify-center md:justify-between ">
      <div className="flex justify-between   flex-col gap-4 md:flex-row ">
        <ActiveLastBreadcrumb
          path={`${i18n.t("accountPage.home")}/ ${i18n.t(
            "accountPage.myAccount",
          )}`}
        />
        <h1 className="text-sm md:mr-44">
          {i18n.t("accountPage.welcome")}{" "}
          <span className="text-red-600">
            {firstName} {lastName}
          </span>
        </h1>
      </div>
      <div className="flex flex-col md:flex-row gap-28">
        <nav className="flex flex-col gap-4 text-gray-400">
          <h1 className="text-black text-sm md:text-base  font-medium">
            {i18n.t("accountPage.ManageMyAccount")}
          </h1>
          <ul>
            <li className="px-4 py-2">
              <Link
                to="/account"
                className="hover:underline hover:underline-offset-8 ease-in-out duration-300 transform  focus:text-red-600"
              >
                {i18n.t("accountPage.myProfile")}
              </Link>
            </li>
            <li className="px-4 py-2">
              <Link
                to="/account"
                className="hover:underline hover:underline-offset-8 ease-in-out duration-300 transform  focus:text-red-600"
              >
                {i18n.t("accountPage.addressBook")}
              </Link>
            </li>
            <li className="px-4 py-2">
              <Link
                to="/account"
                className="hover:underline hover:underline-offset-8 ease-in-out duration-300 transform  focus:text-red-600"
              >
                {i18n.t("accountPage.myPaymentOptions")}
              </Link>
            </li>
          </ul>
           <Link
                to="/myOrders"
                className="hover:underline hover:underline-offset-8 ease-in-out duration-300 transform  focus:text-red-600"
              >
          <h1 className="text-black text-sm md:text-base  font-medium">
            {i18n.t("accountPage.myOrders")}
          </h1>
              </Link>
          <ul>
            <li className="px-4 py-2">
              <Link
                to="/myOrders"
                className="hover:underline hover:underline-offset-8 ease-in-out duration-300 transform  focus:text-red-600"
              >
                {i18n.t("accountPage.myReturns")}
              </Link>
            </li>
            <li className="px-4 py-2">
              <Link
                to="/myOrders"
                className="hover:underline hover:underline-offset-8 ease-in-out duration-300 transform  focus:text-red-600"
              >
                {i18n.t("accountPage.myCancelations")}
              </Link>
            </li>
          </ul>
          <h1 className="text-black text-sm md:text-base  font-medium">
            <Link
              to="/wishlist"
              className="hover:underline hover:underline-offset-8 ease-in-out duration-300 transform "
            >
              {i18n.t("accountPage.myWishlist")}
            </Link>
          </h1>
        </nav>
        <div className="shadow  w-[full] flex flex-col py-10 md:px-20 px-5 rounded">
          <div className="flex flex-col gap-6 md:w-[710px]">
            <span className="text-xl font-medium text-red-600">
              {i18n.t("accountPage.editYourProfile")}
            </span>
            <div className="flex flex-col md:flex-row gap-6 md:gap-[50px] justify-between">
              <div className="flex flex-col gap-2 w-full">
                <span className="text-sm md:text-base ">
                  {i18n.t("accountPage.firstName")}
                </span>
                <input
                  type="text"
                  placeholder={firstName ? firstName : "your first name"}
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                  className=" rounded bg-gray-100 bg-opacity-100 px-4 py-3 text-gray-400 text-sm md:text-base  focus:border outline-none focus:border-gray-300  "
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <span className="text-sm md:text-base ">{i18n.t("accountPage.lastName")}</span>
                <input
                  type="text"
                  placeholder={lastName ? lastName : "your last name"}
                  required
                  onChange={(e) => setLastName(e.target.value)}
                  className=" rounded bg-gray-100 bg-opacity-100 px-4 py-3 text-gray-400 text-sm md:text-base  focus:border outline-none focus:border-gray-300  "
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-[50px] justify-between">
              <div className="flex flex-col gap-2 w-full">
                <span className="text-sm md:text-base ">
                  {i18n.t("accountPage.email")}
                </span>
                <input
                  type="email"
                  placeholder={email ? email : "your email"}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className=" rounded bg-gray-100 bg-opacity-100 px-4 py-3 text-gray-400 text-sm md:text-base  focus:border outline-none focus:border-gray-300  "
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <span className="text-sm md:text-base ">
                  {i18n.t("accountPage.address")}
                </span>
                <input
                  type="address"
                  placeholder={address ? address : "your address"}
                  required
                  onChange={(e) => setAddress(e.target.value)}
                  className=" rounded bg-gray-100 bg-opacity-100 px-4 py-3 text-gray-400 text-sm md:text-base  focus:border outline-none focus:border-gray-300  "
                />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-8 text-sm md:text-base ">
              {/* Cancel and save changes buttons */}
              <button
                onClick={() => {
                  // Reset form values
                  setFirstName("");
                  setLastName("");
                  setEmail("");
                  setAddress("");
                  setPhoneNumber("");
                }}
                className="hover:underline underline-offset-4  ease-in-out  duration-300 transform hover:-translate-y-1"
              >
                {i18n.t("accountPage.cancel")}
              </button>
              <button
                onClick={handleSaveChanges}
                className="text-sm md:text-lg bg-red-600 text-white px-6 md:px-12 py-3 rounded hover:bg-red-500 transition-transform duration-100 transform hover:translate-y-[-4px] focus:translate-y-0"
              >
                {i18n.t("accountPage.saveChanges")}
              </button>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <span className="text-sm md:text-base ">
                {i18n.t("accountPage.passwordChanges")}
              </span>
              <input
                // type="password"
                placeholder={i18n.t("accountPage.currentPassword")}
                required
                onChange={(e) => setCurrentPassword(e.target.value)}
                className=" rounded bg-gray-100 bg-opacity-100 px-4 py-3 text-gray-400 text-sm md:text-base  focus:border outline-none focus:border-gray-300  "
              />
              <input
                // type="password"
                placeholder={i18n.t("accountPage.newPassword")}
                required
                onChange={(e) => setNewPassword(e.target.value)}
                className=" rounded bg-gray-100 bg-opacity-100 px-4 py-3 text-gray-400 text-sm md:text-base  focus:border outline-none focus:border-gray-300  "
              />
              <input
                type="password"
                placeholder={i18n.t("accountPage.confirmPassword")}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                className=" rounded bg-gray-100 bg-opacity-100 px-4 py-3 text-gray-400 text-sm md:text-base  focus:border outline-none focus:border-gray-300  "
              />
            </div>
            <div className="ml-auto flex items-center gap-8 text-sm md:text-base ">
              {/* Cancel and save changes buttons */}
              <button
                onClick={() => {
                  // Reset form values
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="hover:underline underline-offset-4  ease-in-out  duration-300 transform hover:-translate-y-1"
              >
                {i18n.t("accountPage.cancel")}
              </button>
              <button
                onClick={handleSavePassword}
                className="text-sm md:text-lg bg-red-600 text-white px-6 md:px-12 py-3 rounded hover:bg-red-500 transition-transform duration-100 transform hover:translate-y-[-4px] focus:translate-y-0"
              >
                {i18n.t("accountPage.saveChanges")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Snackbar for displaying success or error messages */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error ? error : message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Account;
