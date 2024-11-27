import Input from "@/lib/Input";
import { Lock, Mail, User } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const formHandler = async (data) => {
    console.log("Form submitted successfully", data);
    const response = await axios.post(
      `http://localhost:3000/api/users/create-user`,
      data
    );
    console.log(response.data)
    console.log(response.data.user.rowCount);
    
    if(response.data.user.rowCount){
      navigate('/signin')
    }
  };

  return (
    <div className="w-full flex justify-center min-h-screen px-3 py-5">
      <div className="w-full mt-16 space-y-5">
        <motion.h1
          initial={{ y: -200 }}
          animate={{ y: 0 }}
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
              Submit
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
        </motion.form>
      </div>
    </div>
  );
};

export default SignUp;
