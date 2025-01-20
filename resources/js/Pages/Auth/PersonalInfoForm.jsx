import React from "react";
import { FaEnvelope, FaLock, FaUser, FaSpinner, FaCalendar, FaVenusMars, FaCamera } from "react-icons/fa";
import DatePickerField from "./DatePickerField";
import SelectField from "./SelectField";
import InputField from "./InputField";
import AvatarUploader from "./AvatarUploader";

const PersonalInfoForm = ({ data, errors, handleChange, handleSubmit, handleDateChange, handleAvatarChange, isLogin, loading, avatar, toggleForm }) => {

  return (
    <div className={`w-full md:w-1/2 p-8 transition-transform duration-1000 ease-in-out transform ${isLogin ? "translate-x-0" : "md:translate-x-full"}`}>
      <h2 className="text-3xl font-bold mb-2 text-gray-800 transform transition-all duration-1000 ease-in-out">
        {isLogin ? "Welcome Back!" : "Create Account"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {!isLogin && <AvatarUploader
          avatar={avatar}
          data={data}
          onAvatarChange={handleAvatarChange}
        />}

        {!isLogin && (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <>
            <InputField
              icon={FaUser}
              name="firstName"
              value={data.firstName}
              placeholder="First name"
              error={errors.firstName}
              onChange={handleChange}
            />
            <InputField
              icon={FaUser}
              name="surName"
              value={data.surName}
              placeholder="Surname"
              error={errors.surName}
              onChange={handleChange}
            />
          </>

        </div>)}

        <InputField
          icon={FaEnvelope}
          name="contactInfo"
          value={data.contactInfo}
          placeholder="Email address"
          error={errors.contactInfo}
          onChange={handleChange}
        />

        {!isLogin && (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DatePickerField label="Date of Birth"
            selected={data.dateOfBirth}
            onChange={handleDateChange}
            error={errors.dateOfBirth}
          />

          <SelectField
            name="gender"
            value={data.gender}
            error={errors.gender}
            onChange={handleChange}
          />
        </div>)}

        <InputField
          icon={FaLock}
          name="password"
          type="password"
          value={data.password}
          placeholder={`Enter your ${isLogin ? "password" : "new password"}`}
          error={errors.password}
          onChange={handleChange}
        />



        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
          {isLogin ? "Sign In" : "Create Account"}
        </button>
        <div className="text-center md:hidden">
          {isLogin ? (
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a
                href="#"
                onClick={toggleForm}
                className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent hover:underline"
              >
                Sign Up Now
              </a>
            </p>
          ) : (
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="#"
                onClick={toggleForm}
                className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent hover:underline"
              >
                Sign In
              </a>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;
