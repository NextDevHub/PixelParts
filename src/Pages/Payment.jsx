import { useState } from "react";
import RedButton from "../components/common/components/RedButton";
import i18n from "../components/common/components/LangConfig";
import axios from "axios";
// import { loadStripe } from "@stripe/stripe-js";

// const getStripe = () => {
//   return loadStripe(
//     "pk_test_51Qld9GENLJNPkvo5ajPP3IFBbVhnoRQ4oPKAV0kV6eR9Mz2bLkcqCTEieXQiYkD6YY3dfXhB255IO7Ss3chjSTgp006SQqXC6J",
//   );
// };

const Payment = () => {
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expDate: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();
    // setLoading(true);
    // setError("");

    // try {
    //   const response = await axios.post(
    //     "https://pixelparts-dev-api.up.railway.app/api/v1/order/create-checkout-session/3/200",
    //   );

    //   if (response.data?.url) {
    //     const stripe = await getStripe();

    //     await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
    //   } else {
    //     setError("Failed to process payment.");
    //   }
    // } catch (err) {
    //   setError("Payment failed. Please try again.");
    //   console.error("Payment error:", err);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-48">
      <h1 className="text-2xl font-semibold mb-4">
        {i18n.t("payment.payment")}
      </h1>
      <form onSubmit={handlePayment}>
        <div className="mb-4">
          <label
            htmlFor="cardNumber"
            className="block text-sm font-medium text-gray-700"
          >
            {i18n.t("payment.number")}
          </label>
          <input
            type="text"
            id="cardNumber"
            className="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            value={paymentInfo.cardNumber}
            onChange={(e) =>
              setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })
            }
            placeholder={i18n.t("payment.enter")}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="expDate"
            className="block text-sm font-medium text-gray-700"
          >
            {i18n.t("payment.expirationDate")}
          </label>
          <input
            type="text"
            id="expDate"
            className="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            value={paymentInfo.expDate}
            onChange={(e) =>
              setPaymentInfo({ ...paymentInfo, expDate: e.target.value })
            }
            placeholder="MM/YY"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="cvv"
            className="block text-sm font-medium text-gray-700"
          >
            CVV
          </label>
          <input
            type="text"
            id="cvv"
            className="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            value={paymentInfo.cvv}
            onChange={(e) =>
              setPaymentInfo({ ...paymentInfo, cvv: e.target.value })
            }
            placeholder="CVV"
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <RedButton
          name={loading ? "Processing..." : i18n.t("redButtons.placeOrder")}
          disabled={loading}
        />
      </form>
    </div>
  );
};

export default Payment;
