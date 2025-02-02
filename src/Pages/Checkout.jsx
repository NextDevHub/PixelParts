import { useState, useContext, useEffect } from "react";
import { useCart } from "../context/CartContext";
import CheckoutCartItem from "../components/Checkout/CheckoutCartItem";
import RedButton from "../components/common/components/RedButton";
import ActiveLastBreadcrumb from "../components/common/components/Link";
import { AuthContext } from "../Auth/authContext";
import Cookies from "js-cookie";
import { Snackbar, Alert } from "@mui/material";
import i18n from "../components/common/components/LangConfig";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { currentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    paymentMethod: "Cash",
  });

  const [notification, setNotification] = useState({
    message: "",
    error: false,
    open: false,
  });

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        firstName: currentUser.firstname || "",
        lastName: currentUser.lastname || "",
        phone: currentUser.phonenumber || "",
        email: currentUser.email || "",
        address: currentUser.address || "",
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      return setNotification({
        message: "User authentication required.",
        error: true,
        open: true,
      });
    }

    const orderDetails = {
      totalPrice: cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      ),
      paymentMethod: formData.paymentMethod,
      products: cartItems.map(({ id, quantity }) => ({
        productId: id,
        quantity,
      })),
    };

    try {
      const response = await fetch(
        "https://pixelparts-dev-api.up.railway.app/api/v1/order/addOrder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(orderDetails),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order.");
      }

      const { orderid, totalprice } = data.data.order;
      console.log("Order ID:", orderid);
      console.log("Total Price:", totalprice);

      setNotification({
        message: "Order placed successfully!",
        error: false,
        open: true,
      });
      // Navigate to /payment with order details
      if (formData.paymentMethod === "Card") {
        setTimeout(() => {
          navigate("/payment", {
            state: { orderId: orderid, totalPrice: totalprice },
          });
        }, 2000);
      }
    } catch (error) {
      setNotification({ message: error.message, error: true, open: true });
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto mt-36 md:mt-48 flex flex-col md:gap-10">
      <ActiveLastBreadcrumb
        path={`${i18n.t("home")}/${i18n.t("redButtons.applyCoupon")}`}
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="flex flex-col md:flex-row gap-10 md:gap-40">
          <div className="w-full md:w-[470px]">
            <h2 className="text-2xl md:text-4xl font-medium">
              {i18n.t("checkOut.billingDetails")}
            </h2>
            <div className="flex flex-col gap-4 mt-4">
              {["firstName", "lastName", "email", "phone", "address"].map(
                (field) => (
                  <div key={field} className="flex flex-col gap-1">
                    <label className="text-sm md:text-base text-gray-400">
                      {i18n.t(`checkOut.${field}`)} *
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      className="rounded bg-gray-100 px-4 py-3 text-gray-600 focus:border-gray-300 outline-none"
                    />
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="w-full md:w-[425px] flex flex-col gap-4">
            {cartItems.map((item, index) => (
              <CheckoutCartItem key={item.id} item={item} index={index} />
            ))}

            <div className="border-b flex justify-between text-base">
              <span>{i18n.t("cart.total")}:</span>
              <span>
                $
                {cartItems.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0,
                )}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {["Card", "Cash"].map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={handleChange}
                  />
                  {i18n.t(`checkOut.${method.toLowerCase()}`)}
                </label>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder={i18n.t("checkOut.couponCode")}
                className="border rounded-md p-3 w-[170px] md:w-[280px]"
              />
              <RedButton name={i18n.t("redButtons.applyCoupon")} />
            </div>

            <RedButton name={i18n.t("redButtons.placeOrder")} type="submit" />
          </div>
        </div>
      </form>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={notification.open}
        autoHideDuration={2000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={notification.error ? "error" : "success"}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Checkout;
