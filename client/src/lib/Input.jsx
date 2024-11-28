import React from "react";

const Input = ({ label, type, icon, register, errors }) => {
  return (
    <div className="relative text-sm space-y-1">
      <label className="font-semibold pl-2 sm:text-[16px]">{label}</label>
      <input
        {...register(label, {
          required: `${label} is required!`,
        })}
        type={type}
        placeholder={label}
        autoComplete="off"
        className="p-1 pl-3 rounded-lg w-full border outline-none bg-transparent"
      />
      {icon && (
        <div className="absolute right-3 top-[52%]">
          {icon}
        </div>
      )}
      {errors[label] && (
        <p className="text-xs absolute -bottom-4 text-red-500 left-1">
          {errors[label].message}
        </p>
      )}
    </div>
  );
};

export default Input;
