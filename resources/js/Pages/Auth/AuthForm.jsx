import React, { useState } from "react";
import OverlaySection from "./OverlaySection";
import PersonalInfoForm from "./PersonalInfoForm";
import UseAuthFormState from "./UseAuthFormState";

const AuthForm = () => {
  const {
    isLogin, data, errors, loading, avatar, handleSubmit, handleChange, handleDateChange, toggleForm, handleAvatarChange
  } = UseAuthFormState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="flex flex-col md:flex-row h-full transition-all duration-1000 ease-in-out relative">
          {/* Form Section */}
          <PersonalInfoForm {...{ data, errors, handleSubmit, avatar,  handleDateChange, handleAvatarChange, toggleForm, handleChange, loading, isLogin }} />

          {/* Overlay Section */}
          <OverlaySection {...{ isLogin, toggleForm }} />
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
