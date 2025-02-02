import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const ordersPerPage = 8;

  useEffect(() => {
    const fetchOrders = async () => {

      try {
        const authToken = Cookies.get("authToken");
        if (!authToken) {
          throw new Error("User is not authenticated.");
        }
        const response = await fetch(
          "https://pixelparts-dev-api.up.railway.app/api/v1/order/getMyOrders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch orders.");
        }

        const data = await response.json();
        setOrders(data.data.myOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => 
    (paymentStatusFilter ? order.paymentstatus === paymentStatusFilter : true) &&
    (paymentMethodFilter ? order.paymentmethod === paymentMethodFilter : true)
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  else if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl font-bold text-center">No orders found.</h2>
      </div>
    );
  }
  else return (
    <div className="container mx-auto mt-36 p-5">
      <h2 className="text-2xl font-bold mb-5 text-center">My Orders</h2>
      
      <div className="flex flex-wrap justify-center gap-4 mb-5">
        <select
          className="p-2 border rounded"
          onChange={(e) => setPaymentStatusFilter(e.target.value)}
          value={paymentStatusFilter}
        >
          <option value="">All Payment Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
        </select>

        <select
          className="p-2 border rounded"
          onChange={(e) => setPaymentMethodFilter(e.target.value)}
          value={paymentMethodFilter}
        >
          <option value="">All Payment Methods</option>
          <option value="Cash">Cash</option>
          <option value="Card">Credit Card</option>
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-3 px-4 border">Order ID</th>
              <th className="py-3 px-4 border">Total Price</th>
              <th className="py-3 px-4 border">Order Date</th>
              <th className="py-3 px-4 border">Payment Method</th>
              <th className="py-3 px-4 border">Payment Status</th>
              <th className="py-3 px-4 border">Products</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.orderid} className="text-center bg-gray-50 hover:bg-gray-100">
                <td className="py-3 px-4 border">{order.orderid}</td>
                <td className="py-3 px-4 border">${order.totalprice}</td>
                <td className="py-3 px-4 border">{new Date(order.orderdate).toLocaleDateString()}</td>
                <td className="py-3 px-4 border">{order.paymentmethod}</td>
                <td className="py-3 px-4 border font-semibold text-blue-600">{order.paymentstatus}</td>
                <td className="py-3 px-4 border">
                  {order.products.map((product) => (
                    <div key={product.productId} className="text-sm">
                      Product ID: {product.productId} (x{product.quantity})
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-4 py-2 rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;