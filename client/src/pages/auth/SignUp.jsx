import Input from "@/lib/Input";
import { Loader, Lock, Mail, User, User2Icon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { axiosInstance } from "@/lib/AxiosInstance";
const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const formHandler = async (data) => {
    try {
      setLoading(true);
      console.log(data);
      const response = await axiosInstance?.post(
        `/api/users/create-user`,
        data
      );

      if (response.data.user.rowCount) {
        navigate("/signin");
      }
    } catch (error) {
      console.log(error);
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
          Create Account
        </motion.h1>
        <motion.form
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          transition={{ ease: "easeInOut", duration: 1 }}
          // className="text-center font-semibold text-2xl"
          onSubmit={handleSubmit(formHandler)}
          className="min-w-[300px] w-full mx-auto max-w-[500px] space-y-4 p-3 border rounded-xl pt-10"
        >
          <Input
            type="text"
            label="Username"
            register={register}
            errors={errors}
            icon={<User className="size-5" />}
          />
          <Input
            type="email"
            label="Email"
            register={register}
            errors={errors}
            icon={<Mail className="size-5" />}
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
            onClick={() => navigate("/signin")}
            className="flex w-full items-center cursor-pointer justify-center gap-2"
          >
            <User2Icon className="size-5" />
            <p>Already have an account</p>
            <span className="text-blue-800 underline hover:text-blue-700 hover:text-[17px] transition-all">
              SignIn
            </span>{" "}
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default SignUp;
