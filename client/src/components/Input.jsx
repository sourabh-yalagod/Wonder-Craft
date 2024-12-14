import React from "react";

const Input = ({ register, name, ...rest }) => {
  return (
    <input
      autoComplete="off"
      {...rest}
      {...register(name)}
      className="p-1 pl-2 bg-transparent border-[1px] border-gray-500 text-[13px] sm:text-[16px] rounded-lg outline-none"
    />
  );
};

export default Input;
