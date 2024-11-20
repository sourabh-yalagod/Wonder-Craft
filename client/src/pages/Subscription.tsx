import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import axios from "axios"; // for making requests to your backend

const stripePromise = loadStripe("pk_test_51Q8WtFFL0METoEB8pz4DFOu3Os1ohVXs5LPFrXEQEPSHYF9D7N42a4UPW6waBQO00filj86GXZufnes4GOvYhlJA00XEHs7AeD");

const CheckoutForm = () => {
  return (
    <form>
      <PaymentElement />
      <button type="submit">Submit</button>
    </form>
  );
};

export default function App() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Fetch the client secret from your backend
    axios.post("https://your-backend.com/create-payment-intent", {
      amount: 1000, // specify the amount in the smallest currency unit
    })
    .then(response => {
      setClientSecret(response.data.clientSecret);
    })
    .catch(error => {
      console.error("Error fetching client secret:", error);
    });
  }, []);

  const options = {
    clientSecret,
  };

  return (
    clientSecret && (
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    )
  );
}
