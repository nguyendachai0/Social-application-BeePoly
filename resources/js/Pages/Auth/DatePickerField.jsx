import React from "react";
import DatePicker from "react-datepicker";
import { FaCalendar } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerField = ({label, selected, onChange, error }) => (
  <div>
    <div className="relative">
      <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${error ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-purple-500`}
        placeholderText={label}
        maxDate={new Date()}
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  </div>
);
export default DatePickerField;
