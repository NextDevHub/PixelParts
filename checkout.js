// prettier-ignore
const stripe = Stripe('pk_test_51Qld9GENLJNPkvo5ajPP3IFBbVhnoRQ4oPKAV0kV6eR9Mz2bLkcqCTEieXQiYkD6YY3dfXhB255IO7Ss3chjSTgp006SQqXC6J');
document
  .getElementById("checkout-button")
  .addEventListener("click", async () => {
    try {
      const response = await fetch(
        `https://pixelparts-dev-api.up.railway.app/api/v1/order/create-checkout-session`,
        {
          method: "get", // Use POST method
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzQsImlhdCI6MTczNzkwNTU4MSwiZXhwIjoxNzM3OTkxOTgxfQ.0n3sllc1TjnoCtcdWzW2S4I45V5oLwqf7fsBSeVpnwA`,
          },
        }
      );
      const session = await response.json();
      console.log(session.session);
      // Display session details
      document.getElementById(
        "session-id"
      ).textContent = `Session ID: ${session.sessionId}`;
      document.getElementById(
        "session-status"
      ).textContent = `Status: ${session.status}`;
      document.getElementById(
        "session-url"
      ).textContent = `URL: ${session.url}`;
      document.getElementById("session-details").style.display = "block";

      // Delay for 1 minute (60,000 milliseconds)

      if (session.status === "success") {
        // Initialize Stripe

        console.log("here");
        // Replace with your Stripe publishable key
        // Redirect to Stripe Checkout
        stripe.redirectToCheckout({ sessionId: session.session.id });
      } else {
        alert("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  });
