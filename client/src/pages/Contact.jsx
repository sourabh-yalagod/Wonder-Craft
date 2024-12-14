import { useForm } from "react-hook-form";
import Input from "../components/Input";
import { motion } from "framer-motion";
import { axiosInstance } from "../lib/AxiosInstance";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    setLoading(true);

    const response = await axiosInstance.post("/api/users/email", data);
    console.log(response.data);
    setLoading(false);

    if (response.status == 201) {
      toast(
        response.data.message || `please check the email sent to ${data.email}`,
        {
          description: new Date().toLocaleString(),
        }
      );
    } else {
      toast(`something gone wrong falied to send Email to ${data.email}`, {
        description: new Date().toLocaleString(),
      });
    }
  };

  return (
    <motion.div
      className="min-h-screen w-full grid place-items-center px-3"
      initial={{ opacity: 0, scale: 0, x: "-100%" }}
      animate={{ opacity: 1, scale: 1, x: 0, direction: "revert" }}
    >
      <form
        className="min-w-[350px] shadow-[0.1px_0.1px_8px_0.1px_black] rounded-lg w-full space-y-4 p-5 max-w-[500px] border grid"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-center text-xl">Send Email</h1>
        <Input
          type="text"
          name="name"
          register={register}
          placeholder="Name"
          required
        />
        <Input
          type="email"
          register={register}
          name="email"
          placeholder="email"
          required
        />
        <textarea
          {...register("message")}
          placeholder="write your email .  .  .  .  . "
          className="border-[1px] bg-transparent min-h-32 border-gray-400 rounded-lg p-2 outline-none"
        />
        <button
          type="submit"
          className="w-full text-center bg-blue-500 text-white p-1 hover:bg-blue-600 transition-all hover:scale-[99%] rounded-lg"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Submit"}
        </button>
      </form>
    </motion.div>
  );
};

export default Contact;
