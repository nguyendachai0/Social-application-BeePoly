import React from "react";

const InputField = ({ icon: Icon, name, type = "text", value, placeholder, error, onChange }) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${error ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-purple-500`}
      placeholder={placeholder}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default InputField;