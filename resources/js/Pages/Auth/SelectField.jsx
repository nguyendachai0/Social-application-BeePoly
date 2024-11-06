import React from "react";
import { FaVenusMars } from "react-icons/fa";

const SelectField = ({ name, value, error, onChange }) => (
  <div>
    <div className="relative">
      <FaVenusMars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${error ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-purple-500`}
      >
        <option value="">Select gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  </div>
);
export default SelectField;