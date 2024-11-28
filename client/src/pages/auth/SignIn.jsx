import { toast } from "sonner";
import Input from "@/lib/Input";
import { Loader, Loader2, Lock, Mail, User, UserCheck2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { axiosInstance } from "@/lib/AxiosInstance";

const SignIn = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formHandler = async (data) => {
    try {
      setLoading(true);
      console.log("Form submitted successfully", data);
      const response = await axiosInstance?.post(`/api/users/signin`, data);
      if (response?.data?.token) {
        localStorage.setItem("token", response?.data?.token);
        navigate("/home");
        toast("user log-in successfull.", { duration: 1.5 });
      }
    } catch (error) {
      console.log(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center min-h-screen px-3 py-5">
      <div className="w-full mt-16 space-y-5">
        <motion.h1
          initial={{ y: 400, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 1, delay: 0.5 }}
          className="text-center font-semibold text-2xl"
        >
          Log-In
        </motion.h1>
        <motion.form
          initial={{ y: -400, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 1 }}
          // className="text-center font-semibold text-2xl"
          onSubmit={handleSubmit(formHandler)}
          className="min-w-[300px] w-full mx-auto max-w-[500px] space-y-5 p-3 border rounded-xl pt-10"
        >
          <Input
            type="text"
            label="Username"
            register={register}
            errors={errors}
            icon={<User className="size-5" />}
          />
          <Input
            type="password"
            label="Password"
            register={register}
            errors={errors}
            icon={<Lock className="size-5" />}
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="w-full p-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {loading ? <Loader className="animate-spin mx-auto" /> : "Submit"}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full p-1 text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Back
            </button>
            <button
              type="reset"
              className="w-full p-1 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Reset
            </button>
          </div>
          <div
            onClick={() => navigate("/create-account")}
            className="flex w-full items-center cursor-pointer justify-center gap-2"
          >
            <UserCheck2 className="size-5" />
            <p>Don't have an account</p>
            <span className="text-blue-800 underline hover:text-blue-700 hover:text-[17px] transition-all">
              Create Account
            </span>{" "}
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default SignIn;
