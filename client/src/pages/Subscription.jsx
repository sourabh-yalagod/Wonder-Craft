import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/AxiosInstance";

// Account features
const freeAccountFeatures = [
  { id: 1, text: "Unlimited Images format conversion" },
  { id: 2, text: "Unlimited Video format conversion" },
  { id: 3, text: "No storage facility" },
];
const demoAccountFeatures = [
  { id: 1, text: "Unlimited Images format conversion" },
  { id: 2, text: "Unlimited Video format conversion" },
  { id: 3, text: "No storage facility" },
];
const paidAccountFeatures = [
  { id: 1, text: "Unlimited Images format conversion" },
  { id: 2, text: "Unlimited Video format conversion" },
  { id: 3, text: "Storage facility" },
  { id: 4, text: "Public Image and Video URL" },
  { id: 5, text: "Anytime access to all the assets" },
];

// WonderCraft description
const wonderCraftDescription =
  "WonderCraft is an innovative startup dedicated to transforming how individuals and businesses handle multimedia content. Specializing in seamless image and video conversion services, WonderCraft enables users to adapt, optimize, and repurpose media assets effortlessly...";

const AccountOptions = ({
  accountType,
  features,
  btnText,
  setAmount,
  value,
  invokePayment,
  navigateTo,
}) => {
  const navigate = useNavigate();
  return (
    <div className="p-3 rounded-xl flex-1 border-2 w-full h-fit space-y-3 hover:scale-95 transition-all">
      <h1 className="font-semibold text-center text-xl sm:text-2xl">
        {accountType}
      </h1>
      <h2 className="text-[19px]">Features</h2>
      <ul className="capitalize space-y-2">
        {features.map((feature) => (
          <li className="text-xs" key={feature.id}>
            {feature.text}
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          setAmount(value);
          if (navigateTo) navigate(navigateTo);
          if (invokePayment) invokePayment();
        }}
        className="w-full bg-blue-500 p-1 rounded-lg transition-all"
      >
        {btnText}
      </button>
    </div>
  );
};

const Subscription = () => {
  const [amount, setAmount] = useState(null);
  const navigate = useNavigate();
  const handlePayment = async () => {
    try {
      const { data: order } = await axiosInstance.post(
        "/api/payments/orders",
        { amount }
      );

      const options = {
        key: "rzp_test_ThTnCMEfPchH4a",
        amount: order.amount,
        currency: "INR",
        name: "Wonder Craft",
        description: "Test Transaction",
        order_id: order.id,
        handler: async (response) => {
          console.log("Payment response : ", response);

          const result = await axiosInstance.post(
            "/api/payments/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          if (result.data.success) {
            alert("Payment Successful!");
            navigate(`/home`);
          } else alert("Payment Failed!");
        },
        prefill: {
          name: "John Doe",
          email: "john.doe@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Failed to initiate payment");
    }
  };

  return (
    <div className="min-h-screen px-3 space-y-5 py-6 sm:px-10 md:px-18 lg:px-24">
      <h1 className="text-center font-semibold text-2xl sm:text-3xl md:text-4xl">
        Welcome to Wonder Craft
      </h1>
      <p className="text-xs sm:text-sm text-center text-slate-600 dark:text-slate-400">
        {wonderCraftDescription}
      </p>
      <div className="gap-4 h-full grid sm:grid-cols-2 sm:pt-12 md:grid-cols-3">
        <AccountOptions
          accountType={"Dry Demo"}
          value={0}
          btnText={"Try Demo"}
          setAmount={setAmount}
          features={demoAccountFeatures}
          navigateTo={"/home"}
        />
        <AccountOptions
          value={0}
          accountType={"Free Account"}
          btnText={"Free Account"}
          setAmount={setAmount}
          features={freeAccountFeatures}
          navigateTo={"/create-account"}
        />
        <AccountOptions
          accountType={"Paid"}
          setAmount={setAmount}
          invokePayment={handlePayment}
          value={25}
          btnText={"$25/Year"}
          features={paidAccountFeatures}
        />
      </div>
    </div>
  );
};

export default Subscription;
