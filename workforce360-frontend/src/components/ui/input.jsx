import React from "react";

export const Input = ({ type = "text", value, onChange, placeholder, className = "", ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none ${className}`}
      {...props}
    />
  );
};

export default Input;
