import { useState, useEffect } from "react";
import RedButton from "../components/common/components/RedButton";
import i18n from "../components/common/components/LangConfig";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51Qld9GENLJNPkvo5ajPP3IFBbVhnoRQ4oPKAV0kV6eR9Mz2bLkcqCTEieXQiYkD6YY3dfXhB255IO7Ss3chjSTgp006SQqXC6J",
);

const Payment = () => {
  const location = useLocation();
  const { orderId, totalPrice } = location.state || {};

  const [stripe, setStripe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionDetails, setSessionDetails] = useState(null);

  useEffect(() => {
    stripePromise.then((stripeInstance) => {
      setStripe(stripeInstance);
    });
  }, []);

  // useEffect(() => {
  //   handlePayment();
  // }, []);

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://pixelparts-dev-api.up.railway.app/api/v1/order/create-checkout-session/${orderId}/${totalPrice}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
            "Content-Type": "application/json",
          },
        },
      );
      const session = response.data;
      setSessionDetails(session);
      console.log(session);

      if (session.status === "success") {
        console.log("Redirecting to checkout...");
        await stripe.redirectToCheckout({ sessionId: session.session.id });
      } else {
        setError("Failed to create checkout session");
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-48">
      <h1 className="text-2xl font-semibold mb-4">
        {i18n.t("payment.payment")}
      </h1>
      {sessionDetails && (
        <div className="mb-4 p-4 border rounded bg-gray-100">
          <p>
            <strong>Session ID:</strong> {sessionDetails.sessionId}
          </p>
          <p>
            <strong>Status:</strong> {sessionDetails.status}
          </p>
          <p>
            <strong>URL:</strong>{" "}
            <a
              href="./checkout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              Go to Checkout
            </a>
          </p>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      <RedButton
        name={loading ? "Processing..." : i18n.t("redButtons.placeOrder")}
        onClick={handlePayment}
        disabled={loading}
      />
    </div>
  );
};

export default Payment;
